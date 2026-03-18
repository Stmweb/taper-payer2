import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { campaign_id } = await req.json();

    if (!campaign_id) {
      return Response.json({ error: 'campaign_id is required' }, { status: 400 });
    }

    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = 'mail.taperpayer.com';

    if (!MAILGUN_API_KEY) {
      return Response.json({ error: 'Mailgun credentials not configured' }, { status: 500 });
    }

    // Fetch the campaign
    const campaigns = await base44.asServiceRole.entities.EmailCampaign.filter({ id: campaign_id });
    if (!campaigns || campaigns.length === 0) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }
    const campaign = campaigns[0];

    // Build recipient list
    let subscribers = [];

    if (campaign.manual_emails && campaign.manual_emails.trim()) {
      // Parse manually entered emails
      const lines = campaign.manual_emails.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        const parts = line.split(',');
        const email = parts[0]?.trim();
        const name = parts[1]?.trim() || '';
        if (email && email.includes('@')) {
          subscribers.push({ email, name });
        }
      }
    } else {
      // Fetch active subscribers from DB
      subscribers = await base44.asServiceRole.entities.Subscriber.filter({ status: 'active' });

      // Filter by contact list if specified
      if (campaign.contact_list_id) {
        const lists = await base44.asServiceRole.entities.ContactList.filter({ id: campaign.contact_list_id });
        if (lists && lists.length > 0 && lists[0].subscriber_ids && lists[0].subscriber_ids.length > 0) {
          const listIds = new Set(lists[0].subscriber_ids);
          subscribers = subscribers.filter(sub => listIds.has(sub.id));
        }
      }

      // Filter by tags if specified
      if (campaign.target_tags && campaign.target_tags.length > 0) {
        subscribers = subscribers.filter(sub =>
          sub.tags && sub.tags.some(tag => campaign.target_tags.includes(tag))
        );
      }
    }

    if (subscribers.length === 0) {
      return Response.json({ success: false, error: 'No recipients found' });
    }

    // Send emails via Mailgun
    let sentCount = 0;
    const errors = [];

    for (const subscriber of subscribers) {
      const formData = new FormData();
      const senderName = campaign.sender_name || 'Taper Payer';
      const senderEmail = campaign.sender_email || `support@mail.taperpayer.com`;
      formData.append('from', `${senderName} <${senderEmail}>`);
      formData.append('to', subscriber.email);
      formData.append('subject', campaign.subject);
      const signature = `
<div style="margin-top:40px;padding-top:24px;border-top:2px solid #e2e8f0;font-family:Arial,sans-serif;padding:24px;border-radius:8px;background:transparent;">
  <div style="text-align:center;margin-bottom:16px;background:transparent;">
    <img src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/f3100c512_TPGT.png" alt="Taper Payer" style="height:80px;width:auto;max-width:250px;display:block;margin:0 auto;object-fit:contain;" />
  </div>
  <div style="text-align:center;margin-bottom:20px;">
    <h3 style="color:#1e293b;margin:0 0 4px 0;font-size:16px;font-weight:bold;">Taper Payer</h3>
    <p style="color:#64748b;margin:0;font-size:12px;">Redefining the Future of Payments</p>
  </div>
  <div style="text-align:center;font-size:13px;color:#475569;line-height:1.8;margin-bottom:16px;">
    🌐 <a href="https://www.taperpayer.com" style="color:#3D7BB7;text-decoration:none;font-weight:bold;">www.taperpayer.com</a><br/>
    📧 <a href="mailto:support@taperpayer.com" style="color:#3D7BB7;text-decoration:none;font-weight:bold;">support@taperpayer.com</a><br/>
    Newark, Delaware
  </div>
  <div style="text-align:center;font-size:12px;color:#64748b;margin-bottom:16px;">
    Follow Us: <a href="https://x.com/Taperpayer" style="color:#3D7BB7;text-decoration:none;font-weight:bold;">Twitter</a> • <a href="https://www.instagram.com/taperpayerofficial/" style="color:#3D7BB7;text-decoration:none;font-weight:bold;">Instagram</a> • <a href="https://www.facebook.com/profile.php?id=61583727643100" style="color:#3D7BB7;text-decoration:none;font-weight:bold;">Facebook</a>
  </div>
  <div style="border-top:1px solid #e2e8f0;padding-top:12px;font-size:11px;color:#94a3b8;text-align:center;">
    <p style="margin:0 0 8px 0;">This email and any attachments are confidential and intended solely for the recipient.</p>
    <p style="margin:0;">© 2026 Taper Payer. All rights reserved.</p>
  </div>
</div>`;

      formData.append('html', campaign.body_html + signature);

      const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`)
        },
        body: formData
      });

      if (response.ok) {
        sentCount++;
      } else {
        const err = await response.text();
        errors.push({ email: subscriber.email, error: err });
      }
    }

    // Update campaign status
    await base44.asServiceRole.entities.EmailCampaign.update(campaign_id, {
      status: sentCount > 0 ? 'sent' : 'failed',
      sent_count: sentCount,
      sent_at: new Date().toISOString()
    });

    return Response.json({
      success: true,
      sent_count: sentCount,
      total: subscribers.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});