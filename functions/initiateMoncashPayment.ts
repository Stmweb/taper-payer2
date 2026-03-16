Deno.serve(async (req) => {
  try {
    const { amount, phoneNumber, countryCode, operatorId, exchangeRate } = await req.json();

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

    try {
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
      console.log('Moncash auth response:', authText);

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

      // Step 3: Build redirect URL to Moncash payment gateway (production)
      const gatewayBaseUrl = 'https://moncashbutton.digicelgroup.com/Moncash-middleware';
      const redirectUrl = `${gatewayBaseUrl}/Payment/Redirect?token=${paymentData.payment_token.token}`;

      return Response.json({
        success: true,
        redirectUrl,
        orderId,
        amountInHTG,
      });
    } catch (apiError) {
      console.error('Moncash API error:', apiError.message);
      return Response.json({ error: `Payment provider error: ${apiError.message}` }, { status: 503 });
    }
  } catch (error) {
    console.error('Moncash payment initiation error:', error.message);
    return Response.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
});