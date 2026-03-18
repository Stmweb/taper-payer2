import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { records } = await req.json();

    if (!records || !Array.isArray(records) || records.length === 0) {
      return Response.json({ error: 'No valid records provided' }, { status: 400 });
    }

    let imported = 0;
    const errors = [];

    // Create in batches of 10 to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      for (const record of batch) {
        try {
          await base44.asServiceRole.entities.Subscriber.create(record);
          imported++;
        } catch (e) {
          errors.push({ email: record.email, error: e.message });
        }
      }
    }

    return Response.json({ success: true, imported, errors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});