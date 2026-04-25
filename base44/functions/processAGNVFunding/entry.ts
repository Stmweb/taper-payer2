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

    // Create Square Checkout
    const checkoutRes = await fetch(`https://connect.squareup.com/v2/locations/${squareLocationId}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2024-04-17',
      },
      body: JSON.stringify({
        idempotency_key: `agnv-fund-${user.id}-${Date.now()}`,
        order: {
          location_id: squareLocationId,
          line_items: [
            {
              name: 'AGNV Account Funding',
              quantity: '1',
              base_price_money: {
                amount: amountCents,
                currency: 'USD',
              },
            },
          ],
          reference_id: `user-${user.id}`,
        },
        redirect_url: `${appUrl || 'https://taperpayer.com'}/TaperPayerHome?funding=success`,
      }),
    });

    const checkoutData = await checkoutRes.json();

    if (!checkoutRes.ok) {
      console.error('Square checkout error:', checkoutData);
      return Response.json(
        { error: checkoutData.errors?.[0]?.detail || 'Failed to create checkout' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      checkoutUrl: checkoutData.checkout?.checkout_page_url,
      amount,
    });
  } catch (error) {
    console.error('processAGNVFunding error:', error);
    return Response.json({ error: error.message || 'Funding failed' }, { status: 500 });
  }
});