Deno.serve(async (req) => {
  try {
    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');

    // First, try to list domains to verify the API key works
    const domainsResponse = await fetch('https://api.mailgun.net/v3/domains', {
      headers: {
        'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`)
      }
    });

    const domainsResult = await domainsResponse.json();

    if (!domainsResponse.ok) {
      return Response.json({ 
        error: 'API key invalid or unauthorized', 
        details: domainsResult,
        domain_used: MAILGUN_DOMAIN,
        key_present: !!MAILGUN_API_KEY
      }, { status: 401 });
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

    return Response.json({ 
      success: response.ok, 
      status: response.status,
      message: response.ok ? 'Test email sent to support@taperpayer.com' : 'Failed',
      result,
      domains: domainsResult.items?.map(d => d.name)
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});