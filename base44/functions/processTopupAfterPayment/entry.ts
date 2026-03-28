import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phone, amount, operatorId, paymentId } = await req.json();

    if (!phone || !amount || !operatorId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Step 1: Get Reloadly OAuth token
    const reloadlyAuth = await fetch('https://auth.reloadly.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: Deno.env.get('RELOADLY_CLIENT_ID'),
        client_secret: Deno.env.get('RELOADLY_CLIENT_SECRET'),
        grant_type: 'client_credentials',
        audience: 'https://topups.reloadly.com',
      }),
    });

    const authData = await reloadlyAuth.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      return Response.json({ error: 'Failed to authenticate with Reloadly' }, { status: 500 });
    }

    // Step 2: Send topup to Reloadly
    const topupRes = await fetch('https://topups.reloadly.com/topups', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operatorId: operatorId,
        amount: amount,
        useLocalAmount: false,
        recipientPhone: {
          countryCode: 'HT',
          number: phone.replace(/\D/g, ''),
        },
        customIdentifier: paymentId,
      }),
    });

    const topupData = await topupRes.json();

    if (!topupRes.ok) {
      console.error('Reloadly error:', topupData);
      return Response.json(
        { error: topupData.message || 'Topup failed' },
        { status: 400 }
      );
    }

    console.log('Topup success:', {
      phone,
      amount,
      operatorId,
      reloadlyId: topupData.id,
      timestamp: new Date().toISOString(),
    });

    // Send confirmation notification (SMS if phone is international format)
    try {
      const notifPhone = phone.startsWith('+') ? phone : '+' + phone.replace(/\D/g, '');
      await base44.asServiceRole.functions.invoke('sendNotification', {
        type: 'topup_confirmation',
        recipient: notifPhone,
        amount: String(amount),
        currency: 'USD',
      });
    } catch (notifErr) {
      console.log('Notification failed (non-blocking):', notifErr.message);
    }

    return Response.json({
      success: true,
      status: 'SUCCESS',
      message: 'Phone successfully recharged',
      topupId: topupData.id,
      phone: phone,
      amount: amount,
    });
  } catch (error) {
    console.error('Topup processing error:', error.message);
    return Response.json({ error: 'Topup processing failed' }, { status: 500 });
  }
});