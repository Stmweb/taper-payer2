import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");

async function sendMailgunEmail({ to, subject, html }) {
  const formData = new FormData();
  formData.append("from", `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("html", html);

  const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: "POST",
    headers: { Authorization: "Basic " + btoa("api:" + MAILGUN_API_KEY) },
    body: formData,
  });

  const text = await response.text();
  if (!response.ok) throw new Error(text);
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { event, data } = payload;

    // Only handle update events where status just became "completed"
    if (event?.type !== "update" || data?.status !== "completed") {
      return Response.json({ skipped: true });
    }

    const tx = data;

    // Look up the sender's email from AppUser entity
    let senderEmail = null;
    if (tx.sender_id) {
      const users = await base44.asServiceRole.entities.AppUser.filter({ id: tx.sender_id });
      if (users && users.length > 0) {
        senderEmail = users[0].email;
      }
    }

    if (!senderEmail) {
      console.log("No sender email found for sender_id:", tx.sender_id);
      return Response.json({ skipped: true, reason: "no sender email" });
    }

    const amountUSD = tx.amount_usd ? `$${Number(tx.amount_usd).toFixed(2)} USD` : "N/A";
    const amountAGNV = tx.amount_agnv ? `${Number(tx.amount_agnv).toFixed(4)} AGNV` : "N/A";
    const recipient = tx.recipient_name || tx.recipient_wallet || "your recipient";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #3D7BB7, #61AF39); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <img src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/1bfa6df02_TaperPayerVeryGood.png" alt="Taper Payer" style="height: 60px; margin-bottom: 10px;" />
          <h1 style="color: white; margin: 0; font-size: 24px;">Transaction Successful! ✅</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #334155;">Your AGNV transfer has been <strong>successfully processed</strong>.</p>
          <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Recipient</td><td style="padding: 8px 0; font-weight: bold; color: #1e293b; text-align: right;">${recipient}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Amount Sent</td><td style="padding: 8px 0; font-weight: bold; color: #1e293b; text-align: right;">${amountUSD}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">AGNV Tokens</td><td style="padding: 8px 0; font-weight: bold; color: #3D7BB7; text-align: right;">${amountAGNV}</td></tr>
              ${tx.agnv_tx_hash ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Transaction Hash</td><td style="padding: 8px 0; font-size: 12px; color: #64748b; text-align: right; word-break: break-all;">${tx.agnv_tx_hash}</td></tr>` : ''}
            </table>
          </div>
          <p style="color: #64748b; font-size: 14px;">Thank you for using Taper Payer. If you have any questions, contact us at <a href="mailto:Support@taperpayer.com" style="color: #3D7BB7;">Support@taperpayer.com</a>.</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">© 2026 Taper Payer. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendMailgunEmail({
      to: senderEmail,
      subject: "✅ Your AGNV Transfer Was Successful - Taper Payer",
      html,
    });

    console.log("AGNV completion email sent to:", senderEmail);
    return Response.json({ success: true, sentTo: senderEmail });
  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});