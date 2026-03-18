import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch all subscribers
    let allSubs = [];
    let skip = 0;
    const pageSize = 1000;
    while (true) {
      const page = await base44.asServiceRole.entities.Subscriber.list('-created_date', pageSize, skip);
      allSubs = allSubs.concat(page);
      if (page.length < pageSize) break;
      skip += pageSize;
    }

    // Group by email, keep the most recently created one
    const emailMap = new Map();
    for (const sub of allSubs) {
      const email = sub.email?.toLowerCase().trim();
      if (!email) continue;
      if (!emailMap.has(email)) {
        emailMap.set(email, sub);
      } else {
        // Keep the newer one (already sorted by -created_date so first seen = newest)
        // Delete the current duplicate
      }
    }

    // Find duplicates to delete (keep first occurrence per email which is the newest)
    const seen = new Set();
    const toDelete = [];
    for (const sub of allSubs) {
      const email = sub.email?.toLowerCase().trim();
      if (!email) continue;
      if (seen.has(email)) {
        toDelete.push(sub.id);
      } else {
        seen.add(email);
      }
    }

    // Delete duplicates in batches
    let deleted = 0;
    for (const id of toDelete) {
      await base44.asServiceRole.entities.Subscriber.delete(id);
      deleted++;
    }

    return Response.json({ success: true, deleted, remaining: allSubs.length - deleted });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});