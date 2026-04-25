import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID');

    if (!squareAccessToken || !squareLocationId) {
      return Response.json({ error: 'Square configuration missing' }, { status: 500 });
    }

    // Create idempotency key to prevent duplicate charges
    const idempotencyKey = `agnv-fund-${user.id}-${Date.now()}`;

    // Amount in cents
    const amountCents = Math.round(amount * 100);

    // Create payment request using Square Web Payments SDK flow
    // This generates a payment link the user will complete
    const paymentRes = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        source_id: 'cnp:card-nonce-ok', // Placeholder - in real flow, use Web Payments SDK nonce
        amount_money: {
          amount: amountCents,
          currency: 'USD',
        },
        location_id: squareLocationId,
        note: `AGNV Funding - ${amount} USD`,
        customer_id: user.id,
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok) {
      return Response.json(
        { error: paymentData.errors?.[0]?.detail || 'Payment failed' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      paymentId: paymentData.payment?.id,
      amount,
      message: 'Funding completed successfully',
    });
  } catch (error) {
    console.error('processAGNVFunding error:', error);
    return Response.json({ error: error.message || 'Funding failed' }, { status: 500 });
  }
});