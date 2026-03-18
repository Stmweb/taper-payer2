import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = 'mail.taperpayer.com';

    // Fetch domain info
    const domainRes = await fetch(`https://api.mailgun.net/v3/domains/${MAILGUN_DOMAIN}`, {
      headers: { 'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`) }
    });
    const domainData = await domainRes.json();

    return Response.json({ domain: domainData });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});