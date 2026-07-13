import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { ethers } from 'npm:ethers@6.13.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const secretKey = Deno.env.get('THIRDWEB_SECRET_KEY');
    if (!secretKey) return Response.json({ error: 'THIRDWEB_SECRET_KEY not configured' }, { status: 500 });

    // Fetch the server wallet for this user (same identifier used at creation)
    const response = await fetch('https://api.thirdweb.com/v1/wallets/server', {
      method: 'GET',
      headers: { 'x-secret-key': secretKey },
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data?.message || 'Failed to fetch wallets' }, { status: response.status });
    }

    // Find the wallet whose identifier matches this user's ID
    const wallets = data?.result?.wallets || [];
    const match = wallets.find((w) =>
      w.profiles?.some((p) => p.identifier === user.id)
    );

    if (!match) {
      return Response.json({ exists: false, walletAddress: null, balances: null });
    }

    const walletAddress = match.address;
    let bnbBalance = '0', agnvBalance = '0', usdtBalance = '0';

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

    if (provider) {
      const erc20Abi = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
      const agnvContract = Deno.env.get('AGNV_CONTRACT_ADDRESS');
      const usdtContract = '0x55d398326f99059fF775485246999027B3197955';

      bnbBalance = ethers.formatEther(await provider.getBalance(walletAddress));

      if (agnvContract) {
        const agnv = new ethers.Contract(agnvContract, erc20Abi, provider);
        const [bal, dec] = await Promise.all([agnv.balanceOf(walletAddress), agnv.decimals()]);
        agnvBalance = ethers.formatUnits(bal, dec);
      }

      const usdt = new ethers.Contract(usdtContract, erc20Abi, provider);
      const [uBal, uDec] = await Promise.all([usdt.balanceOf(walletAddress), usdt.decimals()]);
      usdtBalance = ethers.formatUnits(uBal, uDec);
    }

    return Response.json({
      exists: true,
      walletAddress,
      balances: { bnb: bnbBalance, agnv: agnvBalance, usdt: usdtBalance },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});