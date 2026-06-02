import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BLINDPAY_API_KEY = Deno.env.get('BLINDPAY_API_KEY') || 'UUsDt8oFBahfbCPp16wmMm';
const BLINDPAY_INSTANCE_ID = 'in_xM273RfKTSId';
const BASE = `https://api.blindpay.com/v1/instances/${BLINDPAY_INSTANCE_ID}`;
const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');
const ALERT_EMAIL = 'support@taperpayer.com';

const bp = (path) => fetch(`${BASE}${path}`, {
  headers: { 'Authorization': `Bearer ${BLINDPAY_API_KEY}`, 'Content-Type': 'application/json' }
});

async function sendAlertEmail(subject, htmlBody) {
  const form = new URLSearchParams();
  form.append('from', `Taper Payer Alerts <noreply@${MAILGUN_DOMAIN}>`);
  form.append('to', ALERT_EMAIL);
  form.append('subject', subject);
  form.append('html', htmlBody);

  const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`),
    },
    body: form,
  });
  return res.ok;
}

function statusColor(status) {
  if (['completed', 'paid', 'settled', 'success'].includes(status)) return '#16a34a';
  if (['failed', 'rejected', 'canceled'].includes(status)) return '#dc2626';
  if (['on_hold', 'verifying', 'pending'].includes(status)) return '#ca8a04';
  return '#2563eb';
}

function buildEmailHtml(type, transactions) {
  const rows = transactions.map(t => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:12px;color:#64748b">${t.id}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-weight:600">${t.amount || '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">
        <span style="background:${statusColor(t.status)}20;color:${statusColor(t.status)};padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:500">${t.status || '—'}</span>
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#94a3b8">${t.created_at ? new Date(t.created_at).toLocaleString() : '—'}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family:Inter,sans-serif;max-width:700px;margin:0 auto;background:#fff">
      <div style="background:#1e293b;padding:24px 32px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0;font-size:20px">🔔 Blindpay ${type} Status Alert</h2>
        <p style="color:#94a3b8;margin:4px 0 0">Transaction report — ${new Date().toUTCString()}</p>
      </div>
      <div style="padding:24px 32px;background:#f8fafc">
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
          <thead>
            <tr style="background:#f1f5f9">
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#64748b;letter-spacing:0.05em">ID</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#64748b;letter-spacing:0.05em">Amount</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#64748b;letter-spacing:0.05em">Status</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#64748b;letter-spacing:0.05em">Date</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="color:#94a3b8;font-size:12px;margin-top:16px;text-align:center">Taper Payer · Blindpay Monitoring</p>
      </div>
    </div>
  `;
}

// Track seen statuses in-memory (stateless between calls — use entity for persistence)
// We'll store last-known statuses in a base44 entity-like approach via the scheduled context
async function getAndSendAlerts(base44) {
  const [payinsRes, payoutsRes] = await Promise.all([
    bp('/payins'),
    bp('/payouts'),
  ]);

  const [payinsRaw, payoutsRaw] = await Promise.all([
    payinsRes.json(),
    payoutsRes.json(),
  ]);

  const payins = Array.isArray(payinsRaw) ? payinsRaw : (payinsRaw.data || []);
  const payouts = Array.isArray(payoutsRaw) ? payoutsRaw : (payoutsRaw.data || []);

  const alerts = [];

  // Fetch previously known statuses from entity store
  const knownRecords = await base44.asServiceRole.entities.BlindpayTransactionStatus.list();
  const knownMap = {};
  for (const rec of knownRecords) {
    knownMap[rec.transaction_id] = rec;
  }

  const changedPayins = [];
  for (const p of payins) {
    const known = knownMap[p.id];
    if (!known) {
      // New transaction — create record
      await base44.asServiceRole.entities.BlindpayTransactionStatus.create({
        transaction_id: p.id,
        transaction_type: 'payin',
        last_status: p.status,
      });
      changedPayins.push({ ...p, oldStatus: null, isNew: true });
    } else if (known.last_status !== p.status) {
      // Status changed — update record
      await base44.asServiceRole.entities.BlindpayTransactionStatus.update(known.id, { last_status: p.status });
      changedPayins.push({ ...p, oldStatus: known.last_status });
    }
  }

  const changedPayouts = [];
  for (const p of payouts) {
    const known = knownMap[p.id];
    if (!known) {
      await base44.asServiceRole.entities.BlindpayTransactionStatus.create({
        transaction_id: p.id,
        transaction_type: 'payout',
        last_status: p.status,
      });
      changedPayouts.push({ ...p, oldStatus: null, isNew: true });
    } else if (known.last_status !== p.status) {
      await base44.asServiceRole.entities.BlindpayTransactionStatus.update(known.id, { last_status: p.status });
      changedPayouts.push({ ...p, oldStatus: known.last_status });
    }
  }

  if (changedPayins.length > 0) {
    const formatted = changedPayins.map(p => ({
      id: p.id,
      amount: p.request_amount != null ? `${(p.request_amount / 100).toFixed(2)} ${p.request_currency || 'USD'}` : '—',
      status: p.status,
      created_at: p.created_at,
    }));
    const subject = changedPayins.some(p => p.isNew)
      ? `[Blindpay] New/Updated Payin(s) Detected (${changedPayins.length})`
      : `[Blindpay] Payin Status Changed (${changedPayins.length})`;
    const sent = await sendAlertEmail(subject, buildEmailHtml('Payin', formatted));
    alerts.push({ type: 'payins', count: changedPayins.length, sent });
  }

  if (changedPayouts.length > 0) {
    const formatted = changedPayouts.map(p => ({
      id: p.id,
      amount: p.request_amount != null ? `${(p.request_amount / 100).toFixed(2)} USDC` : '—',
      status: p.status,
      created_at: p.created_at,
    }));
    const subject = changedPayouts.some(p => p.isNew)
      ? `[Blindpay] New/Updated Payout(s) Detected (${changedPayouts.length})`
      : `[Blindpay] Payout Status Changed (${changedPayouts.length})`;
    const sent = await sendAlertEmail(subject, buildEmailHtml('Payout', formatted));
    alerts.push({ type: 'payouts', count: changedPayouts.length, sent });
  }

  return { alerts, changed_payins: changedPayins.length, changed_payouts: changedPayouts.length };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow scheduled/automation calls (no user) and admin manual calls
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await getAndSendAlerts(base44);
    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});