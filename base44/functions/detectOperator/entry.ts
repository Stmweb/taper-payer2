Deno.serve(async (req) => {
  try {
    const { phoneNumber, countryIso } = await req.json();

    const clientId = Deno.env.get('RELOADLY_CLIENT_ID');
    const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return Response.json({ error: 'Reloadly credentials not configured' }, { status: 500 });
    }

    // Get auth token
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
      return Response.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Detect operator by phone number
    const detectRes = await fetch(`https://topups.reloadly.com/operators/auto-detect/phone/${encodeURIComponent(phoneNumber)}/countries/${countryIso}?suggestedAmountsMap=true`, {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Accept': 'application/com.reloadly.topups-v1+json'
      }
    });

    const operatorData = await detectRes.json();
    console.log('Operator detect status:', detectRes.status);
    console.log('Operator detect response:', JSON.stringify(operatorData).substring(0, 1000));

    if (!detectRes.ok) {
      return Response.json({ error: 'Could not detect operator', details: operatorData }, { status: 404 });
    }

    return Response.json({ operator: operatorData });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});