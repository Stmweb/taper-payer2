import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      recipientPhone,
      senderName,
      recipientName,
      sendAmount,
      agnvAmount,
      htgEquiv,
      transactionId,
      method,
    } = await req.json();

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    const twilioWhatsAppNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER');

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }

    const formattedPhone = recipientPhone.replace(/\D/g, '');
    const e164Phone = formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`;

    const receiptText = `💸 AGNV Transfer Receipt\n\nFrom: ${senderName}\nTo: ${recipientName}\nPhone: ${recipientPhone}\nAmount Sent: $${sendAmount} USD\nReceiver Gets: ${agnvAmount} AGNV = ${htgEquiv} HTG\nStatus: Pending Processing\nDate: ${new Date().toLocaleString()}\nID: ${transactionId}`;

    const auth = btoa(`${accountSid}:${authToken}`);

    if (method === 'whatsapp') {
      const whatsappPhone = `whatsapp:${e164Phone}`;
      const fromNumber = `whatsapp:${twilioWhatsAppNumber}`;

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `From=${encodeURIComponent(fromNumber)}&To=${encodeURIComponent(whatsappPhone)}&Body=${encodeURIComponent(receiptText)}`,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twilio WhatsApp error: ${error}`);
      }
    } else if (method === 'sms') {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `From=${encodeURIComponent(twilioPhoneNumber)}&To=${encodeURIComponent(e164Phone)}&Body=${encodeURIComponent(receiptText)}`,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twilio SMS error: ${error}`);
      }
    } else {
      throw new Error('Invalid delivery method');
    }

    return Response.json({ success: true, message: 'Receipt sent successfully' });
  } catch (error) {
    console.error('Error sending receipt:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});