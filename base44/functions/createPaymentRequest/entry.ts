import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function generateRequestId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { recipient, recipient_country, amount, currency, note, delivery_method } = payload;

    const request_id = generateRequestId();
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30); // 30 day expiration

    const paymentRequest = await base44.entities.PaymentRequest.create({
      request_id,
      sender_name: user.full_name,
      sender_email: user.email,
      recipient,
      recipient_country,
      amount,
      currency,
      note: note || '',
      delivery_method,
      status: 'pending',
      expires_at: expires_at.toISOString(),
    });

    const shareUrl = `https://taperpayer.com/PaymentRequest?id=${request_id}`;

    return Response.json({
      success: true,
      request_id,
      share_url: shareUrl,
      request: paymentRequest,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});