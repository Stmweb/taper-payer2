import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { countryIso } = await req.json();

    const clientId = Deno.env.get('RELOADLY_CLIENT_ID');
    const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET');

    console.log('client_id present:', !!clientId, 'length:', clientId?.length);
    console.log('client_secret present:', !!clientSecret, 'length:', clientSecret?.length);

    if (!clientId || !clientSecret) {
      return Response.json({ error: 'Reloadly credentials not configured' }, { status: 500 });
    }

    // Try production audience
    const authBody = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      audience: 'https://topups.reloadly.com'
    };

    console.log('Auth body (no secret):', JSON.stringify({ ...authBody, client_secret: '[HIDDEN]' }));

    const authRes = await fetch('https://auth.reloadly.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(authBody)
    });

    const authData = await authRes.json();
    console.log('Auth response status:', authRes.status);
    console.log('Auth response:', JSON.stringify(authData));

    if (!authData.access_token) {
      // Try sandbox
      const sandboxRes = await fetch('https://auth.reloadly.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...authBody, audience: 'https://topups-sandbox.reloadly.com' })
      });
      const sandboxData = await sandboxRes.json();
      console.log('Sandbox auth status:', sandboxRes.status);
      console.log('Sandbox auth response:', JSON.stringify(sandboxData));

      if (!sandboxData.access_token) {
        return Response.json({ error: 'Authentication failed', details: { prod: authData, sandbox: sandboxData } }, { status: 401 });
      }

      // Use sandbox
      const opRes = await fetch(`https://topups-sandbox.reloadly.com/operators/countries/${countryIso}?size=20&page=1`, {
        headers: { 'Authorization': `Bearer ${sandboxData.access_token}`, 'Accept': 'application/com.reloadly.topups-v1+json' }
      });
      const opData = await opRes.json();
      return Response.json({ operators: opData?.content || [] });
    }

    // Use production
    const opRes = await fetch(`https://topups.reloadly.com/operators/countries/${countryIso}?size=20&page=1`, {
      headers: { 'Authorization': `Bearer ${authData.access_token}`, 'Accept': 'application/com.reloadly.topups-v1+json' }
    });
    const opData = await opRes.json();
    console.log('Operators status:', opRes.status, 'count:', opData?.content?.length);
    return Response.json({ operators: opData?.content || [] });

  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});