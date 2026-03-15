import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function getReloadlyToken(audience) {
  const clientId = Deno.env.get('RELOADLY_CLIENT_ID');
  const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET');

  const authRes = await fetch('https://auth.reloadly.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      audience
    })
  });

  const authData = await authRes.json();
  if (!authData.access_token) {
    console.error('Auth error for audience', audience, ':', JSON.stringify(authData));
    return null;
  }
  return authData.access_token;
}

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

    // Try production first, then sandbox
    let token = await getReloadlyToken('https://topups.reloadly.com');
    let baseUrl = 'https://topups.reloadly.com';

    if (!token) {
      token = await getReloadlyToken('https://topups-sandbox.reloadly.com');
      baseUrl = 'https://topups-sandbox.reloadly.com';
    }

    if (!token) {
      return Response.json({ error: 'Could not authenticate with Reloadly. Check credentials.' }, { status: 401 });
    }

    // Fetch operators for the country
    const operatorsRes = await fetch(
      `${baseUrl}/operators/countries/${countryIso}?includePin=false&includeBundles=false&size=20&page=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/com.reloadly.topups-v1+json'
        }
      }
    );

    const operatorsData = await operatorsRes.json();
    console.log('Operators response status:', operatorsRes.status);
    console.log('Operators data sample:', JSON.stringify(operatorsData).slice(0, 500));

    return Response.json({ operators: operatorsData?.content || operatorsData?.data || operatorsData || [] });
  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});