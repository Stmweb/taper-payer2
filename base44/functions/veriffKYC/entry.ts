import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, ...params } = await req.json();
    const apiKey = Deno.env.get('VERIFF_API_KEY');
    const apiSecret = Deno.env.get('VERIFF_API_SECRET');

    if (!apiKey || !apiSecret) {
      return Response.json({ error: 'Veriff configuration missing' }, { status: 500 });
    }

    // Create session
    if (action === 'createSession') {
      const timestamp = new Date().toISOString();
      const payload = {
        verification: {
          timestamp: timestamp,
          vendorData: user.id,
        },
      };

      const bodyString = JSON.stringify(payload);
      const signature = await signPayload(bodyString, apiSecret);
      console.log('Veriff request body:', bodyString);
      console.log('Veriff signature:', signature);

      const res = await fetch('https://stationapi.veriff.com/v1/sessions', {
        method: 'POST',
        headers: {
          'X-AUTH-CLIENT': apiKey,
          'X-HMAC-SIGNATURE': signature,
          'Content-Type': 'application/json',
        },
        body: bodyString,
      });

      const responseText = await res.text();
      console.log('Veriff response status:', res.status, 'body:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }

      if (!res.ok) {
        console.error('Veriff API error:', res.status, data);
        throw new Error(`Veriff API returned ${res.status}: ${responseText}`);
      }

      return Response.json({
        sessionId: data.verification.id,
        url: data.verification.url,
      });
    }

    // Check session status
    if (action === 'checkStatus') {
      const { sessionId } = params;

      if (!sessionId) {
        return Response.json({ error: 'Session ID required' }, { status: 400 });
      }

      console.log('Checking status for session:', sessionId);

      const timestamp = new Date().toISOString();
      const signature = await signPayload(timestamp, apiSecret);

      const res = await fetch(`https://stationapi.veriff.com/v1/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'X-AUTH-CLIENT': apiKey,
          'X-HMAC-SIGNATURE': signature,
          'X-TIMESTAMP': timestamp,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return Response.json(
          { error: data.error?.message || 'Failed to check status' },
          { status: 400 }
        );
      }

      const status = data.verification.status;
      const isVerified = status === 'approved';

      // Update user with KYC status
      if (isVerified) {
        console.log('Marking user as verified');
        await base44.auth.updateMe({
          cybrid_customer_id: `veriff_${sessionId}`,
        });
      }

      return Response.json({
        status,
        isVerified,
        decision: data.verification.decision,
      });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('veriffKYC error:', error.message, error.stack);
    return Response.json({ error: error.message || 'KYC processing failed' }, { status: 500 });
  }
});

async function signPayload(payload, secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}