Deno.serve(async (req) => {
  try {
    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const domain = 'mail.taperpayer.com';

    const formData = new FormData();
    formData.append('from', `Mailgun Sandbox <postmaster@${domain}>`);
    formData.append('to', 'Katy Lucas <support@taperpayer.com>');
    formData.append('subject', 'Hello Katy Lucas');
    formData.append('text', 'Congratulations Katy Lucas, you just sent an email with Mailgun! You are truly awesome!');

    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
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
      result
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});