/**
 * executeAGNVSwap
 *
 * Full automated pipeline:
 *  1. Buy USDC via Coinbase Advanced Trade API (market order USD → USDC)
 *  2. Withdraw USDC from Coinbase to our BNB wallet
 *  3. Approve PancakeSwap router to spend USDC
 *  4. Swap USDC → AGNV on PancakeSwap (BNB Smart Chain)
 *  5. Transfer AGNV to recipient wallet
 *  6. Update AgnvTransaction record to "completed"
 *  7. Notify recipient via WhatsApp + email
 *
 * Called internally after a successful Square payment in sendAGNV.
 * Admin-only (or called from trusted backend context with transactionId).
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { ethers } from 'npm:ethers@6.13.1';
import { createHmac } from 'node:crypto';

// ── ABI ─────────────────────────────────────────────────────────────────────
const PANCAKESWAP_ROUTER_ABI = [
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)',
  'function getAmountsOut(uint256 amountIn, address[] calldata path) public view returns (uint256[] memory amounts)',
];

const ERC20_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function decimals() external view returns (uint8)',
];

const PANCAKESWAP_ROUTER = '0x10ED43C718714eb2666A2B5DB2e5A2BDd1e8eD02';

// ── Coinbase Advanced Trade helpers ─────────────────────────────────────────
function coinbaseSign(method, path, body, apiKey, apiSecret) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = timestamp + method.toUpperCase() + path + (body || '');
  const sig = createHmac('sha256', apiSecret).update(message).digest('hex');
  return { timestamp, sig };
}

async function coinbaseFetch(method, path, bodyObj, apiKey, apiSecret) {
  const body = bodyObj ? JSON.stringify(bodyObj) : '';
  const { timestamp, sig } = coinbaseSign(method, path, body, apiKey, apiSecret);
  const res = await fetch(`https://api.coinbase.com${path}`, {
    method,
    headers: {
      'CB-ACCESS-KEY': apiKey,
      'CB-ACCESS-SIGN': sig,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'Content-Type': 'application/json',
    },
    body: body || undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Coinbase ${method} ${path} failed: ${JSON.stringify(data)}`);
  return data;
}

// ── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Accept calls from admin users or from our own backend (service role will have no user)
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      transactionId,   // AgnvTransaction entity ID
      amountUSD,       // e.g. 50
      recipientWallet, // BNB wallet address of recipient
      recipientName,
      recipientPhone,
      recipientEmail,
    } = await req.json();

    if (!transactionId || !amountUSD || !recipientWallet) {
      return Response.json({ error: 'Missing required fields: transactionId, amountUSD, recipientWallet' }, { status: 400 });
    }

    const COINBASE_API_KEY    = Deno.env.get('COINBASE_API_KEY');
    const COINBASE_API_SECRET = Deno.env.get('COINBASE_API_SECRET');
    const BNB_RPC_URL         = Deno.env.get('BNB_RPC_URL');
    const WALLET_PRIVATE_KEY  = Deno.env.get('BNB_WALLET_PRIVATE_KEY');
    const USDC_ADDRESS        = Deno.env.get('USDC_CONTRACT_ADDRESS');
    const AGNV_ADDRESS        = Deno.env.get('AGNV_CONTRACT_ADDRESS');
    const MAILGUN_API_KEY     = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN      = Deno.env.get('MAILGUN_DOMAIN');
    const TWILIO_ACCOUNT_SID  = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN   = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_WA_NUMBER    = Deno.env.get('TWILIO_WHATSAPP_NUMBER');

    // ── Step 1: Buy USDC on Coinbase ────────────────────────────────────────
    console.log(`[AGNV] Step 1: Buying $${amountUSD} USDC on Coinbase...`);

    // Get the USD account
    const accountsData = await coinbaseFetch('GET', '/v2/accounts?limit=100', null, COINBASE_API_KEY, COINBASE_API_SECRET);
    const usdAccount = accountsData.data?.find(a => a.currency?.code === 'USD' || a.type === 'fiat');

    if (!usdAccount) {
      throw new Error('Coinbase USD account not found');
    }

    // Place a market buy order for USDC
    const buyOrder = await coinbaseFetch('POST', '/v2/accounts/' + usdAccount.id + '/buys', {
      amount: amountUSD.toString(),
      currency: 'USDC',
      payment_method: 'primary', // uses default payment method
      quote: false,
    }, COINBASE_API_KEY, COINBASE_API_SECRET);

    const usdcBought = parseFloat(buyOrder.buy?.amount?.amount || amountUSD * 0.999);
    console.log(`[AGNV] Coinbase buy order placed. USDC amount: ${usdcBought}`);

    // Wait briefly for order to settle (market orders are near-instant)
    await new Promise(r => setTimeout(r, 3000));

    // ── Step 2: Withdraw USDC from Coinbase to our BNB wallet ───────────────
    console.log(`[AGNV] Step 2: Withdrawing USDC to BNB wallet...`);

    const usdcAccountsData = await coinbaseFetch('GET', '/v2/accounts?limit=100', null, COINBASE_API_KEY, COINBASE_API_SECRET);
    const usdcAccount = usdcAccountsData.data?.find(a => a.currency?.code === 'USDC');

    if (!usdcAccount) {
      throw new Error('Coinbase USDC account not found');
    }

    const walletProvider = new ethers.JsonRpcProvider(BNB_RPC_URL);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, walletProvider);
    const ourWalletAddress = wallet.address;

    // Send USDC from Coinbase to our BNB Smart Chain wallet
    const withdrawal = await coinbaseFetch('POST', `/v2/accounts/${usdcAccount.id}/transactions`, {
      type: 'send',
      to: ourWalletAddress,
      amount: usdcBought.toFixed(6),
      currency: 'USDC',
      network: 'bsc', // BNB Smart Chain
    }, COINBASE_API_KEY, COINBASE_API_SECRET);

    console.log(`[AGNV] Withdrawal initiated: ${withdrawal.data?.id}`);

    // Wait for on-chain arrival (poll USDC balance, max 5 min)
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
    const usdcDecimals = await usdcContract.decimals();
    const expectedUsdc = ethers.parseUnits(usdcBought.toFixed(6), usdcDecimals);

    console.log('[AGNV] Waiting for USDC to arrive on BNB chain...');
    let arrived = false;
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const balance = await usdcContract.balanceOf(ourWalletAddress);
      if (balance >= expectedUsdc / 2n) { // at least half arrived
        arrived = true;
        console.log(`[AGNV] USDC arrived: ${ethers.formatUnits(balance, usdcDecimals)}`);
        break;
      }
    }

    if (!arrived) {
      throw new Error('USDC did not arrive on BNB chain within timeout');
    }

    const usdcBalance = await usdcContract.balanceOf(ourWalletAddress);
    const usdcAmountToSwap = usdcBalance < expectedUsdc ? usdcBalance : expectedUsdc;

    // ── Step 3: Approve PancakeSwap to spend USDC ───────────────────────────
    console.log('[AGNV] Step 3: Approving PancakeSwap router...');
    const approveTx = await usdcContract.approve(PANCAKESWAP_ROUTER, usdcAmountToSwap);
    await approveTx.wait();
    console.log('[AGNV] Approval confirmed.');

    // ── Step 4: Swap USDC → AGNV on PancakeSwap ─────────────────────────────
    console.log('[AGNV] Step 4: Swapping USDC → AGNV on PancakeSwap...');
    const router = new ethers.Contract(PANCAKESWAP_ROUTER, PANCAKESWAP_ROUTER_ABI, wallet);

    const path = [USDC_ADDRESS, AGNV_ADDRESS];
    const amounts = await router.getAmountsOut(usdcAmountToSwap, path);
    const amountOutMin = amounts[1] * 95n / 100n; // 5% slippage tolerance
    const deadline = Math.floor(Date.now() / 1000) + 300; // 5 min

    const swapTx = await router.swapExactTokensForTokens(
      usdcAmountToSwap,
      amountOutMin,
      path,
      ourWalletAddress, // receive AGNV to our wallet first
      deadline
    );
    const swapReceipt = await swapTx.wait();
    const usdcTxHash = swapReceipt.hash;
    console.log(`[AGNV] Swap complete. Tx: ${usdcTxHash}`);

    // ── Step 5: Transfer AGNV to recipient wallet ────────────────────────────
    console.log(`[AGNV] Step 5: Transferring AGNV to ${recipientWallet}...`);
    const agnvContract = new ethers.Contract(AGNV_ADDRESS, ERC20_ABI, wallet);
    const agnvDecimals = await agnvContract.decimals();
    const agnvBalance = await agnvContract.balanceOf(ourWalletAddress);

    const transferTx = await agnvContract.transfer(recipientWallet, agnvBalance);
    const transferReceipt = await transferTx.wait();
    const agnvTxHash = transferReceipt.hash;
    const amountAGNV = parseFloat(ethers.formatUnits(agnvBalance, agnvDecimals));

    console.log(`[AGNV] Transfer complete. AGNV sent: ${amountAGNV}. Tx: ${agnvTxHash}`);

    // ── Step 6: Update transaction record ───────────────────────────────────
    await base44.asServiceRole.entities.AgnvTransaction.update(transactionId, {
      status: 'completed',
      usdc_tx_hash: usdcTxHash,
      agnv_tx_hash: agnvTxHash,
      amount_agnv: amountAGNV,
      recipient_wallet: recipientWallet,
    });

    // ── Step 7: Notify recipient via WhatsApp ───────────────────────────────
    if (recipientPhone && TWILIO_ACCOUNT_SID) {
      let phone = recipientPhone.trim();
      if (!phone.startsWith('+')) phone = '+' + phone.replace(/\D/g, '');
      const waMessage = `✅ You've received ${amountAGNV.toFixed(2)} AGNV tokens!\n\nFrom: ${recipientName || 'Taper Payer'}\nAmount: $${amountUSD} USD → ${amountAGNV.toFixed(2)} AGNV\nWallet: ${recipientWallet}\nTx: https://bscscan.com/tx/${agnvTxHash}\n\nThank you for using Taper Payer!`;

      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: TWILIO_WA_NUMBER,
          To: `whatsapp:${phone}`,
          Body: waMessage,
        }).toString(),
      }).catch(e => console.warn('WhatsApp notify failed:', e.message));
    }

    // ── Step 7b: Email sender receipt ───────────────────────────────────────
    if (recipientEmail && MAILGUN_API_KEY) {
      const date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#16a34a;margin:0;">✅ AGNV Transfer Complete!</h1>
            <p style="color:#6b7280;margin:4px 0 0;">Taper Payer</p>
          </div>
          <div style="background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6b7280;width:40%;">Recipient</td><td style="padding:8px 0;font-weight:600;">${recipientName || recipientWallet}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">Amount USD</td><td style="padding:8px 4px;font-weight:600;">$${amountUSD}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">AGNV Sent</td><td style="padding:8px 0;font-weight:600;color:#7c3aed;">${amountAGNV.toFixed(4)} AGNV</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">USDC Swap Tx</td><td style="padding:8px 4px;font-size:11px;word-break:break-all;">${usdcTxHash}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">AGNV Transfer Tx</td><td style="padding:8px 0;font-size:11px;word-break:break-all;">${agnvTxHash}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 4px;color:#6b7280;">Date</td><td style="padding:8px 4px;">${date}</td></tr>
            </table>
            <div style="text-align:center;margin-top:16px;">
              <a href="https://bscscan.com/tx/${agnvTxHash}" style="background:#7c3aed;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View on BSCScan</a>
            </div>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:13px;margin-top:20px;">Questions? Contact support@taperpayer.com</p>
        </div>`;

      const form = new FormData();
      form.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
      form.append('to', recipientEmail);
      form.append('subject', `AGNV Transfer Complete — ${amountAGNV.toFixed(2)} AGNV Sent`);
      form.append('html', html);
      await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa('api:' + MAILGUN_API_KEY) },
        body: form,
      }).catch(e => console.warn('Email failed:', e.message));
    }

    return Response.json({
      success: true,
      transactionId,
      amountAGNV,
      usdcTxHash,
      agnvTxHash,
      recipientWallet,
    });

  } catch (error) {
    console.error('[AGNV] executeAGNVSwap error:', error);

    // Try to mark transaction as failed
    try {
      const { transactionId } = await req.clone().json().catch(() => ({}));
      if (transactionId) {
        const base44 = createClientFromRequest(req);
        await base44.asServiceRole.entities.AgnvTransaction.update(transactionId, {
          status: 'failed',
          description: error.message,
        });
      }
    } catch (_) {}

    return Response.json({ error: error.message || 'Swap execution failed' }, { status: 500 });
  }
});