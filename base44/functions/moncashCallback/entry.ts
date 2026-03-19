import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  const APP_URL = 'https://taperpayer.com';

  // Parse request — support GET (Moncash gateway redirect) and POST (from MoncashReturn page)
  let orderId, token;
  const url = new URL(req.url);
  const isPost = req.method === 'POST';

  if (isPost) {
    const body = await req.json();
    orderId = body.orderId;
    token = body.token;
  } else {
    orderId = url.searchParams.get('orderId');
    token = url.searchParams.get('token');
  }

  console.log('Moncash callback received:', { orderId, method: req.method });

  if (!orderId) {
    if (isPost) return Response.json({ error: 'Missing orderId' }, { status: 400 });
    return Response.redirect(`${APP_URL}/MoncashReturn?error=missing_order`, 302);
  }

  try {
    // Use service role — no user auth needed for this webhook/callback
    const base44 = createClientFromRequest(req);

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
      return Response.redirect(`${APP_URL}/MoncashReturn?success=1&phone=${encodeURIComponent(pending.phone_number)}&amount=${pending.amount}`, 302);
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

    if (!topupRes.ok) {
      const errMsg = topupData.message || topupData.errors?.[0]?.message || `DTone error ${topupRes.status}`;
      await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'failed', error_message: errMsg });
      if (isPost) return Response.json({ error: errMsg }, { status: 400 });
      return Response.redirect(`${APP_URL}/MoncashReturn?failed=1`, 302);
    }

    await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'completed' });
    console.log('Topup completed for phone:', pending.phone_number);

    if (isPost) return Response.json({ success: true, phone: pending.phone_number, amount: pending.amount });
    return Response.redirect(`${APP_URL}/MoncashReturn?success=1&phone=${encodeURIComponent(pending.phone_number)}&amount=${pending.amount}`, 302);

  } catch (error) {
    console.error('Moncash Callback Error:', error.message);
    if (isPost) return Response.json({ error: error.message }, { status: 500 });
    return Response.redirect(`${APP_URL}/MoncashReturn?error=1`, 302);
  }
});