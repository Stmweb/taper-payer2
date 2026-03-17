Deno.serve(async (req) => {
  try {
    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');

    const htmlBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#3D7BB7 0%,#61AF39 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png"
      alt="Taper Payer"
      style="height:50px;width:auto;max-width:200px;display:block;margin:0 auto 20px auto;object-fit:contain;" />
    <h1 style="color:#ffffff;font-size:26px;margin:0;font-weight:bold;">Email Test – Taper Payer</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:15px;margin-top:10px;">Logo render test</p>
  </div>
  <div style="padding:40px 30px;">
    <p style="font-size:16px;color:#334155;line-height:1.7;">This is a test email to verify the logo and template render correctly.</p>
    <p style="font-size:14px;color:#64748b;">If you can see the Taper Payer logo above, the email template is working correctly.</p>
    <div style="margin-top:40px;padding-top:24px;border-top:2px solid #e2e8f0;">
      <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png"
        alt="Taper Payer"
        style="height:50px;width:auto;max-width:200px;display:block;object-fit:contain;" />
      <p style="font-size:13px;color:#475569;line-height:1.6;margin-top:10px;">
        <strong style="color:#1e293b;">Taper Payer LLC</strong><br/>
        254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702<br/>
        📞 <a href="tel:404-994-0766" style="color:#3D7BB7;text-decoration:none;">404-994-0766</a> &nbsp;|&nbsp;
        ✉️ <a href="mailto:info@taperpayer.com" style="color:#3D7BB7;text-decoration:none;">info@taperpayer.com</a>
      </p>
    </div>
  </div>
</div>`;

    const formData = new FormData();
    formData.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', 'support@taperpayer.com');
    formData.append('subject', '🧪 Taper Payer – Email Logo Test');
    formData.append('html', htmlBody);

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`)
      },
      body: formData
    });

    let result;
    const text = await response.text();
    try { result = JSON.parse(text); } catch { result = text; }

    return Response.json({ 
      success: response.ok, 
      status: response.status,
      domain: MAILGUN_DOMAIN,
      result
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});