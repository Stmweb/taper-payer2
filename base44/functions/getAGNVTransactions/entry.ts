import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { filter, showTest } = await req.json();

    const query = {};
    if (filter && filter !== 'all') query.status = filter;
    if (showTest) query.is_sample = true;

    let txs;
    if (Object.keys(query).length === 0) {
      txs = await base44.asServiceRole.entities.AgnvTransaction.list('-created_date', 100);
    } else {
      txs = await base44.asServiceRole.entities.AgnvTransaction.filter(query, '-created_date', 100);
    }

    return Response.json({ transactions: txs });
  } catch (error) {
    console.error('getAGNVTransactions error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});