// Twilio Voice Fallback Webhook — "Primary handler fails" (HTTP POST)
// Set this as your Twilio number's Voice Configuration FALLBACK URL

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get('From') || 'Unknown';
    const callSid = params.get('CallSid') || '';
    const errorCode = params.get('ErrorCode') || '';
    const errorUrl = params.get('ErrorUrl') || '';

    console.log(`[twilioVoiceFallback] Fallback triggered from=${from} callSid=${callSid} errorCode=${errorCode} errorUrl=${errorUrl}`);

    // Graceful fallback TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">
    We are sorry, we are experiencing a technical issue. Please visit taper payer dot com or send us a WhatsApp message for assistance. Thank you for your patience.
  </Say>
  <Hangup/>
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('[twilioVoiceFallback] Error:', error.message);

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }
});