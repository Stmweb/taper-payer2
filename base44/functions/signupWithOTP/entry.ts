import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
  const mailgunKey = Deno.env.get('MAILGUN_API_KEY');

  if (!mailgunDomain || !mailgunKey) {
    throw new Error('Mailgun credentials not configured');
  }

  const formData = new FormData();
  formData.append('from', `noreply@${mailgunDomain}`);
  formData.append('to', email);
  formData.append('subject', 'Your Taper Payer Verification Code');
  formData.append('html', `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #3D7BB7; margin-bottom: 20px;">Welcome to Taper Payer</h2>
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Your verification code is:</p>
          <div style="background-color: #f0f4f8; border: 2px solid #3D7BB7; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="font-size: 32px; font-weight: bold; color: #3D7BB7; margin: 0; letter-spacing: 4px;">${otp}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">This code will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">© 2026 Taper Payer LLC. All rights reserved.</p>
        </div>
      </body>
    </html>
  `);

  const response = await fetch(
    `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
    {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + btoa('api:' + mailgunKey) },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  return await response.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action, email, otp, full_name, phone, password, country, state } = body;

    // Step 1: Request OTP
    if (action === 'request-otp') {
      if (!email) {
        return Response.json({ error: 'Email is required' }, { status: 400 });
      }

      // Check if user already exists
      const existing = await base44.asServiceRole.entities.AppUser.filter({ email });
      if (existing && existing.length > 0) {
        return Response.json({ error: 'Email already registered' }, { status: 409 });
      }

      const newOTP = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      // Store OTP + expiry on a pending AppUser record (reset_otp / reset_otp_expires fields)
      // We reuse these fields for signup pending state; record has no password_hash yet
      const pendingRecords = await base44.asServiceRole.entities.AppUser.filter({ email, password_hash: '' });
      if (pendingRecords && pendingRecords.length > 0) {
        await base44.asServiceRole.entities.AppUser.update(pendingRecords[0].id, {
          reset_otp: newOTP,
          reset_otp_expires: expiresAt,
        });
      } else {
        await base44.asServiceRole.entities.AppUser.create({
          email,
          password_hash: '', // placeholder — will be filled on verify-otp
          full_name: '',
          phone: '',
          reset_otp: newOTP,
          reset_otp_expires: expiresAt,
        });
      }

      await sendOTPEmail(email, newOTP);

      // Do NOT return the OTP in the response
      return Response.json({
        success: true,
        message: 'Verification code sent to your email',
        expiresAt,
      });
    }

    // Step 2: Verify OTP and create account
    if (action === 'verify-otp') {
      if (!email || !otp || !full_name || !phone || !password || !country || !state) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Find the pending signup record
      const pendingRecords = await base44.asServiceRole.entities.AppUser.filter({ email, password_hash: '' });
      if (!pendingRecords || pendingRecords.length === 0) {
        return Response.json({ error: 'No pending verification found. Please request a new code.' }, { status: 400 });
      }

      const pending = pendingRecords[0];

      // Validate OTP
      if (pending.reset_otp !== otp) {
        return Response.json({ error: 'Invalid verification code.' }, { status: 400 });
      }

      // Check expiry
      if (!pending.reset_otp_expires || new Date() > new Date(pending.reset_otp_expires)) {
        return Response.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
      }

      // Hash password
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password));
      const password_hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

      // Create Cybrid customer
      let cybrid_customer_id = null;
      try {
        const cybridKey = Deno.env.get('CYBRID_CLIENT_ID');
        const cybridSecret = Deno.env.get('CYBRID_CLIENT_SECRET');
        const cybridAuth = 'Basic ' + btoa(`${cybridKey}:${cybridSecret}`);

        const tokenRes = await fetch('https://id.sandbox.cybrid.app/oauth/token', {
          method: 'POST',
          headers: { Authorization: cybridAuth, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'grant_type=client_credentials&scope=customers:execute',
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const customerRes = await fetch('https://bank.sandbox.cybrid.app/api/customers', {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'individual' }),
          });
          const customerData = await customerRes.json();
          cybrid_customer_id = customerData.guid;
        }
      } catch (cybridError) {
        console.warn('Cybrid customer creation failed:', cybridError.message);
      }

      // Finalize the user record (fill in all fields, clear OTP)
      const user = await base44.asServiceRole.entities.AppUser.update(pending.id, {
        email,
        password_hash,
        full_name,
        phone,
        country,
        state,
        cybrid_customer_id,
        reset_otp: '',
        reset_otp_expires: '',
      });

      // Generate JWT
      const jwtHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const jwtPayload = btoa(JSON.stringify({
        user_id: pending.id,
        email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7,
      }));
      const jwt = `${jwtHeader}.${jwtPayload}.${btoa('demo-signature')}`;

      return Response.json({
        success: true,
        user: { id: pending.id, email, full_name, phone },
        jwt,
        cybrid_customer_id,
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});