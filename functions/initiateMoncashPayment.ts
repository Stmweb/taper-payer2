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

    const orderId = `TPAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const amountInHTG = (parseFloat(amount) * exchangeRate).toFixed(2);

    try {
      // Step 1: Get OAuth token from Moncash
      const authUrl = 'https://sandbox.moncashbutton.digicelgroup.com/Api/oauth/token';
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
        new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 10000))
      ]);

      const authData = await authRes.json();
      const accessToken = authData.access_token;

      if (!accessToken) {
        throw new Error('No access token received from Moncash');
      }

      // Step 2: Create payment
      const createPaymentUrl = 'https://sandbox.moncashbutton.digicelgroup.com/Api/v1/CreatePayment';
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
        new Promise((_, reject) => setTimeout(() => reject(new Error('Payment creation timeout')), 10000))
      ]);

      const paymentData = await paymentRes.json();

      if (!paymentData.payment_token || !paymentData.payment_token.token) {
        throw new Error('Failed to create payment token');
      }

      // Step 3: Build redirect URL to Moncash payment gateway
      const gatewayBaseUrl = 'https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware';
      const redirectUrl = `${gatewayBaseUrl}/Payment/Redirect?token=${paymentData.payment_token.token}`;

      return Response.json({
        success: true,
        redirectUrl,
        orderId,
        amountInHTG,
      });
    } catch (apiError) {
      console.error('Moncash API error:', apiError.message);
      // Return error but don't expose internal details
      return Response.json({ error: 'Unable to connect to payment provider. Please try again.' }, { status: 503 });
    }
  } catch (error) {
    console.error('Moncash payment initiation error:', error.message);
    return Response.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
});