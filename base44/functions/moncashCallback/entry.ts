import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  const APP_URL = 'https://taperpayer.com';

  try {
    // Use service role — this endpoint is called by Moncash (no user session)
    const base44 = createClientFromRequest(req);

    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');
    const transactionId = url.searchParams.get('transactionId');
    const token = url.searchParams.get('token');

    console.log('Moncash callback received:', { orderId, transactionId, token });

    if (!orderId) {
      return new Response(null, {
        status: 302,
        headers: { 'Location': `${APP_URL}/TaperPayerTopUp?moncash=error` }
      });
    }

    // Look up the pending topup by orderId (service role - no user auth needed)
    const pendingTopups = await base44.asServiceRole.entities.PendingTopup.filter({ order_id: orderId });

    if (!pendingTopups || pendingTopups.length === 0) {
      console.error('No pending topup found for orderId:', orderId);
      return new Response(null, {
        status: 302,
        headers: { 'Location': `${APP_URL}/TaperPayerTopUp?moncash=error&reason=not_found` }
      });
    }

    const pending = pendingTopups[0];

    // Don't process twice
    if (pending.status === 'completed') {
      console.log('Topup already completed for orderId:', orderId);
      return new Response(null, {
        status: 302,
        headers: { 'Location': `${APP_URL}/TaperPayerTopUp?moncash=success&phone=${encodeURIComponent(pending.phone_number)}` }
      });
    }

    if (pending.status === 'failed') {
      return new Response(null, {
        status: 302,
        headers: { 'Location': `${APP_URL}/TaperPayerTopUp?moncash=paid_but_topup_failed` }
      });
    }

    // Process the airtime top-up via DTone (same provider as card payments)
    try {
      const dtoneKey = Deno.env.get('DTONE_API_KEY');
      const dtoneSecret = Deno.env.get('DTONE_API_SECRET');
      const dtoneAuth = 'Basic ' + btoa(`${dtoneKey}:${dtoneSecret}`);

      const externalId = `MONCASH-${orderId}`;

      // Use product_id if we have it, otherwise find the product by operator
      let productId = pending.product_id;

      if (!productId) {
        // Fallback: look up products for the operator and pick the closest amount
        console.log('No product_id stored, looking up DTone products for operator:', pending.operator_id);
        const productsRes = await fetch(
          `https://dvs-api.dtone.com/v1/products?operator_id=${pending.operator_id}&type=FIXED_VALUE_RECHARGE&per_page=100`,
          { headers: { Authorization: dtoneAuth, Accept: 'application/json' } }
        );
        const productsData = await productsRes.json();
        const products = Array.isArray(productsData) ? productsData : (productsData.data || []);
        console.log('DTone products found:', products.length);

        if (products.length === 0) {
          throw new Error(`No DTone products found for operator ${pending.operator_id}`);
        }

        // Pick product whose retail amount is closest to the stored amount
        const targetAmount = parseFloat(pending.amount);
        const best = products.reduce((prev, curr) => {
          const prevAmt = parseFloat(prev.prices?.retail?.amount ?? prev.suggested_amounts?.[0] ?? prev.face_value ?? 0);
          const currAmt = parseFloat(curr.prices?.retail?.amount ?? curr.suggested_amounts?.[0] ?? curr.face_value ?? 0);
          return Math.abs(currAmt - targetAmount) < Math.abs(prevAmt - targetAmount) ? curr : prev;
        });
        productId = best.id;
        console.log('Selected closest product:', productId, 'for amount:', targetAmount);
      }

      // Send the top-up via DTone synchronous transactions
      const payload = {
        product_id: parseInt(productId),
        auto_confirm: true,
        credit_party_identifier: { mobile_number: pending.phone_number },
        external_id: externalId,
      };

      console.log('Sending DTone top-up:', JSON.stringify(payload));

      const topupRes = await fetch('https://dvs-api.dtone.com/v1/sync/transactions', {
        method: 'POST',
        headers: {
          Authorization: dtoneAuth,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const topupData = await topupRes.json();
      console.log('DTone topup result:', JSON.stringify(topupData).substring(0, 500));

      if (!topupRes.ok) {
        throw new Error(topupData.message || topupData.description || `DTone error: ${topupRes.status}`);
      }

      // Mark as completed
      await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'completed' });

      console.log('Topup completed successfully for phone:', pending.phone_number, 'orderId:', orderId);

      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${APP_URL}/TaperPayerTopUp?moncash=success&phone=${encodeURIComponent(pending.phone_number)}&amount=${pending.amount}`
        }
      });

    } catch (topupErr) {
      console.error('Topup failed after Moncash payment:', topupErr.message);
      await base44.asServiceRole.entities.PendingTopup.update(pending.id, {
        status: 'failed',
        error_message: topupErr.message,
      });

      return new Response(null, {
        status: 302,
        headers: { 'Location': `${APP_URL}/TaperPayerTopUp?moncash=paid_but_topup_failed` }
      });
    }

  } catch (error) {
    console.error('Moncash Callback Error:', error.message, error.stack);
    return new Response(null, {
      status: 302,
      headers: { 'Location': `${APP_URL}/TaperPayerTopUp?moncash=error` }
    });
  }
});