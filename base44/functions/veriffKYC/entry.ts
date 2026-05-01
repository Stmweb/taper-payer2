import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action, userId, userEmail, ...params } = body;

    // Accept either Base44 auth OR explicit userId passed from app auth
    let resolvedUserId = userId || userEmail || 'anonymous';
    try {
      const user = await base44.auth.me();
      if (user) resolvedUserId = user.id;
    } catch {}

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
          timestamp,
          vendorData: resolvedUserId,
        },
      };

      const bodyString = JSON.stringify(payload);
      const signature = await signPayload(bodyString, apiSecret);
      console.log('[veriffKYC] Creating session for user:', resolvedUserId);

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
      console.log('[veriffKYC] Response:', res.status, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }

      if (!res.ok) {
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

      console.log('[veriffKYC] Checking status for session:', sessionId);

      // Veriff decision endpoint: GET /v1/sessions/{sessionId}/decision
      const signature = await signPayload(apiKey + sessionId, apiSecret);

      const res = await fetch(`https://stationapi.veriff.com/v1/sessions/${sessionId}/decision`, {
        method: 'GET',
        headers: {
          'X-AUTH-CLIENT': apiKey,
          'X-HMAC-SIGNATURE': signature,
          'Content-Type': 'application/json',
        },
      });

      const responseText = await res.text();
      console.log('[veriffKYC] checkStatus response:', res.status, responseText);

      let data;
      try { data = JSON.parse(responseText); } catch { data = {}; }

      if (!res.ok) {
        return Response.json(
          { error: data.message || data.error || `Veriff returned ${res.status}` },
          { status: 400 }
        );
      }

      // Decision endpoint returns { verification: { status, decision } } or { status: 'fail' } if pending
      const status = data.verification?.status || data.status || 'created';
      const isVerified = ['approved', 'submitted', 'review'].includes(status);

      console.log('[veriffKYC] Status:', status, '| isVerified:', isVerified);

      return Response.json({ status, isVerified, decision: data.verification?.decision });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[veriffKYC] Error:', error.message);
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
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}