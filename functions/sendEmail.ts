const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");

async function sendMailgunEmail(opts) {
  const { to, subject, html, text, from, replyTo } = opts;
  const formData = new FormData();
  formData.append("from", from || ("Taper Payer <noreply@" + MAILGUN_DOMAIN + ">"));
  formData.append("to", to);
  formData.append("subject", subject);
  if (html) formData.append("html", html);
  if (text) formData.append("text", text);
  if (replyTo) formData.append("h:Reply-To", replyTo);

  // Try US endpoint first, fall back to EU if needed
  const endpoint = "https://api.mailgun.net/v3/" + MAILGUN_DOMAIN + "/messages";
  console.log("Posting to:", endpoint);
  const response = await fetch(
    endpoint,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa("api:" + MAILGUN_API_KEY),
      },
      body: formData,
    }
  );

  const responseText = await response.text();
  console.log("Mailgun status:", response.status, "body:", responseText.substring(0, 200));
  let result = {};
  try { result = JSON.parse(responseText); } catch {}
  if (!response.ok) throw new Error(result.message || responseText || "Mailgun error");
  return result;
}

Deno.serve(async (req) => {
  try {
    const rawText = await req.text();
    console.log("RAW:", rawText.substring(0, 50));
    // Extract only the JSON object portion of the body
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    console.log("MATCH:", jsonMatch ? jsonMatch[0].substring(0, 50) : "none");
    const body = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    const type = body.type;
    console.log("TYPE:", type);

    if (type === "contact") {
      const { name, email, phone, message } = body;
      await sendMailgunEmail({
        to: "Support@taperpayer.com",
        subject: "New Contact Form Submission from " + name,
        html: "<h2>New Contact Form Message</h2><p><strong>Name:</strong> " + name + "</p><p><strong>Email:</strong> " + email + "</p><p><strong>Phone:</strong> " + (phone || "N/A") + "</p><p><strong>Message:</strong></p><p>" + message + "</p>",
        replyTo: email,
      });
      await sendMailgunEmail({
        to: email,
        subject: "We received your message - Taper Payer",
        html: "<h2>Hi " + name + ",</h2><p>Thank you for reaching out! We have received your message and our support team will get back to you within 24 hours.</p><p><strong>Your message:</strong></p><p>" + message + "</p><br/><p>Best regards,<br/>The Taper Payer Team</p>",
      });
      return Response.json({ success: true });
    }

    if (type === "transactional") {
      const result = await sendMailgunEmail({
        to: body.to,
        subject: body.subject,
        html: body.html,
        text: body.text,
      });
      return Response.json({ success: true, id: result.id });
    }

    if (type === "marketing") {
      const result = await sendMailgunEmail({
        to: body.to,
        subject: body.subject,
        html: body.html,
        text: body.text,
        from: "Taper Payer <newsletter@" + MAILGUN_DOMAIN + ">",
      });
      return Response.json({ success: true, id: result.id });
    }

    return Response.json({ error: "Invalid email type" }, { status: 400 });
  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});