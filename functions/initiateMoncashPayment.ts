import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, phoneNumber, countryCode, operatorId, exchangeRate } = await req.json();

    if (!amount || !phoneNumber || !countryCode || !operatorId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const moncashClientId = Deno.env.get('MONCASH_API_KEY');
    const moncashClientSecret = Deno.env.get('MONCASH_API_SECRET');

    if (!moncashClientId || !moncashClientSecret) {
      return Response.json({ error: 'Moncash credentials not configured' }, { status: 500 });
    }

    // Step 1: Get OAuth token from Moncash
    const authUrl = 'https://sandbox.moncashbutton.digicelgroup.com/Api/oauth/token';
    const credentials = `${moncashClientId}:${moncashClientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'scope=read,write&grant_type=client_credentials',
    });

    const authData = await authRes.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      return Response.json({ error: 'Failed to authenticate with Moncash' }, { status: 500 });
    }

    // Step 2: Create payment
    const orderId = `TPAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const amountInHTG = (parseFloat(amount) * exchangeRate).toFixed(2);

    const createPaymentUrl = 'https://sandbox.moncashbutton.digicelgroup.com/Api/v1/CreatePayment';
    const paymentRes = await fetch(createPaymentUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInHTG,
        orderId: orderId,
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentData.payment_token || !paymentData.payment_token.token) {
      return Response.json({ error: 'Failed to create payment token' }, { status: 500 });
    }

    // Step 3: Build redirect URL to Moncash payment gateway
    const gatewayBaseUrl = 'https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware';
    const redirectUrl = `${gatewayBaseUrl}/Payment/Redirect?token=${paymentData.payment_token.token}`;

    // Store payment info in database for callback verification
    await base44.asServiceRole.integrations.Core.UploadFile({
      file: JSON.stringify({
        orderId,
        amount,
        amountInHTG,
        phoneNumber,
        operatorId,
        countryCode,
        exchangeRate,
        timestamp: new Date().toISOString(),
      }),
    });

    return Response.json({
      success: true,
      redirectUrl,
      orderId,
      amountInHTG,
    });
  } catch (error) {
    console.error('Moncash payment initiation error:', error.message);
    return Response.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
});