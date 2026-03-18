import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  const APP_URL = 'https://taperpayer.com';

  try {
    const base44 = createClientFromRequest(req);

    // Support both GET (Moncash server-to-server alert) and POST/JSON (called from return page)
    let orderId, token;
    const url = new URL(req.url);

    if (req.method === 'POST') {
      const body = await req.json();
      orderId = body.orderId;
      token = body.token;
    } else {
      orderId = url.searchParams.get('orderId');
      token = url.searchParams.get('token');
    }

    console.log('Moncash callback received:', { orderId, token, method: req.method });

    const isJsonRequest = req.method === 'POST';

    if (!orderId) {
      if (isJsonRequest) return Response.json({ error: 'Missing orderId' }, { status: 400 });
      return new Response(null, { status: 302, headers: { 'Location': `${APP_URL}/MoncashReturn?error=missing_order` } });
    }

    // Look up the pending topup
    const pendingTopups = await base44.asServiceRole.entities.PendingTopup.filter({ order_id: orderId });

    if (!pendingTopups || pendingTopups.length === 0) {
      console.error('No pending topup found for orderId:', orderId);
      if (isJsonRequest) return Response.json({ error: 'Order not found' }, { status: 404 });
      return new Response(null, { status: 302, headers: { 'Location': `${APP_URL}/MoncashReturn?error=not_found` } });
    }

    const pending = pendingTopups[0];

    // Already completed — return success
    if (pending.status === 'completed') {
      console.log('Topup already completed for orderId:', orderId);
      if (isJsonRequest) return Response.json({ success: true, already_completed: true, phone: pending.phone_number, amount: pending.amount });
      return new Response(null, { status: 302, headers: { 'Location': `${APP_URL}/MoncashReturn?success=1&phone=${encodeURIComponent(pending.phone_number)}&amount=${pending.amount}` } });
    }

    if (pending.status === 'failed') {
      if (isJsonRequest) return Response.json({ error: pending.error_message || 'Top-up previously failed' }, { status: 400 });
      return new Response(null, { status: 302, headers: { 'Location': `${APP_URL}/MoncashReturn?failed=1` } });
    }

    // Process airtime top-up via Ding (for Natcom Haiti) or DTone (for others)
    const isNatcom = pending.operator_id === '00C45BPA';

    if (isNatcom) {
      // Handle Ding for Natcom Haiti
      const dingKey = Deno.env.get('DING_API_KEY');
      const dingBase = 'https://api.dingconnect.com/api/V1';
      const externalId = `MONCASH-${orderId}`;

      let skuCode = pending.product_id;

      if (!skuCode) {
        console.log('No SkuCode stored, looking up Ding products for Haiti');
        const productsRes = await fetch(`${dingBase}/GetProducts?countryIso=HT`, {
          headers: { 'api_key': dingKey, 'Content-Type': 'application/json' }
        });
        const productsData = await productsRes.json();
        const products = Array.isArray(productsData) ? productsData : (productsData.Items || []);

        if (products.length === 0) throw new Error('No Ding products found for Haiti');

        const targetAmount = parseFloat(pending.amount);
        const best = products.find(p => p.ProviderCode === '00C45BPA') || products.reduce((prev, curr) => {
          const prevAmt = parseFloat(prev.Maximum?.SendValue ?? 0);
          const currAmt = parseFloat(curr.Maximum?.SendValue ?? 0);
          return Math.abs(currAmt - targetAmount) < Math.abs(prevAmt - targetAmount) ? curr : prev;
        });
        skuCode = best.SkuCode;
        console.log('Selected closest Ding product:', skuCode);
      }

      const payload = {
        SenderPhoneNumber: "+10000000000",
        RecipientPhoneNumber: pending.phone_number,
        SkuCode: skuCode,
        SendingAmount: parseFloat(pending.amount),
        SendingCurrencyIso: "USD",
        DistributorRef: externalId,
        ValidateOnly: false,
      };

      console.log('Sending Ding top-up:', JSON.stringify(payload).substring(0, 300));

      const topupRes = await fetch(`${dingBase}/SendTransfer`, {
        method: 'POST',
        headers: { 'api_key': dingKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const topupData = await topupRes.json();
      console.log('Ding result:', JSON.stringify(topupData).substring(0, 500));

      if (topupData.ResultCode !== 1) {
        const errMsg = topupData.ErrorCodes?.[0]?.Code || 'Ding top-up failed';
        await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'failed', error_message: errMsg });
        if (isJsonRequest) return Response.json({ error: errMsg }, { status: 400 });
        return new Response(null, { status: 302, headers: { 'Location': `${APP_URL}/MoncashReturn?failed=1` } });
      }
    } else {
      // Handle DTone for other operators
      const dtoneKey = Deno.env.get('DTONE_API_KEY');
      const dtoneSecret = Deno.env.get('DTONE_API_SECRET');
      const dtoneAuth = 'Basic ' + btoa(`${dtoneKey}:${dtoneSecret}`);
      const externalId = `MONCASH-${orderId}`;

      let productId = pending.product_id;

      if (!productId) {
        console.log('No product_id stored, looking up DTone products for operator:', pending.operator_id);
        const productsRes = await fetch(
          `https://dvs-api.dtone.com/v1/products?operator_id=${pending.operator_id}&type=FIXED_VALUE_RECHARGE&per_page=100`,
          { headers: { Authorization: dtoneAuth, Accept: 'application/json' } }
        );
        const productsData = await productsRes.json();
        const products = Array.isArray(productsData) ? productsData : (productsData.data || []);

        if (products.length === 0) throw new Error(`No DTone products found for operator ${pending.operator_id}`);

        const targetAmount = parseFloat(pending.amount);
        const best = products.reduce((prev, curr) => {
          const prevAmt = parseFloat(prev.prices?.retail?.amount ?? prev.suggested_amounts?.[0] ?? prev.face_value ?? 0);
          const currAmt = parseFloat(curr.prices?.retail?.amount ?? curr.suggested_amounts?.[0] ?? curr.face_value ?? 0);
          return Math.abs(currAmt - targetAmount) < Math.abs(prevAmt - targetAmount) ? curr : prev;
        });
        productId = best.id;
        console.log('Selected closest product:', productId);
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
        const errMsg = topupData.message || topupData.description || `DTone error ${topupRes.status}`;
        await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'failed', error_message: errMsg });
        if (isJsonRequest) return Response.json({ error: errMsg }, { status: 400 });
        return new Response(null, { status: 302, headers: { 'Location': `${APP_URL}/MoncashReturn?failed=1` } });
      }
    }

    await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'completed' });
    console.log('Topup completed for phone:', pending.phone_number);

    if (isJsonRequest) {
      return Response.json({ success: true, phone: pending.phone_number, amount: pending.amount });
    }
    return new Response(null, {
      status: 302,
      headers: { 'Location': `${APP_URL}/MoncashReturn?success=1&phone=${encodeURIComponent(pending.phone_number)}&amount=${pending.amount}` }
    });

  } catch (error) {
    console.error('Moncash Callback Error:', error.message);
    const isJsonRequest = req.method === 'POST';
    if (isJsonRequest) return Response.json({ error: error.message }, { status: 500 });
    return new Response(null, { status: 302, headers: { 'Location': `https://taperpayer.com/MoncashReturn?error=1` } });
  }
});