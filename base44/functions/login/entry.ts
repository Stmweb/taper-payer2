import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import bcrypt from 'npm:bcryptjs@2.4.3';

async function generateJWT(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    user_id: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
  }));
  const signature = btoa('demo-signature');
  return `${header}.${payload}.${signature}`;
}

Deno.serve(async (req) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Find user using service role
    const users = await base44.asServiceRole.entities.AppUser.filter({ email: email.toLowerCase().trim() });
    if (!users || users.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];

    // Verify password using bcrypt
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const jwt = await generateJWT(user);

    return Response.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone },
      jwt,
      cybrid_customer_id: user.cybrid_customer_id,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return Response.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
});