import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { amount, phoneNumber, countryCode, operatorId, productId, exchangeRate } = await req.json();

    if (!amount || !phoneNumber || !countryCode || !operatorId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const moncashClientId = Deno.env.get('MONCASH_API_KEY');
    const moncashClientSecret = Deno.env.get('MONCASH_API_SECRET');

    if (!moncashClientId || !moncashClientSecret) {
      return Response.json({ error: 'Moncash credentials not configured' }, { status: 500 });
    }

    const orderId = `TPAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const rate = exchangeRate || 130;
    const amountInHTG = (parseFloat(amount) * rate).toFixed(2);

    // Step 3: Save pending topup details so callback can process it
    await base44.asServiceRole.entities.PendingTopup.create({
      order_id: orderId,
      phone_number: phoneNumber,
      country_code: countryCode,
      operator_id: String(operatorId),
      operator_name: 'Natcom Haiti',
      product_id: productId ? String(productId) : undefined,
      amount: parseFloat(amount),
      status: 'pending',
    });

    console.log('Saved pending topup for orderId:', orderId);

    // Step 1: Get OAuth token from Moncash (production)
    const authUrl = 'https://moncashbutton.digicelgroup.com/Api/oauth/token';
    const credentials = `${moncashClientId}:${moncashClientSecret}`;
    const encodedCredentials = btoa(credentials);

    const authRes = await Promise.race([
      fetch(authUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'scope=read,write&grant_type=client_credentials',
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 15000))
    ]);

    const authText = await authRes.text();
    console.log('Moncash auth status:', authRes.status);

    let authData;
    try {
      authData = JSON.parse(authText);
    } catch (e) {
      throw new Error(`Invalid auth response: ${authText.substring(0, 200)}`);
    }

    const accessToken = authData.access_token;
    if (!accessToken) {
      throw new Error(`No access token. Response: ${JSON.stringify(authData)}`);
    }

    // Step 2: Create payment (production)
    const createPaymentUrl = 'https://moncashbutton.digicelgroup.com/Api/v1/CreatePayment';
    const paymentRes = await Promise.race([
      fetch(createPaymentUrl, {
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
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Payment creation timeout')), 15000))
    ]);

    const paymentData = await paymentRes.json();
    console.log('Moncash payment response:', JSON.stringify(paymentData));

    if (!paymentData.payment_token || !paymentData.payment_token.token) {
      throw new Error(`Failed to create payment token: ${JSON.stringify(paymentData)}`);
    }

    // Step 4: Build redirect URL to Moncash payment gateway (production)
    const gatewayBaseUrl = 'https://moncashbutton.digicelgroup.com/Moncash-middleware';
    const redirectUrl = `${gatewayBaseUrl}/Payment/Redirect?token=${paymentData.payment_token.token}`;

    return Response.json({
      success: true,
      redirectUrl,
      orderId,
      amountInHTG,
    });
  } catch (error) {
    console.error('Moncash payment initiation error:', error.message);
    return Response.json({ error: `Payment initiation failed: ${error.message}` }, { status: 500 });
  }
});