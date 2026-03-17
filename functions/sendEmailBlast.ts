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
    const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      return Response.json({ error: 'Mailgun credentials not configured' }, { status: 500 });
    }

    // Fetch the campaign
    const campaigns = await base44.asServiceRole.entities.EmailCampaign.filter({ id: campaign_id });
    if (!campaigns || campaigns.length === 0) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }
    const campaign = campaigns[0];

    // Fetch active subscribers
    let subscribers = await base44.asServiceRole.entities.Subscriber.filter({ status: 'active' });

    // Filter by tags if specified
    if (campaign.target_tags && campaign.target_tags.length > 0) {
      subscribers = subscribers.filter(sub =>
        sub.tags && sub.tags.some(tag => campaign.target_tags.includes(tag))
      );
    }

    if (subscribers.length === 0) {
      return Response.json({ success: false, error: 'No active subscribers found' });
    }

    // Send emails via Mailgun
    let sentCount = 0;
    const errors = [];

    for (const subscriber of subscribers) {
      const formData = new FormData();
      formData.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
      formData.append('to', subscriber.email);
      formData.append('subject', campaign.subject);
      const signature = `
<div style="margin-top:40px;padding-top:24px;border-top:2px solid #e2e8f0;font-family:Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
    <tr>
      <td style="padding-bottom:12px;">
        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png" alt="Taper Payer" style="height:50px;width:auto;max-width:200px;display:block;object-fit:contain;" />
      </td>
    </tr>
    <tr>
      <td style="font-size:13px;color:#475569;line-height:1.6;">
        <strong style="color:#1e293b;">Taper Payer LLC</strong><br/>
        254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702<br/>
        📞 <a href="tel:404-994-0766" style="color:#3D7BB7;text-decoration:none;">404-994-0766</a> &nbsp;|&nbsp;
        ✉️ <a href="mailto:info@taperpayer.com" style="color:#3D7BB7;text-decoration:none;">info@taperpayer.com</a><br/>
        🌐 <a href="https://taperpayer.com" style="color:#3D7BB7;text-decoration:none;">taperpayer.com</a>
      </td>
    </tr>
    <tr>
      <td style="padding-top:12px;">
        <a href="https://www.facebook.com/profile.php?id=61583727643100" style="margin-right:8px;text-decoration:none;color:#3D7BB7;font-weight:bold;">Facebook</a>
        <a href="https://x.com/Taperpayer" style="margin-right:8px;text-decoration:none;color:#61AF39;font-weight:bold;">X (Twitter)</a>
        <a href="https://www.instagram.com/taperpayerofficial/" style="text-decoration:none;color:#dc2743;font-weight:bold;">Instagram</a>
      </td>
    </tr>
    <tr>
      <td style="padding-top:12px;font-size:11px;color:#94a3b8;">
        You are receiving this email because you subscribed to Taper Payer updates.
        To unsubscribe, reply with "unsubscribe" in the subject line.
      </td>
    </tr>
  </table>
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