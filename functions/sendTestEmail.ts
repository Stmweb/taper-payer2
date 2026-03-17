import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      return Response.json({ error: 'Mailgun credentials not configured' }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('from', `Taper Payer <postmaster@${MAILGUN_DOMAIN}>`);
    formData.append('to', 'support@taperpayer.com');
    formData.append('subject', 'Hello from Taper Payer');
    formData.append('text', 'Congratulations! You just sent an email with Mailgun via Taper Payer. You are truly awesome!');

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`)
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ error: result }, { status: response.status });
    }

    return Response.json({ success: true, message: 'Test email sent to support@taperpayer.com', result });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});