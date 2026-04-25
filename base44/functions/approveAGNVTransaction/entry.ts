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