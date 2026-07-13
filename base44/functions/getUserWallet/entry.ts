import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { ethers } from 'npm:ethers@6.13.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const secretKey = Deno.env.get('THIRDWEB_SECRET_KEY');
    if (!secretKey) return Response.json({ error: 'THIRDWEB_SECRET_KEY not configured' }, { status: 500 });

    // Fetch the in-app user wallet by email
    const response = await fetch(`https://api.thirdweb.com/v1/wallets/user?email=${encodeURIComponent(user.email)}`, {
      method: 'GET',
      headers: { 'x-secret-key': secretKey },
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data?.message || 'Failed to fetch wallet' }, { status: response.status });
    }

    // Response returns a list of wallets matching the email
    const wallets = data?.result?.wallets || [];
    const walletAddress = wallets[0]?.address || null;

    if (!walletAddress) {
      return Response.json({ exists: false, address: null });
    }

    // Get on-chain balances
    const rpcUrls = [
      'https://bsc-dataseed1.binance.org/',
      'https://bsc-dataseed2.binance.org/',
      'https://bsc-dataseed3.binance.org/',
    ];

    let provider = null;
    for (const url of rpcUrls) {
      try {
        const p = new ethers.JsonRpcProvider(url);
        await p.getBlockNumber();
        provider = p;
        break;
      } catch (_) { continue; }
    }

    let bnb = '0', agnv = '0', usdt = '0';

    if (provider) {
      const erc20Abi = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
      const agnvContract = Deno.env.get('AGNV_CONTRACT_ADDRESS');
      const usdtContract = '0x55d398326f99059fF775485246999027B3197955';

      bnb = ethers.formatEther(await provider.getBalance(walletAddress));

      if (agnvContract) {
        const agnvToken = new ethers.Contract(agnvContract, erc20Abi, provider);
        const [bal, dec] = await Promise.all([agnvToken.balanceOf(walletAddress), agnvToken.decimals()]);
        agnv = ethers.formatUnits(bal, dec);
      }

      const usdtToken = new ethers.Contract(usdtContract, erc20Abi, provider);
      const [uBal, uDec] = await Promise.all([usdtToken.balanceOf(walletAddress), usdtToken.decimals()]);
      usdt = ethers.formatUnits(uBal, uDec);
    }

    return Response.json({
      exists: true,
      address: walletAddress,
      bnb,
      agnv,
      usdt,
      usdc: '0',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});