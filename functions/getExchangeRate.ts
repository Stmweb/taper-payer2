import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const { from, to } = await req.json();

    if (!from || !to) {
      return Response.json({ error: 'Missing from or to currency' }, { status: 400 });
    }

    // Get Reloadly access token
    const authRes = await fetch('https://api.reloadly.com/auth/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: Deno.env.get('RELOADLY_CLIENT_ID'),
        client_secret: Deno.env.get('RELOADLY_CLIENT_SECRET'),
        grant_type: 'client_credentials',
        audience: 'https://api.reloadly.com',
      }),
    });

    const authData = await authRes.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      return Response.json({ rate: 130, source: 'fallback' }, { status: 200 });
    }

    // Fetch exchange rate
    const ratesRes = await fetch(`https://api.reloadly.com/rates?from=${from}&to=${to}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const ratesData = await ratesRes.json();
    const rate = ratesData.rate || 130;

    return Response.json({ rate, source: 'reloadly' });
  } catch (error) {
    console.error('Exchange rate error:', error.message);
    return Response.json({ rate: 130, source: 'fallback' }, { status: 200 });
  }
});