const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
const MAILGUN_DOMAIN = 'mail.taperpayer.com';

Deno.serve(async (req) => {
  const { name, email, company, phone, message } = await req.json();

  const formData = new FormData();
  formData.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
  formData.append('to', 'Support@taperpayer.com');
  formData.append('subject', `White Label Inquiry from ${name} — ${company || 'N/A'}`);
  formData.append('html', `
    <h2>New White Label Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Company:</strong> ${company || 'N/A'}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <h3>Message:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `);
  formData.append('h:Reply-To', email);

  const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`),
    },
    body: formData,
  });

  const responseText = await response.text();
  console.log('Mailgun status:', response.status, 'body:', responseText.substring(0, 200));

  if (!response.ok) {
    let result = {};
    try { result = JSON.parse(responseText); } catch {}
    return Response.json({ error: result.message || responseText }, { status: 500 });
  }

  return Response.json({ success: true });
});