import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, phoneNumber, countryCode, operatorId, rsaToken } = await req.json();

    if (!amount || !phoneNumber || !countryCode || !operatorId || !rsaToken) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const rsaBusinessKey = Deno.env.get('RSA_BUSINESS_KEY');
    const rsaSecretKey = Deno.env.get('RSA_API_SECRET_KEY');

    if (!rsaBusinessKey || !rsaSecretKey) {
      return Response.json({ error: 'RSA credentials not configured' }, { status: 500 });
    }

    // Get live exchange rate from Reloadly
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

    const authData = await reloadlyAuth.json();
    const access_token = authData.access_token;

    // Get the exchange rate for USD to HTG
    const ratesRes = await fetch(`https://api.reloadly.com/rates?from=USD&to=HTG`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const ratesData = await ratesRes.json();
    const exchangeRate = ratesData.rate || 130; // Fallback to 130 if API fails

    // Process payment via RSA API
    const transactionRef = `TPAY-${Date.now()}`;
    const amountInHTG = parseFloat(amount) * exchangeRate;
    const paymentData = {
      reference: transactionRef,
      amount: amountInHTG,
      currency: 'HTG',
      description: `Airtime top-up for ${phoneNumber}`,
      token: rsaToken,
      businessKey: rsaBusinessKey,
    };

    // Call RSA API for payment processing
    const rsaResponse = await fetch('https://api.rsapay.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rsaSecretKey}`,
      },
      body: JSON.stringify(paymentData),
    });

    const rsaResult = await rsaResponse.json();

    if (!rsaResponse.ok) {
      return Response.json(
        { error: rsaResult.message || 'RSA payment failed' },
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
      transactionId: rsaResult.id,
      topupId: topupResult.id,
      amount: amount,
      phoneNumber: phoneNumber,
      status: 'completed',
    });
  } catch (error) {
    console.error('RSA payment error:', error.message, error.stack);
    return Response.json({ error: error.message || 'Payment processing failed' }, { status: 500 });
  }
});