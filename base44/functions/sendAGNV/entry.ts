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

    const { amountUSD, recipientName, recipientPhone, recipientWallet } = await req.json();

    if (!amountUSD || !recipientWallet) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate wallet address format
    if (!ethers.isAddress(recipientWallet)) {
      return Response.json({ error: 'Invalid BNB Smart Chain wallet address' }, { status: 400 });
    }

    const privateKey = Deno.env.get('BNB_WALLET_PRIVATE_KEY');
    const rpcUrl = Deno.env.get('BNB_RPC_URL');
    const usdcAddress = Deno.env.get('USDC_CONTRACT_ADDRESS');
    const agnvAddress = Deno.env.get('AGNV_CONTRACT_ADDRESS');

    if (!privateKey || !rpcUrl || !usdcAddress || !agnvAddress) {
      return Response.json({ error: 'Missing blockchain configuration' }, { status: 500 });
    }

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // USDC amount to acquire (1 USD = 1 USDC, assuming 6 decimals on USDC)
    const usdcAmount = ethers.parseUnits(amountUSD.toString(), 6);

    // AGNV amount expected (1 USD = 10 AGNV, assuming 18 decimals on AGNV)
    const agnvAmountExpected = ethers.parseUnits((amountUSD * 10).toString(), 18);
    const minAgnvAmount = (agnvAmountExpected * BigInt(95)) / BigInt(100); // 5% slippage tolerance

    // Create contract instances
    const usdcContract = new ethers.Contract(usdcAddress, ERC20_ABI, wallet);
    const agnvContract = new ethers.Contract(agnvAddress, ERC20_ABI, wallet);
    const routerContract = new ethers.Contract(PANCAKESWAP_ROUTER_ADDRESS, PANCAKESWAP_ROUTER_ABI, wallet);

    // Step 1: Check USDC balance (assumes wallet already has USDC)
    const usdcBalance = await usdcContract.balanceOf(wallet.address);
    if (usdcBalance < usdcAmount) {
      return Response.json({ error: `Insufficient USDC balance. Have: ${ethers.formatUnits(usdcBalance, 6)}, Need: ${amountUSD}` }, { status: 400 });
    }

    // Step 2: Approve USDC for router (if not already approved)
    const allowance = await usdcContract.allowance(wallet.address, PANCAKESWAP_ROUTER_ADDRESS);
    if (allowance < usdcAmount) {
      const approveTx = await usdcContract.approve(PANCAKESWAP_ROUTER_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
    }

    // Step 3: Swap USDC for AGNV via PancakeSwap
    const path = [usdcAddress, agnvAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

    const swapTx = await routerContract.swapExactTokensForTokens(
      usdcAmount,
      minAgnvAmount,
      path,
      wallet.address,
      deadline
    );
    const swapReceipt = await swapTx.wait();

    if (!swapReceipt || swapReceipt.status !== 1) {
      return Response.json({ error: 'PancakeSwap transaction failed' }, { status: 500 });
    }

    // Step 4: Transfer AGNV to recipient
    const transferTx = await agnvContract.transfer(recipientWallet, agnvAmountExpected);
    const transferReceipt = await transferTx.wait();

    if (!transferReceipt || transferReceipt.status !== 1) {
      return Response.json({ error: 'AGNV transfer failed' }, { status: 500 });
    }

    // Step 5: Record transaction in AgnvTransaction entity (if it exists)
    try {
      await base44.asServiceRole.entities.AgnvTransaction.create({
        sender_id: user.id,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        recipient_wallet: recipientWallet,
        amount_usd: amountUSD,
        amount_agnv: parseFloat(ethers.formatUnits(agnvAmountExpected, 18)),
        usdc_tx_hash: swapTx.hash,
        agnv_tx_hash: transferTx.hash,
        status: 'completed',
      });
    } catch (e) {
      console.warn('Failed to record transaction in database:', e.message);
    }

    return Response.json({
      success: true,
      txHash: transferTx.hash,
      amountAGNV: ethers.formatUnits(agnvAmountExpected, 18),
      recipient: recipientWallet,
    });
  } catch (error) {
    console.error('sendAGNV error:', error);
    return Response.json({ error: error.message || 'Transfer failed' }, { status: 500 });
  }
});