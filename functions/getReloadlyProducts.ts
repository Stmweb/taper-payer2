import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { countryIso } = await req.json();

    const clientId = Deno.env.get('RELOADLY_CLIENT_ID');
    const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return Response.json({ error: 'Reloadly credentials not configured' }, { status: 500 });
    }

    // Get auth token (production)
    const authRes = await fetch('https://auth.reloadly.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        audience: 'https://topups.reloadly.com'
      })
    });

    const authData = await authRes.json();

    if (!authData.access_token) {
      return Response.json({ error: 'Authentication failed', details: authData }, { status: 401 });
    }

    // Fetch operators for country
    const opRes = await fetch(`https://topups.reloadly.com/operators/countries/${countryIso}?size=20&page=1`, {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Accept': 'application/com.reloadly.topups-v1+json'
      }
    });

    const opData = await opRes.json();
    return Response.json({ operators: opData?.content || [] });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});