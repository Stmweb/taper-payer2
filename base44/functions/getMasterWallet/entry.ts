import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { ethers } from 'npm:ethers@6.13.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    let privateKey = Deno.env.get('BNB_WALLET_PRIVATE_KEY');
    if (privateKey && !privateKey.startsWith('0x')) privateKey = '0x' + privateKey;
    const rpcUrl = Deno.env.get('BNB_RPC_URL');
    const agnvContract = Deno.env.get('AGNV_CONTRACT_ADDRESS');
    const usdcContract = Deno.env.get('USDC_CONTRACT_ADDRESS');

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const address = wallet.address;

    // Get BNB balance
    const bnbBalance = await provider.getBalance(address);

    // ERC20 balanceOf ABI
    const erc20Abi = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];

    let agnvBalance = '0', usdcBalance = '0';

    if (agnvContract) {
      const agnv = new ethers.Contract(agnvContract, erc20Abi, provider);
      const [bal, dec] = await Promise.all([agnv.balanceOf(address), agnv.decimals()]);
      agnvBalance = ethers.formatUnits(bal, dec);
    }

    if (usdcContract) {
      const usdc = new ethers.Contract(usdcContract, erc20Abi, provider);
      const [bal, dec] = await Promise.all([usdc.balanceOf(address), usdc.decimals()]);
      usdcBalance = ethers.formatUnits(bal, dec);
    }

    return Response.json({
      address,
      bnb: ethers.formatEther(bnbBalance),
      agnv: agnvBalance,
      usdc: usdcBalance,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});