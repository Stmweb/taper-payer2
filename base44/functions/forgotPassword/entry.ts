import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { action, email, otp, new_password } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    if (action === 'request-reset') {
      // Find the user
      const users = await base44.asServiceRole.entities.AppUser.filter({ email: email.toLowerCase().trim() });
      // Always respond with success to prevent email enumeration
      if (users.length === 0) {
        return Response.json({ success: true, message: 'If an account exists, a reset code has been sent.' });
      }

      const user = users[0];

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

      // Store OTP on user record
      await base44.asServiceRole.entities.AppUser.update(user.id, {
        reset_otp: otpCode,
        reset_otp_expires: expiresAt,
      });

      // Send email via Mailgun
      const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
      const mailgunKey = Deno.env.get('MAILGUN_API_KEY');

      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2479C2;">Reset Your Taper Payer Password</h2>
          <p>You requested a password reset. Use the code below:</p>
          <div style="background: #f0f4ff; border-radius: 8px; padding: 24px; text-align: center; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2479C2;">${otpCode}</span>
          </div>
          <p style="color: #666;">This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `;

      await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`api:${mailgunKey}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Taper Payer <noreply@${mailgunDomain}>`,
          to: email,
          subject: 'Your Taper Payer Password Reset Code',
          html: emailBody,
        }),
      });

      return Response.json({ success: true, message: 'If an account exists, a reset code has been sent.' });
    }

    if (action === 'reset-password') {
      if (!otp || !new_password) {
        return Response.json({ error: 'OTP and new password are required' }, { status: 400 });
      }

      const users = await base44.asServiceRole.entities.AppUser.filter({ email: email.toLowerCase().trim() });
      if (users.length === 0) {
        return Response.json({ error: 'Invalid or expired code' }, { status: 400 });
      }

      const user = users[0];

      // Verify OTP
      if (user.reset_otp !== otp) {
        return Response.json({ error: 'Invalid verification code' }, { status: 400 });
      }
      if (!user.reset_otp_expires || new Date() > new Date(user.reset_otp_expires)) {
        return Response.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
      }

      // Hash the new password using bcrypt
      const bcrypt = await import('npm:bcryptjs@2.4.3');
      const hash = await bcrypt.hash(new_password, 10);

      // Update password and clear OTP
      await base44.asServiceRole.entities.AppUser.update(user.id, {
        password_hash: hash,
        reset_otp: null,
        reset_otp_expires: null,
      });

      return Response.json({ success: true, message: 'Password updated successfully.' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});