import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

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
    const encodedCredentials = btoa(`${moncashClientId}:${moncashClientSecret}`);

    // Map operator IDs to DTone IDs for Haiti
    // DTone uses: 1512 = Digicel Haiti, 1703 = Natcom Haiti
    // Legacy IDs 1701 (Digicel) are remapped to 1512
    let validatedOperatorId = String(operatorId);
    if (countryCode === 'HT') {
      if (Number(operatorId) === 1701 || String(operatorId).toLowerCase().includes('digicel')) {
        validatedOperatorId = '1512'; // DTone Digicel Haiti
      } else if (![1512, 1703].includes(Number(operatorId))) {
        console.warn(`Unknown Haiti operator ID ${operatorId}, defaulting to Natcom (1703)`);
        validatedOperatorId = '1703';
      }
    }

    // Run entity save and Moncash auth in parallel to save time
    const [, authRes] = await Promise.all([
      base44.asServiceRole.entities.PendingTopup.create({
        order_id: orderId,
        phone_number: phoneNumber,
        country_code: countryCode,
        operator_id: validatedOperatorId,
        operator_name: Number(validatedOperatorId) === 1512 ? 'Digicel Haiti' : 'Natcom Haiti',
        product_id: productId ? String(productId) : undefined,
        amount: parseFloat(amount),
        status: 'pending',
      }),
      fetch('https://moncashbutton.digicelgroup.com/Api/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'scope=read,write&grant_type=client_credentials',
      }),
    ]);

    console.log('Saved pending topup for orderId:', orderId, 'operatorId:', validatedOperatorId);
    console.log('Moncash auth status:', authRes.status);

    const authText = await authRes.text();
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

    // Create payment
    const returnUrl = `https://taperpayer.com/MoncashReturn`;
    const paymentRes = await fetch('https://moncashbutton.digicelgroup.com/Api/v1/CreatePayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amountInHTG, orderId, returnUrl }),
    });

    const paymentData = await paymentRes.json();
    console.log('Moncash payment response:', JSON.stringify(paymentData));

    if (!paymentData.payment_token || !paymentData.payment_token.token) {
      throw new Error(`Failed to create payment token: ${JSON.stringify(paymentData)}`);
    }

    const redirectUrl = `https://moncashbutton.digicelgroup.com/Moncash-middleware/Payment/Redirect?token=${paymentData.payment_token.token}`;

    return Response.json({ success: true, redirectUrl, orderId, amountInHTG });
  } catch (error) {
    console.error('Moncash payment initiation error:', error.message);
    return Response.json({ error: `Payment initiation failed: ${error.message}` }, { status: 500 });
  }
});