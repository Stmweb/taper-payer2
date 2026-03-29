import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Twilio sends POST with URL-encoded body
    const text = await req.text();
    const params = new URLSearchParams(text);

    const from = params.get('From') || '';
    const body = params.get('Body') || '';
    const to = params.get('To') || '';
    const messageSid = params.get('MessageSid') || '';

    console.log(`Incoming SMS from ${from}: ${body}`);

    // Store the incoming message as a record (optional — useful for logging/support)
    await base44.asServiceRole.entities.IncomingMessage.create({
      from_number: from,
      to_number: to,
      body,
      message_sid: messageSid,
    }).catch(() => {}); // Don't fail if entity doesn't exist

    // Respond with TwiML (empty response = no auto-reply, or add a reply below)
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thanks for your message! Our team will be in touch shortly. Visit taperpayer.com for support.</Message>
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('incomingSMS error:', error.message);
    // Always return valid TwiML so Twilio doesn't retry
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }
});