const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
const MAILGUN_DOMAIN = 'mail.taperpayer.com';

async function sendEmail(to, subject, html, replyTo) {
  const formData = new FormData();
  formData.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('html', html);
  if (replyTo) formData.append('h:Reply-To', replyTo);

  const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`) },
    body: formData,
  });

  const text = await response.text();
  console.log(`Mailgun [${to}] status:`, response.status, text.substring(0, 200));
  if (!response.ok) {
    let r = {};
    try { r = JSON.parse(text); } catch {}
    throw new Error(r.message || text);
  }
}

Deno.serve(async (req) => {
  const { name, email, company, phone, message } = await req.json();

  const inquiryHtml = `
    <h2>New White Label Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Company:</strong> ${company || 'N/A'}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <h3>Message:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  const confirmHtml = `
    <h2>Hi ${name},</h2>
    <p>Thank you for your interest in our White Label solution! We have received your inquiry and our team will get back to you within 1-2 business days.</p>
    <p><strong>Your message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <br/>
    <p>Best regards,<br/>The Taper Payer Team</p>
  `;

  // Send to both internal addresses AND a confirmation to the inquirer
  await sendEmail('info@taperpayer.com', `White Label Inquiry from ${name} — ${company || 'N/A'}`, inquiryHtml, email);
  await sendEmail('support@taperpayer.com', `White Label Inquiry from ${name} — ${company || 'N/A'}`, inquiryHtml, email);
  await sendEmail(email, 'We received your White Label inquiry — Taper Payer', confirmHtml);

  return Response.json({ success: true });
});