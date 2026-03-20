import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import { crypto } from 'https://deno.land/std@0.208.0/crypto/mod.ts';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Find user
    const users = await base44.asServiceRole.entities.AppUser.filter({ email });
    if (!users || users.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];

    // Verify password
    const password_hash = await hashPassword(password);
    if (password_hash !== user.password_hash) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT (Note: using demo signature for now)
    const jwtHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const jwtPayload = btoa(JSON.stringify({
      user_id: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    }));
    // TODO: Replace with actual HMAC signature
    const signature = btoa('demo-signature');
    const jwt = `${jwtHeader}.${jwtPayload}.${signature}`;

    return Response.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone },
      jwt,
      cybrid_customer_id: user.cybrid_customer_id,
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});