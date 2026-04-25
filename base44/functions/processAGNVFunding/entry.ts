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
    const appUrl = Deno.env.get('APP_URL');

    if (!squareAccessToken || !squareLocationId) {
      return Response.json({ error: 'Square configuration missing' }, { status: 500 });
    }

    // Amount in cents
    const amountCents = Math.round(amount * 100);

    // Create Square Payment Link
    const paymentLinkRes = await fetch('https://connect.squareup.com/v2/checkout/payment-links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: `agnv-fund-${user.id}-${Date.now()}`,
        quick_pay: {
          name: 'AGNV Account Funding',
          price_money: {
            amount: amountCents,
            currency: 'USD',
          },
          description: `Fund AGNV account with ${amount} USD`,
        },
        checkout_options: {
          redirect_url: `${appUrl || 'https://taperpayer.com'}/TaperPayerHome?funding=success`,
        },
        note: `AGNV Funding for user ${user.email}`,
      }),
    });

    const paymentLinkData = await paymentLinkRes.json();

    if (!paymentLinkRes.ok) {
      console.error('Square payment link error:', paymentLinkData);
      return Response.json(
        { error: paymentLinkData.errors?.[0]?.detail || 'Failed to create payment link' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      paymentLink: paymentLinkData.payment_link?.url,
      amount,
    });
  } catch (error) {
    console.error('processAGNVFunding error:', error);
    return Response.json({ error: error.message || 'Funding failed' }, { status: 500 });
  }
});