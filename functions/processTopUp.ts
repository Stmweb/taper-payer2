import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

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

    // Create DTOne API signature using Web Crypto API
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.getRandomValues(new Uint8Array(16))
      .reduce((a, b) => a + b.toString(16).padStart(2, '0'), '');
    
    // Build signature string for HMAC-SHA256
    const signatureString = `POST|/topups|${apiKey}|${timestamp}|${nonce}`;
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(apiSecret);
    const messageData = encoder.encode(signatureString);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Prepare topup request payload
    const clientTransactionId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const payload = {
      phone: phoneNumber,
      amount: parseFloat(amount),
      country_iso: countryCode,
      operator_id: operatorId,
      client_transaction_id: clientTransactionId,
    };

    // Call DTOne API
    const response = await fetch('https://api.dtone.com/v1/topups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Dtone-Signature': signatureHex,
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