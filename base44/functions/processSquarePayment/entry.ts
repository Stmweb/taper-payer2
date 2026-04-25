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

    const { amount, sourceToken } = await req.json();

    if (!amount || amount <= 0 || !sourceToken) {
      return Response.json({ error: 'Missing required payment details' }, { status: 400 });
    }

    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID');

    if (!squareAccessToken || !squareLocationId) {
      return Response.json({ error: 'Square configuration missing' }, { status: 500 });
    }

    const amountCents = Math.round(amount * 100);

    console.log('Creating payment with amount:', amountCents);

    // Create the payment using the token from Square Web Payments
    const paymentPayload = {
      idempotency_key: crypto.randomUUID(),
      amount_money: {
        amount: amountCents,
        currency: 'USD',
      },
      source_id: sourceToken,
      location_id: squareLocationId,
      note: `AGNV Account Funding - ${user.email}`,
    };

    const paymentRes = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2024-04-17',
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok) {
      console.error('Square payment error:', paymentData);
      return Response.json(
        { error: paymentData.errors?.[0]?.detail || 'Payment failed' },
        { status: 400 }
      );
    }

    console.log('Payment successful:', paymentData.payment?.id);

    return Response.json({
      success: true,
      paymentId: paymentData.payment?.id,
      amount,
    });
  } catch (error) {
    console.error('processSquarePayment error:', error);
    return Response.json({ error: error.message || 'Payment processing failed' }, { status: 500 });
  }
});