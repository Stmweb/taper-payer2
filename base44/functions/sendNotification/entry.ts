import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

async function sendEmail(opts) {
  const apiKey = Deno.env.get('MAILGUN_API_KEY');
  const domain = Deno.env.get('MAILGUN_DOMAIN');
  
  const form = new FormData();
  form.append('from', `Taper Payer <noreply@${domain}>`);
  form.append('to', opts.to);
  form.append('subject', opts.subject);
  if (opts.html) form.append('html', opts.html);
  if (opts.text) form.append('text', opts.text);
  
  const auth = toBase64(`api:${apiKey}`);
  const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}` },
    body: form,
  });
  
  const body = await res.text();
  if (!res.ok) throw new Error(`Mailgun error ${res.status}: ${body}`);
  return JSON.parse(body);
}

async function sendSMS(opts) {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = opts.to.startsWith('whatsapp:') ? 'whatsapp:+14155238886' : Deno.env.get('TWILIO_PHONE_NUMBER');
  
  const params = new URLSearchParams({
    From: from,
    To: opts.to,
    Body: opts.body,
  });
  
  const auth = toBase64(`${sid}:${token}`);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(`Twilio error ${res.status}: ${data.message || JSON.stringify(data)}`);
  return data;
}

function isEmail(str) {
  return typeof str === 'string' && str.includes('@');
}

function isPhone(str) {
  return typeof str === 'string' && /^\+?[\d\s\-().]{7,}$/.test(str);
}

function normalizePhone(str) {
  return str.startsWith('+') ? str : '+' + str.replace(/\D/g, '');
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { type, recipient, senderName, amount, currency, note } = payload;
    const results = {};

    if (type === 'request_money') {
      const subject = `${senderName} is requesting money via Taper Payer`;
      const html = `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
        <h2 style="color:#3D7BB7;">Payment Request</h2>
        <p><strong>${senderName}</strong> is requesting <strong>${currency} ${amount}</strong> via Taper Payer.</p>
        ${note ? `<p style="color:#64748b;font-style:italic;">"${note}"</p>` : ''}
        <a href="https://taperpayer.com" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#3D7BB7;color:white;border-radius:8px;text-decoration:none;">Pay Now on Taper Payer</a>
      </div>`;
      const text = `${senderName} is requesting ${currency} ${amount} via Taper Payer.${note ? ` Note: "${note}"` : ''} Visit taperpayer.com`;
      const smsBody = `${senderName} is requesting ${currency} ${amount} via Taper Payer.${note ? ` "${note}"` : ''} Pay at taperpayer.com`;

      if (isEmail(recipient)) {
        results.email = await sendEmail({ to: recipient, subject, html, text });
      }
      if (isPhone(recipient)) {
        results.sms = await sendSMS({ to: normalizePhone(recipient), body: smsBody });
      }

    } else if (type === 'request_topup') {
      const { myPhone, topupLink } = payload;
      const subject = `${senderName} is requesting a mobile top-up via Taper Payer`;
      const html = `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
        <h2 style="color:#F88F2B;">Top-Up Request</h2>
        <p><strong>${senderName}</strong> is asking you to top up their phone (<strong>${myPhone}</strong>) with <strong>$${amount} USD</strong> via Taper Payer.</p>
        ${note ? `<p style="color:#64748b;font-style:italic;">"${note}"</p>` : ''}
        <a href="${topupLink}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#F88F2B;color:white;border-radius:8px;text-decoration:none;">Top Up Now on Taper Payer</a>
      </div>`;
      const smsBody = `${senderName} is asking you to top up their phone (${myPhone}) with $${amount} USD.${note ? ` "${note}"` : ''} Top up now: ${topupLink}`;

      if (isEmail(recipient)) {
        results.email = await sendEmail({ to: recipient, subject, html, text: smsBody });
      }
      if (isPhone(recipient)) {
        const phone = normalizePhone(recipient);
        try {
          results.whatsapp = await sendSMS({ to: `whatsapp:${phone}`, body: smsBody });
        } catch {
          results.sms = await sendSMS({ to: phone, body: smsBody });
        }
      }

    } else if (type === 'topup_confirmation') {
      const subject = 'Your Mobile Top-Up is confirmed - Taper Payer';
      const html = `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
        <h2 style="color:#61AF39;">Top-Up Successful</h2>
        <p>Your mobile top-up of <strong>${currency} ${amount}</strong> to <strong>${recipient}</strong> has been processed.</p>
      </div>`;
      const text = `Your Taper Payer top-up of ${currency} ${amount} to ${recipient} was successful.`;
      const smsBody = `Taper Payer: Top-up of ${currency} ${amount} to ${recipient} was successful!`;

      if (isEmail(recipient)) {
        results.email = await sendEmail({ to: recipient, subject, html, text });
      }
      if (isPhone(recipient)) {
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