import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      transactionId,
      recipientPhone,
      deliveryMethod = 'whatsapp',
    } = await req.json();

    const transaction = await base44.asServiceRole.entities.AgnvTransaction.get(transactionId);

    if (!transaction) {
      return Response.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const receiptText = `💸 AGNV Transfer Receipt\n\nFrom: ${user.full_name}\nTo: ${transaction.recipient_name}\nPhone: ${transaction.recipient_phone}\nAmount Sent: $${transaction.amount_usd} USD\nReceiver Gets: ${transaction.amount_agnv} AGNV\nStatus: ${transaction.status}\nDate: ${new Date().toLocaleString()}\n\nTransaction ID: ${transactionId}`;

    if (deliveryMethod === 'whatsapp') {
      const encodedMessage = encodeURIComponent(receiptText);
      const phone = recipientPhone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
      return Response.json({
        success: true,
        shareUrl: whatsappUrl,
        method: 'whatsapp',
      });
    } else if (deliveryMethod === 'sms') {
      const phone = recipientPhone.replace(/\D/g, '');
      const smsUrl = `sms:${phone}?body=${encodeURIComponent(receiptText)}`;
      return Response.json({
        success: true,
        shareUrl: smsUrl,
        method: 'sms',
      });
    } else if (deliveryMethod === 'email') {
      await base44.integrations.Core.SendEmail({
        to: recipientPhone,
        subject: 'Your AGNV Transfer Receipt',
        body: receiptText,
      });
      return Response.json({
        success: true,
        method: 'email',
      });
    }

    return Response.json({ error: 'Invalid delivery method' }, { status: 400 });
  } catch (error) {
    console.error('Share receipt error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});