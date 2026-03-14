import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { countryIso } = await req.json();

    if (!countryIso) {
      return Response.json({ error: 'Country ISO code required' }, { status: 400 });
    }

    const clientId = Deno.env.get('RELOADLY_CLIENT_ID');
    const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return Response.json({ error: 'Reloadly credentials not configured' }, { status: 500 });
    }

    // Authenticate with Reloadly
    const authRes = await fetch('https://auth.reloadly.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        audience: 'https://topups.reloadly.com'
      })
    });

    const authData = await authRes.json();
    if (!authData.access_token) {
      console.error('Auth error:', authData);
      return Response.json({ error: 'Failed to authenticate with Reloadly', details: authData }, { status: 401 });
    }

    // Fetch operators for the country
    const operatorsRes = await fetch(
      `https://topups.reloadly.com/operators?country=${countryIso}`,
      {
        headers: { Authorization: `Bearer ${authData.access_token}` }
      }
    );

    const operatorsData = await operatorsRes.json();
    return Response.json(operatorsData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});