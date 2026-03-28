import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

async function sendEmail({ to, subject, html, text }) {
  const form = new FormData();
  form.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
  form.append('to', to);
  form.append('subject', subject);
  if (html) form.append('html', html);
  if (text) form.append('text', text);

  const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`) },
    body: form,
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Mailgun error: ${body}`);
  return JSON.parse(body);
}

async function sendSMS({ to, body }) {
  const form = new FormData();
  form.append('From', TWILIO_PHONE_NUMBER);
  form.append('To', to);
  form.append('Body', body);

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: { Authorization: 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`) },
      body: form,
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Twilio error: ${data.message}`);
  return data;
}

function isEmailAddress(str) {
  return str.includes('@');
}

function isPhoneNumber(str) {
  return /^\+?[\d\s\-().]{7,}$/.test(str);
}

function normalizePhone(str) {
  return str.startsWith('+') ? str : `+${str.replace(/\D/g, '')}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, recipient, senderName, amount, currency, note } = await req.json();

    const results = { email: null, sms: null };

    if (type === 'request_money') {
      const subject = `${senderName} is requesting money via Taper Payer`;
      const html = `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
          <h2 style="color:#3D7BB7;">Payment Request</h2>
          <p>Hi,</p>
          <p><strong>${senderName}</strong> is requesting a payment via <strong>Taper Payer</strong>.</p>
          <p style="font-size:28px;font-weight:bold;color:#61AF39;">${currency} ${amount}</p>
          ${note ? `<p style="color:#64748b;font-style:italic;">"${note}"</p>` : ''}
          <a href="https://taperpayer.com" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#3D7BB7;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">Pay Now on Taper Payer</a>
          <p style="margin-top:24px;color:#94a3b8;font-size:12px;">Taper Payer — Global Money Transfer</p>
        </div>`;
      const text = `${senderName} is requesting ${currency} ${amount} via Taper Payer.${note ? ` Note: "${note}"` : ''} Visit taperpayer.com to complete the payment.`;
      const smsBody = `💸 ${senderName} is requesting ${currency} ${amount} via Taper Payer.${note ? ` "${note}"` : ''} Pay at taperpayer.com`;

      if (isEmailAddress(recipient)) {
        results.email = await sendEmail({ to: recipient, subject, html, text });
      }
      if (isPhoneNumber(recipient)) {
        results.sms = await sendSMS({ to: normalizePhone(recipient), body: smsBody });
      }

    } else if (type === 'topup_confirmation') {
      const subject = `Your Mobile Top-Up is confirmed — Taper Payer`;
      const html = `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
          <h2 style="color:#61AF39;">Top-Up Successful ✅</h2>
          <p>Your mobile top-up of <strong>${currency} ${amount}</strong> to <strong>${recipient}</strong> has been processed successfully.</p>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">Thank you for using Taper Payer — Global Money Transfer.</p>
        </div>`;
      const text = `Your Taper Payer top-up of ${currency} ${amount} to ${recipient} was successful.`;
      const smsBody = `✅ Taper Payer: Your top-up of ${currency} ${amount} to ${recipient} was successful. Thank you!`;

      if (isEmailAddress(recipient)) {
        results.email = await sendEmail({ to: recipient, subject, html, text });
      }
      if (isPhoneNumber(recipient)) {
        results.sms = await sendSMS({ to: normalizePhone(recipient), body: smsBody });
      }

    } else {
      return Response.json({ error: 'Unknown notification type' }, { status: 400 });
    }

    return Response.json({ success: true, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});