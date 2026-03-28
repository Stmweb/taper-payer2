// Twilio Voice Webhook — "A call comes in" (HTTP POST)
// Set this as your Twilio number's Voice Configuration webhook URL

Deno.serve(async (req) => {
  try {
    // Parse the incoming form body from Twilio
    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get('From') || 'Unknown';
    const to = params.get('To') || '';
    const callSid = params.get('CallSid') || '';

    console.log(`[twilioVoiceHandler] Incoming call from=${from} to=${to} callSid=${callSid}`);

    // Respond with TwiML — greet the caller
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">
    Thank you for calling Taper Payer. We are currently unavailable. Please send us a message via WhatsApp or visit taper payer dot com for support. Goodbye.
  </Say>
  <Hangup/>
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('[twilioVoiceHandler] Error:', error.message);

    // Always return valid TwiML even on error
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">We are experiencing technical difficulties. Please try again later.</Say>
  <Hangup/>
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }
});