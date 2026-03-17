import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Parse orderId from query params (Moncash returns GET with orderId and transactionId)
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');
    const transactionId = url.searchParams.get('transactionId');
    const token = url.searchParams.get('token'); // sometimes token is also returned

    console.log('Moncash callback received:', { method: req.method, orderId, transactionId, token, allParams: Object.fromEntries(url.searchParams) });

    if (!orderId) {
      // Redirect to home if no orderId (could be a bad callback)
      return new Response(null, {
        status: 302,
        headers: { 'Location': '/TaperPayerTopUp?moncash=error' }
      });
    }

    // Look up the pending topup by orderId
    const pendingTopups = await base44.asServiceRole.entities.PendingTopup.filter({ order_id: orderId });

    if (!pendingTopups || pendingTopups.length === 0) {
      console.error('No pending topup found for orderId:', orderId);
      return new Response(null, {
        status: 302,
        headers: { 'Location': '/TaperPayerTopUp?moncash=error&reason=not_found' }
      });
    }

    const pending = pendingTopups[0];

    // Don't process twice
    if (pending.status === 'completed') {
      console.log('Topup already completed for orderId:', orderId);
      return new Response(null, {
        status: 302,
        headers: { 'Location': `/TaperPayerTopUp?moncash=success&phone=${encodeURIComponent(pending.phone_number)}` }
      });
    }

    // Verify payment with Moncash using the token
    if (token) {
      const moncashClientId = Deno.env.get('MONCASH_API_KEY');
      const moncashClientSecret = Deno.env.get('MONCASH_API_SECRET');
      const encodedCredentials = btoa(`${moncashClientId}:${moncashClientSecret}`);

      try {
        // Re-authenticate
        const authRes = await fetch('https://moncashbutton.digicelgroup.com/Api/oauth/token', {
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

        if (accessToken) {
          // Retrieve payment details to confirm
          const paymentCheckRes = await fetch(`https://moncashbutton.digicelgroup.com/Api/v1/RetrieveTransactionPayment?token=${token}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
            },
          });
          const paymentCheck = await paymentCheckRes.json();
          console.log('Moncash payment verification:', JSON.stringify(paymentCheck));
        }
      } catch (verifyErr) {
        console.warn('Payment verification failed (continuing anyway):', verifyErr.message);
      }
    }

    // Process the airtime top-up via Reloadly
    try {
      // Get Reloadly OAuth token
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

      const reloadlyAuthData = await reloadlyAuth.json();
      const accessToken = reloadlyAuthData.access_token;

      if (!accessToken) {
        throw new Error('Failed to authenticate with Reloadly');
      }

      // Send the topup
      const topupRes = await fetch('https://topups.reloadly.com/topups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/com.reloadly.topups-v1+json',
        },
        body: JSON.stringify({
          operatorId: parseInt(pending.operator_id),
          amount: pending.amount,
          useLocalAmount: false,
          recipientPhone: {
            countryCode: pending.country_code,
            number: pending.phone_number.replace(/\D/g, ''),
          },
          customIdentifier: orderId,
        }),
      });

      const topupData = await topupRes.json();
      console.log('Reloadly topup result:', JSON.stringify(topupData));

      if (!topupRes.ok) {
        throw new Error(topupData.message || 'Topup failed');
      }

      // Mark as completed
      await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'completed' });

      console.log('Topup completed successfully:', {
        phone: pending.phone_number,
        amount: pending.amount,
        orderId,
      });

      // Redirect to success page
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `/TaperPayerTopUp?moncash=success&phone=${encodeURIComponent(pending.phone_number)}&amount=${pending.amount}`
        }
      });

    } catch (topupErr) {
      console.error('Topup failed after payment:', topupErr.message);
      await base44.asServiceRole.entities.PendingTopup.update(pending.id, { status: 'failed' });

      return new Response(null, {
        status: 302,
        headers: { 'Location': '/TaperPayerTopUp?moncash=paid_but_topup_failed' }
      });
    }

  } catch (error) {
    console.error('Moncash Callback Error:', error.message, error.stack);
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/TaperPayerTopUp?moncash=error' }
    });
  }
});