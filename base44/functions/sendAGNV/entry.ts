import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { ethers } from 'npm:ethers@6.13.1';

// PancakeSwap Router ABI (swap functions)
const PANCAKESWAP_ROUTER_ABI = [
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)',
  'function getAmountsOut(uint256 amountIn, address[] calldata path) public view returns (uint256[] memory amounts)',
];

// ERC20 Token ABI
const ERC20_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
];

const PANCAKESWAP_ROUTER_ADDRESS = '0x10ED43C718714eb2666A2B5DB2e5A2BDd1e8eD02'; // BSC mainnet

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amountUSD, recipientName, recipientPhone } = await req.json();

    if (!amountUSD || !recipientName || !recipientPhone) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate AGNV amount (1 USD = 10 AGNV)
    const agnvAmount = amountUSD * 10;

    // Record transaction request in AgnvTransaction entity
    try {
      const transaction = await base44.asServiceRole.entities.AgnvTransaction.create({
        sender_id: user.id,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        recipient_wallet: '', // Empty for now, will be set later
        amount_usd: amountUSD,
        amount_agnv: agnvAmount,
        usdc_tx_hash: '',
        agnv_tx_hash: '',
        status: 'pending',
      });

      // Send email receipt to sender via Mailgun
      if (user.email) {
        const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
        const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');
        const date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#7c3aed;margin:0;">AGNV Transfer Receipt</h1>
              <p style="color:#6b7280;margin:4px 0 0;">Taper Payer</p>
            </div>
            <div style="background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
              <h2 style="color:#111827;font-size:18px;margin-top:0;">Transfer Details</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#6b7280;width:40%;">From</td><td style="padding:8px 0;font-weight:600;color:#111827;">${user.full_name || user.email}</td></tr>
                <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">To</td><td style="padding:8px 4px;font-weight:600;color:#111827;">${recipientName}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Recipient Phone</td><td style="padding:8px 0;font-weight:600;color:#111827;">${recipientPhone}</td></tr>
                <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">Amount Sent</td><td style="padding:8px 4px;font-weight:600;color:#111827;">$${amountUSD.toFixed(2)} USD</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">AGNV Tokens</td><td style="padding:8px 0;font-weight:600;color:#7c3aed;">${agnvAmount.toFixed(2)} AGNV</td></tr>
                <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">Status</td><td style="padding:8px 4px;font-weight:600;color:#f59e0b;">Pending Processing</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Transaction ID</td><td style="padding:8px 0;font-size:12px;color:#6b7280;">${transaction.id}</td></tr>
                <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">Date</td><td style="padding:8px 4px;color:#111827;">${date}</td></tr>
              </table>
            </div>
            <p style="text-align:center;color:#9ca3af;font-size:13px;margin-top:20px;">Thank you for using Taper Payer. If you have questions, contact support@taperpayer.com</p>
          </div>`;

        const form = new FormData();
        form.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
        form.append('to', user.email);
        form.append('subject', `Your AGNV Transfer Receipt — $${amountUSD.toFixed(2)} to ${recipientName}`);
        form.append('html', html);
        await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
          method: 'POST',
          headers: { Authorization: 'Basic ' + btoa('api:' + MAILGUN_API_KEY) },
          body: form,
        }).catch(e => console.warn('Receipt email failed:', e.message));
      }

      return Response.json({
        success: true,
        transactionId: transaction.id,
        amountAGNV: agnvAmount,
        recipient: recipientName,
      });
    } catch (e) {
      console.error('Failed to record transaction:', e.message);
      return Response.json({ error: 'Failed to process request' }, { status: 500 });
    }
  } catch (error) {
    console.error('sendAGNV error:', error);
    return Response.json({ error: error.message || 'Transfer failed' }, { status: 500 });
  }
});