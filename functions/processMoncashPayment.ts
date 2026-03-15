import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { createHmac } from 'node:crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, phoneNumber, countryCode, operatorId, moncashToken } = await req.json();

    if (!amount || !phoneNumber || !countryCode || !operatorId || !moncashToken) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const moncashApiKey = Deno.env.get('MONCASH_API_KEY');
    const moncashSecret = Deno.env.get('MONCASH_API_SECRET');

    if (!moncashApiKey || !moncashSecret) {
      return Response.json({ error: 'Moncash credentials not configured' }, { status: 500 });
    }

    // Process payment via Moncash API
    const transactionRef = `TPAY-${Date.now()}`;
    const paymentData = {
      reference: transactionRef,
      amount: amount,
      currency: 'HTG',
      description: `Airtime top-up for ${phoneNumber}`,
      token: moncashToken,
    };

    // Create HMAC signature
    const signature = createHmac('sha256', moncashSecret)
      .update(JSON.stringify(paymentData))
      .digest('hex');

    const moncashResponse = await fetch('https://api.moncash.ht/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${moncashApiKey}`,
        'X-Signature': signature,
      },
      body: JSON.stringify(paymentData),
    });

    const moncashResult = await moncashResponse.json();

    if (!moncashResponse.ok) {
      return Response.json(
        { error: moncashResult.message || 'Moncash payment failed' },
        { status: 400 }
      );
    }

    // If payment successful, process the top-up via Reloadly
    const reloadlyAuth = await fetch('https://api.reloadly.com/auth/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: Deno.env.get('RELOADLY_CLIENT_ID'),
        client_secret: Deno.env.get('RELOADLY_CLIENT_SECRET'),
        grant_type: 'client_credentials',
        audience: 'https://api.reloadly.com',
      }),
    });

    const { access_token } = await reloadlyAuth.json();

    const topupRes = await fetch('https://api.reloadly.com/topups', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operatorId: operatorId,
        amount: amount,
        recipientPhone: {
          countryCode: countryCode,
          number: phoneNumber.replace(/^0/, ''),
        },
        customIdentifier: transactionRef,
      }),
    });

    const topupResult = await topupRes.json();

    if (!topupRes.ok) {
      return Response.json(
        { error: topupResult.message || 'Top-up processing failed' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      transactionId: moncashResult.id,
      topupId: topupResult.id,
      amount: amount,
      phoneNumber: phoneNumber,
      status: 'completed',
    });
  } catch (error) {
    console.error('Moncash payment error:', error.message, error.stack);
    return Response.json({ error: error.message || 'Payment processing failed' }, { status: 500 });
  }
});