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