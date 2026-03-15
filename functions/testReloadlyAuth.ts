import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const clientId = Deno.env.get('RELOADLY_CLIENT_ID');
    const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET');

    console.log('CLIENT_ID:', clientId);
    console.log('CLIENT_SECRET length:', clientSecret?.length, 'preview:', clientSecret?.slice(0, 10));

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

    const data = await authRes.json();
    console.log('Auth response:', JSON.stringify(data));
    return Response.json({ status: authRes.status, data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});