import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import bcrypt from 'npm:bcryptjs@2.4.3';

async function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { email, password, full_name, phone, country, state, referral_code } = body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    // Validate input
    if (!normalizedEmail || !password || !full_name || !phone) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await base44.asServiceRole.entities.AppUser.filter({ email: normalizedEmail });
    if (existing && existing.length > 0) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create Cybrid customer
    let cybrid_customer_id = null;
    try {
      const cybridKey = Deno.env.get('CYBRID_CLIENT_ID');
      const cybridSecret = Deno.env.get('CYBRID_CLIENT_SECRET');
      const cybridAuth = 'Basic ' + btoa(`${cybridKey}:${cybridSecret}`);

      // Get Cybrid access token
      const tokenRes = await fetch('https://api.cybrid.io/oauth/token', {
        method: 'POST',
        headers: { Authorization: cybridAuth, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=client_credentials&scope=customers:execute',
      });
      
      if (!tokenRes.ok) {
        throw new Error(`Cybrid auth failed: ${tokenRes.status}`);
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Create customer in Cybrid
      const customerRes = await fetch('https://api.cybrid.io/api/customers', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'individual',
          email: email,
          first_name: full_name.split(' ')[0],
          last_name: full_name.split(' ').slice(1).join(' ') || 'User',
        }),
      });

      const customerData = await customerRes.json();
      cybrid_customer_id = customerData.guid;
    } catch (cybridError) {
      console.warn('Cybrid customer creation failed:', cybridError.message);
      // Continue without Cybrid customer for now
    }

    // Create user in AppUser
    const user = await base44.asServiceRole.entities.AppUser.create({
      email: normalizedEmail,
      password_hash,
      full_name,
      phone,
      country: country || '',
      state: state || '',
      cybrid_customer_id,
    });

    // Generate JWT
    const jwtHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const jwtPayload = btoa(JSON.stringify({
      user_id: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
    }));
    const signature = btoa('demo-signature');
    const jwt = `${jwtHeader}.${jwtPayload}.${signature}`;

    return Response.json({
      success: true,
      user: { id: user.id, email: user.email, full_name, phone },
      jwt,
      cybrid_customer_id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});