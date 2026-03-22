import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  const APP_URL = 'https://taperpayer.com';

  // Parse request — support GET (Moncash gateway redirect) and POST (from MoncashReturn page)
  let orderId, token;
  const url = new URL(req.url);
  const isPost = req.method === 'POST';

  let transactionId;
  if (isPost) {
    const body = await req.json();
    orderId = body.orderId;
    token = body.token;
    transactionId = body.transactionId;
  } else {
    orderId = url.searchParams.get('orderId');
    token = url.searchParams.get('token');
    transactionId = url.searchParams.get('transactionId');
  }

  console.log('Moncash callback params:', { orderId, transactionId, method: req.method });

  if (!orderId && !transactionId && !token) {
    if (isPost) return Response.json({ error: 'Missing orderId, transactionId, or token' }, { status: 400 });
    return Response.redirect(`${APP_URL}/MoncashReturn?error=missing_order`, 302);
  }

  try {
    // Use service role — no user auth needed for this webhook/callback
    const base44 = createClientFromRequest(req);

    // Authenticate with MonCash if we need to look up orderId from token or transactionId
    if (!orderId && (token || transactionId)) {
      const moncashClientId = Deno.env.get('MONCASH_API_KEY');
      const moncashClientSecret = Deno.env.get('MONCASH_API_SECRET');
      const encodedCredentials = btoa(`${moncashClientId}:${moncashClientSecret}`);

      const authRes = await fetch('https://moncashbutton.digicelgroup.com/Api/oauth/token', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${encodedCredentials}`, 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'scope=read,write&grant_type=client_credentials',
      });
      const authData = await authRes.json();
      const accessToken = authData.access_token;
      console.log('MonCash auth status:', authRes.status, 'has token:', !!accessToken);

      if (accessToken) {
        // Try token-based lookup first (MonCash standard redirect)
        if (token) {
          const verifyRes = await fetch('https://moncashbutton.digicelgroup.com/Api/v1/RetrievePayment', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          const verifyData = await verifyRes.json();
          console.log('MonCash verify by token:', JSON.stringify(verifyData).substring(0, 400));
          orderId = verifyData?.payment?.reference || verifyData?.reference || verifyData?.orderId;
        }

        // Fall back to transactionId lookup
        if (!orderId && transactionId) {
          const verifyRes = await fetch('https://moncashbutton.digicelgroup.com/Api/v1/RetrieveTransactionPayment', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId }),
          });
          const verifyData = await verifyRes.json();
          console.log('MonCash verify by transactionId:', JSON.stringify(verifyData).substring(0, 400));
          orderId = verifyData?.payment?.reference || verifyData?.reference;
        }
      }
    }

    if (!orderId) {
      if (isPost) return Response.json({ error: 'Could not resolve orderId from MonCash' }, { status: 400 });
      return Response.redirect(`${APP_URL}/MoncashReturn?error=missing_order`, 302);
    }

    console.log('Moncash callback processing orderId:', orderId);

    const pendingTopups = await base44.asServiceRole.entities.PendingTopup.filter({ order_id: orderId });

    if (!pendingTopups || pendingTopups.length === 0) {
      console.error('No pending topup found for orderId:', orderId);
      if (isPost) return Response.json({ error: 'Order not found' }, { status: 404 });
      return Response.redirect(`${APP_URL}/MoncashReturn?error=not_found`, 302);
    }

    const pending = pendingTopups[0];

    // Already completed — return success immediately
    if (pending.status === 'completed') {
      console.log('Topup already completed for orderId:', orderId);
      if (isPost) return Response.json({ success: true, already_completed: true, phone: pending.phone_number, amount: pending.amount });
      return Response.redirect(`${APP_URL}/ThankYou?phone=${encodeURIComponent(pending.phone_number)}&amount=${pending.amount}&method=moncash`, 302);
    }

    if (pending.status === 'failed') {
      if (isPost) return Response.json({ error: pending.error_message || 'Top-up previously failed' }, { status: 400 });
      return Response.redirect(`${APP_URL}/MoncashReturn?failed=1`, 302);
    }

    // Process DTone top-up
    const dtoneKey = Deno.env.get('DTONE_API_KEY');
    const dtoneSecret = Deno.env.get('DTONE_API_SECRET');
    const dtoneAuth = 'Basic ' + btoa(`${dtoneKey}:${dtoneSecret}`);
    const externalId = `MONCASH-${orderId}`;

    let productId = pending.product_id;

    if (!productId) {
      console.log('No product_id, looking up DTone products for operator:', pending.operator_id);
      const productsRes = await fetch(
        `https://dvs-api.dtone.com/v1/products?operator_id=${pending.operator_id}&per_page=100`,
        { headers: { Authorization: dtoneAuth, Accept: 'application/json' } }
      );
      const productsData = await productsRes.json();
      const products = Array.isArray(productsData) ? productsData : (productsData.data || []);

      if (products.length === 0) throw new Error(`No DTone products found for operator ${pending.operator_id}`);

      const targetAmount = parseFloat(pending.amount);
      let best = products[0];
      let smallestDiff = Infinity;

      for (const prod of products) {
        const prodAmt = parseFloat(prod.prices?.retail?.amount ?? prod.suggested_amounts?.[0] ?? prod.face_value ?? 0);
        const diff = Math.abs(prodAmt - targetAmount);
        if (diff < smallestDiff) {
          best = prod;
          smallestDiff = diff;
        }
      }

      productId = best.id;
      console.log(`Selected product ${productId} (~${best.prices?.retail?.amount || best.face_value}) for target $${targetAmount}`);
    }

    const payload = {
      product_id: parseInt(productId),
      auto_confirm: true,
      credit_party_identifier: { mobile_number: pending.phone_number },
      external_id: externalId,
    };

    console.log('Sending DTone top-up:', JSON.stringify(payload));

    const topupRes = await fetch('https://dvs-api.dtone.com/v1/sync/transactions', {
      method: 'POST',
      headers: { Authorization: dtoneAuth, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const topupData = await topupRes.json();
    console.log('DTone result:', JSON.stringify(topupData).substring(0, 500));

    // DTone returns 200/201 for success; treat any 2xx or COMPLETED/CONFIRMING as success
    const dtoneStatus = topupData.status;
    const isSuccess = topupRes.ok || [200, 201, 202].includes(topupRes.status);
    const isFailed = !isSuccess && dtoneStatus !== 'COMPLETED' && dtoneStatus !== 'CONFIRMING';

    if (isFailed) {
      const errMsg = topupData.message || topupData.errors?.[0]?.message || `DTone error ${topupRes.status}`;
      await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'failed', error_message: errMsg });
      if (isPost) return Response.json({ error: errMsg }, { status: 400 });
      return Response.redirect(`${APP_URL}/MoncashReturn?failed=1`, 302);
    }

    await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'completed' });
    console.log('Topup completed for phone:', pending.phone_number);

    if (isPost) return Response.json({ success: true, phone: pending.phone_number, amount: pending.amount });
    return Response.redirect(`${APP_URL}/ThankYou?phone=${encodeURIComponent(pending.phone_number)}&amount=${pending.amount}&method=moncash`, 302);

  } catch (error) {
    console.error('Moncash Callback Error:', error.message);
    if (isPost) return Response.json({ error: error.message }, { status: 500 });
    return Response.redirect(`${APP_URL}/MoncashReturn?error=1`, 302);
  }
});