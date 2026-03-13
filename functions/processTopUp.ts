import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import crypto from 'crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phoneNumber, amount, countryCode, operatorId } = await req.json();

    if (!phoneNumber || !amount || !countryCode || !operatorId) {
      return Response.json(
        { error: 'Missing required fields: phoneNumber, amount, countryCode, operatorId' },
        { status: 400 }
      );
    }

    const apiKey = Deno.env.get('DTONE_API_KEY');
    const apiSecret = Deno.env.get('DTONE_API_SECRET');

    if (!apiKey || !apiSecret) {
      return Response.json(
        { error: 'DTOne API credentials not configured' },
        { status: 500 }
      );
    }

    // Create DTOne API signature
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID();
    
    // Build signature string: GET|/topups|apiKey|timestamp|nonce
    const signatureString = `POST|/topups|${apiKey}|${timestamp}|${nonce}`;
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(signatureString)
      .digest('hex');

    // Prepare topup request payload
    const payload = {
      phone: phoneNumber,
      amount: parseFloat(amount),
      country_iso: countryCode,
      operator_id: operatorId,
      client_transaction_id: crypto.randomUUID(),
    };

    // Call DTOne API
    const response = await fetch('https://api.dtone.com/v1/topups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Dtone-Signature': signature,
        'X-Dtone-Timestamp': timestamp,
        'X-Dtone-Nonce': nonce,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { 
          error: 'DTOne API error',
          details: errorData,
          statusCode: response.status
        },
        { status: response.status }
      );
    }

    const topupResult = await response.json();

    return Response.json({
      success: true,
      transaction: {
        id: topupResult.id,
        phone: phoneNumber,
        amount: amount,
        country: countryCode,
        operator: operatorId,
        status: topupResult.status,
        timestamp: new Date().toISOString(),
        userId: user.id,
      },
      dtoneResponse: topupResult,
    });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});