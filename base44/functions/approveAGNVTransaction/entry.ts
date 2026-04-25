import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { transactionId, approved, rejectionReason = '' } = await req.json();

    const newStatus = approved ? 'completed' : 'failed';

    const transaction = await base44.asServiceRole.entities.AgnvTransaction.update(
      transactionId,
      {
        status: newStatus,
      }
    );

    // Send WhatsApp notification when approved
    if (approved && transaction.recipient_phone) {
      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
      const fromNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER');

      const message = `✅ Your AGNV transfer has been approved!\n\nRecipient: ${transaction.recipient_name}\nAmount: $${transaction.amount_usd} USD = ${transaction.amount_agnv} AGNV\n\nThe funds will be transferred shortly.`;

      // Format phone: ensure it starts with + and contains country code (e.g., +12025551234)
      let formattedPhone = transaction.recipient_phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone.replace(/\D/g, '');
      }
      const toPhone = `whatsapp:${formattedPhone}`;

      try {
        console.log('Sending WhatsApp to:', toPhone);
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            },
            body: new URLSearchParams({
              From: fromNumber,
              To: toPhone,
              Body: message,
            }).toString(),
          }
        );

        const result = await response.json();
        console.log('WhatsApp sent:', result.sid || 'pending');
      } catch (err) {
        console.error('Failed to send WhatsApp notification:', err.message);
      }
    }

    if (!approved && rejectionReason) {
      await base44.integrations.Core.SendEmail({
        to: transaction.created_by,
        subject: 'AGNV Transfer Rejected',
        body: `Your AGNV transfer to ${transaction.recipient_name} has been rejected. Reason: ${rejectionReason}`,
      });
    }

    return Response.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error('Approve AGNV transaction error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});