// Twilio SMS Delivery Status Callback Webhook (HTTP POST)
// Set this as your Twilio Messaging Service "Delivery Status Callback URL"

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const messageSid = params.get('MessageSid') || '';
    const messageStatus = params.get('MessageStatus') || '';
    const to = params.get('To') || '';
    const from = params.get('From') || '';
    const errorCode = params.get('ErrorCode') || '';
    const errorMessage = params.get('ErrorMessage') || '';

    console.log(`[twilioStatusCallback] MessageSid=${messageSid} Status=${messageStatus} To=${to} From=${from}`);

    if (errorCode) {
      console.error(`[twilioStatusCallback] Delivery error: ErrorCode=${errorCode} ErrorMessage=${errorMessage}`);
    }

    // Twilio expects a 204 No Content response for status callbacks
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[twilioStatusCallback] Error:', error.message);
    return new Response(null, { status: 204 });
  }
});