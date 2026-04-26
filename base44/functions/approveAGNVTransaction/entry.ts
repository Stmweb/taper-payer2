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

    if (approved && transaction.created_by) {
      const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
      const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');
      const date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#16a34a;margin:0;">✅ Transfer Completed!</h1>
            <p style="color:#6b7280;margin:4px 0 0;">Taper Payer</p>
          </div>
          <div style="background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
            <h2 style="color:#111827;font-size:18px;margin-top:0;">Your AGNV transfer has been completed</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6b7280;width:40%;">To</td><td style="padding:8px 0;font-weight:600;color:#111827;">${transaction.recipient_name}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">Recipient Phone</td><td style="padding:8px 4px;font-weight:600;color:#111827;">${transaction.recipient_phone}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Amount</td><td style="padding:8px 0;font-weight:600;color:#111827;">$${transaction.amount_usd} USD</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">AGNV Tokens</td><td style="padding:8px 4px;font-weight:600;color:#7c3aed;">${transaction.amount_agnv} AGNV</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Status</td><td style="padding:8px 0;font-weight:600;color:#16a34a;">Completed ✅</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">Date</td><td style="padding:8px 4px;color:#111827;">${date}</td></tr>
            </table>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:13px;margin-top:20px;">Thank you for using Taper Payer. Questions? Contact support@taperpayer.com</p>
        </div>`;

      const form = new FormData();
      form.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
      form.append('to', transaction.created_by);
      form.append('subject', `Your AGNV Transfer to ${transaction.recipient_name} is Complete!`);
      form.append('html', html);
      await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa('api:' + MAILGUN_API_KEY) },
        body: form,
      }).catch(e => console.warn('Completion email failed:', e.message));
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