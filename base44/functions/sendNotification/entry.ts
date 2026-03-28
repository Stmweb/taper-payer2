import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
// v4 - force redeploy

function toBase64(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

async function sendEmail(opts) {
  const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
  const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');
  const form = new FormData();
  form.append('from', 'Taper Payer <noreply@' + MAILGUN_DOMAIN + '>');
  form.append('to', opts.to);
  form.append('subject', opts.subject);
  if (opts.html) form.append('html', opts.html);
  if (opts.text) form.append('text', opts.text);
  console.log('[Mailgun] Domain:', MAILGUN_DOMAIN);
  console.log('[Mailgun] API key prefix:', MAILGUN_API_KEY ? MAILGUN_API_KEY.substring(0, 8) : 'MISSING');
  const res = await fetch('https://api.mailgun.net/v3/' + MAILGUN_DOMAIN + '/messages', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + toBase64('api:' + MAILGUN_API_KEY) },
    body: form,
  });
  const body = await res.text();
  console.log('[Mailgun] Status:', res.status, 'Body:', body.substring(0, 300));
  if (!res.ok) throw new Error('Mailgun error ' + res.status + ': ' + body);
  return JSON.parse(body);
}

async function sendSMS(opts) {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const isWhatsApp = opts.to && opts.to.startsWith('whatsapp:');
  const from = isWhatsApp ? 'whatsapp:+14155238886' : Deno.env.get('TWILIO_PHONE_NUMBER');
  console.log('[Twilio] SID prefix:', sid ? sid.substring(0, 6) : 'MISSING');
  console.log('[Twilio] Token length:', token ? token.length : 'MISSING');
  console.log('[Twilio] From:', from || 'MISSING');
  const params = 'From=' + encodeURIComponent(from) + '&To=' + encodeURIComponent(opts.to) + '&Body=' + encodeURIComponent(opts.body);
  const res = await fetch(
    'https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + toBase64(sid + ':' + token),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    }
  );
  const data = await res.json();
  console.log('[Twilio] Status:', res.status, 'Response:', JSON.stringify(data).substring(0, 300));
  if (!res.ok) throw new Error('Twilio error ' + res.status + ': ' + (data.message || JSON.stringify(data)));
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
    console.log('[sendNotification] Request received');
    const rawBody = await req.text();
    console.log('[sendNotification] Body preview:', rawBody.substring(0, 100));

    let payload = {};
    try {
      const match = rawBody.match(/\{[\s\S]*\}/);
      if (match) payload = JSON.parse(match[0]);
    } catch (e) {
      console.log('[sendNotification] Parse error:', e.message);
    }

    console.log('[sendNotification] Type:', payload.type, 'Recipient:', payload.recipient);

    const { type, recipient, senderName, amount, currency, note } = payload;
    const results = {};

    if (type === 'request_money') {
      const subject = senderName + ' is requesting money via Taper Payer';
      const html = '<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">'
        + '<h2 style="color:#3D7BB7;">Payment Request</h2>'
        + '<p><strong>' + senderName + '</strong> is requesting <strong>' + currency + ' ' + amount + '</strong> via Taper Payer.</p>'
        + (note ? '<p style="color:#64748b;font-style:italic;">"' + note + '"</p>' : '')
        + '<a href="https://taperpayer.com" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#3D7BB7;color:white;border-radius:8px;text-decoration:none;">Pay Now on Taper Payer</a>'
        + '</div>';
      const text = senderName + ' is requesting ' + currency + ' ' + amount + ' via Taper Payer.' + (note ? ' Note: "' + note + '"' : '') + ' Visit taperpayer.com';
      const smsBody = senderName + ' is requesting ' + currency + ' ' + amount + ' via Taper Payer.' + (note ? ' "' + note + '"' : '') + ' Pay at taperpayer.com';

      if (isEmail(recipient)) {
        console.log('[sendNotification] Sending email to', recipient);
        results.email = await sendEmail({ to: recipient, subject, html, text });
      }
      if (isPhone(recipient)) {
        console.log('[sendNotification] Sending SMS to', normalizePhone(recipient));
        results.sms = await sendSMS({ to: normalizePhone(recipient), body: smsBody });
      }

    } else if (type === 'request_topup') {
      const { myPhone, topupLink } = payload;
      const subject = senderName + ' is requesting a mobile top-up via Taper Payer';
      const html = '<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">'
        + '<h2 style="color:#F88F2B;">Top-Up Request</h2>'
        + '<p><strong>' + senderName + '</strong> is asking you to top up their phone (<strong>' + myPhone + '</strong>) with <strong>$' + amount + ' USD</strong> via Taper Payer.</p>'
        + (note ? '<p style="color:#64748b;font-style:italic;">"' + note + '"</p>' : '')
        + '<a href="' + topupLink + '" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#F88F2B;color:white;border-radius:8px;text-decoration:none;">Top Up Now on Taper Payer</a>'
        + '</div>';
      const smsBody = senderName + ' is asking you to top up their phone (' + myPhone + ') with $' + amount + ' USD.'
        + (note ? ' "' + note + '"' : '')
        + ' Top up now: ' + topupLink;

      if (isEmail(recipient)) {
        results.email = await sendEmail({ to: recipient, subject, html, text: smsBody });
      }
      if (isPhone(recipient)) {
        const phone = normalizePhone(recipient);
        console.log('[sendNotification] Sending top-up request via WhatsApp first, SMS fallback');
        let whatsappSent = false;
        try {
          results.whatsapp = await sendSMS({ to: 'whatsapp:' + phone, body: smsBody });
          whatsappSent = true;
          console.log('[sendNotification] WhatsApp sent successfully');
        } catch (waErr) {
          console.log('[sendNotification] WhatsApp failed, falling back to SMS:', waErr.message);
        }
        if (!whatsappSent) {
          results.sms = await sendSMS({ to: phone, body: smsBody });
          console.log('[sendNotification] SMS fallback sent');
        }
      }

    } else if (type === 'topup_confirmation') {
      const subject = 'Your Mobile Top-Up is confirmed - Taper Payer';
      const html = '<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">'
        + '<h2 style="color:#61AF39;">Top-Up Successful</h2>'
        + '<p>Your mobile top-up of <strong>' + currency + ' ' + amount + '</strong> to <strong>' + recipient + '</strong> has been processed.</p>'
        + '</div>';
      const text = 'Your Taper Payer top-up of ' + currency + ' ' + amount + ' to ' + recipient + ' was successful.';
      const smsBody = 'Taper Payer: Top-up of ' + currency + ' ' + amount + ' to ' + recipient + ' was successful!';

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
    console.error('[sendNotification] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});