import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      recipientName,
      recipientPhone,
      recipientWallet,
      amountUSD,
      amountAGNV,
      usdcTxHash,
      agnvTxHash,
      status = 'pending',
    } = await req.json();

    const transaction = await base44.asServiceRole.entities.AgnvTransaction.create({
      sender_id: user.id,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      recipient_wallet: recipientWallet || '',
      amount_usd: amountUSD,
      amount_agnv: amountAGNV,
      usdc_tx_hash: usdcTxHash || '',
      agnv_tx_hash: agnvTxHash || '',
      status,
    });

    return Response.json({
      success: true,
      transaction: transaction,
    });
  } catch (error) {
    console.error('Log AGNV transaction error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});