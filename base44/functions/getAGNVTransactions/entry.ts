import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { filter } = await req.json();

    let txs;
    if (!filter || filter === 'all') {
      txs = await base44.asServiceRole.entities.AgnvTransaction.list('-created_date', 100);
    } else {
      txs = await base44.asServiceRole.entities.AgnvTransaction.filter({ status: filter }, '-created_date', 100);
    }

    // Enrich with sender info from AppUser
    const senderIds = [...new Set(txs.map(t => t.sender_id).filter(Boolean))];
    const senderMap = {};
    for (const sid of senderIds) {
      try {
        const users = await base44.asServiceRole.entities.AppUser.filter({ id: sid }, '-created_date', 1);
        if (users.length > 0) senderMap[sid] = users[0];
      } catch {}
    }

    const enriched = txs.map(tx => ({
      ...tx,
      sender_name: senderMap[tx.sender_id]?.full_name || tx.created_by || 'Unknown',
      sender_email: senderMap[tx.sender_id]?.email || tx.created_by || '',
    }));

    return Response.json({ transactions: enriched });
  } catch (error) {
    console.error('getAGNVTransactions error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});