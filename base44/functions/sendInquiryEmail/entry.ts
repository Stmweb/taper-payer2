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
  const { name, email, company, phone, message, subject } = await req.json();

  // Check if this is an account deletion request
  const isDeletionRequest = subject && subject.includes('Account Deletion Request');

  let inquiryHtml, confirmHtml, internalSubject, userSubject;

  if (isDeletionRequest) {
    // Account deletion request
    inquiryHtml = `
      <h2 style="color: #dc2626;">Account Deletion Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr style="border: 1px solid #e5e7eb; margin: 20px 0;"/>
      <p style="color: #6b7280; font-size: 14px;">⚠️ This is a GDPR/CCPA data deletion request. Please process within 30 days.</p>
    `;

    confirmHtml = `
      <h2>Hi ${name},</h2>
      <p>We have received your request to delete your account and all associated data from Taper Payer.</p>
      <p><strong>Request Details:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <br/>
      <p>Our compliance team will review your request and process it within 30 days as required by GDPR/CCPA regulations. You will receive a confirmation email once your account and data have been permanently deleted.</p>
      <p>If you have any questions or did not make this request, please contact us immediately at support@taperpayer.com</p>
      <br/>
      <p>Best regards,<br/>The Taper Payer Compliance Team</p>
    `;

    internalSubject = `ACCOUNT DELETION REQUEST - ${email}`;
    userSubject = 'Account Deletion Request Received - Taper Payer';
  } else {
    // Regular white label inquiry
    inquiryHtml = `
      <h2>New White Label Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    confirmHtml = `
      <h2>Hi ${name},</h2>
      <p>Thank you for your interest in our White Label solution! We have received your inquiry and our team will get back to you within 1-2 business days.</p>
      <p><strong>Your message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <br/>
      <p>Best regards,<br/>The Taper Payer Team</p>
    `;

    internalSubject = `White Label Inquiry from ${name} — ${company || 'N/A'}`;
    userSubject = 'We received your White Label inquiry — Taper Payer';
  }

  // Send to both internal addresses AND a confirmation to the inquirer
  await sendEmail('info@taperpayer.com', internalSubject, inquiryHtml, email);
  await sendEmail('support@taperpayer.com', internalSubject, inquiryHtml, email);
  await sendEmail(email, userSubject, confirmHtml);

  return Response.json({ success: true });
});