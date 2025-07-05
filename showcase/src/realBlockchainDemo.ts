import { RealBlockchainDemoClient } from './client/realBlockchainDemoClient';

/**
 * REAL Blockchain Demo - This will make ACTUAL transactions on Aptos testnet/mainnet
 * 
 * WARNING: This demo uses real private keys and will make real APT transfers
 * between your wallets. Make sure you understand the implications.
 */
async function runRealBlockchainDemo() {
  // Detect network from environment
  const isMainnet = process.env.NETWORK === 'mainnet' || process.env.APTOS_NETWORK === 'mainnet';
  const network = isMainnet ? 'Mainnet' : 'Testnet';
  const token = isMainnet ? 'APT (Mainnet)' : 'APT (Testnet)';
  
  // Use appropriate wallet addresses based on network
  const spendingWallet = isMainnet 
    ? '0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74'  // Mainnet spending wallet
    : '0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74'; // Testnet spending wallet
  
  const savingWallet = '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17';

  console.log('🚀 Starting xAPT REAL Blockchain Demo...');
  console.log('==========================================\n');
  
  console.log(`💡 This demo will make REAL transactions on Aptos ${network.toLowerCase()}:`);
  console.log(`   • Spending Wallet: ${spendingWallet}`);
  console.log(`   • Saving Wallet: ${savingWallet}`);
  console.log(`   • Network: Aptos ${network}`);
  console.log(`   • Token: ${token}`);
  console.log('');
  console.log('⚠️  WARNING: This will make REAL blockchain transactions!');
  console.log('⚠️  WARNING: Real APT will be transferred between your wallets!');
  console.log('⚠️  WARNING: Make sure you have sufficient APT in your wallets!');
  console.log('');

  // Show payment amounts based on network
  if (isMainnet) {
    console.log('💰 Mainnet Payment Amounts:');
    console.log('   • Premium endpoints: 0.002 APT');
    console.log('   • Enterprise endpoint: 0.01 APT');
    console.log('   • Auto-refill threshold: 0.005 APT');
    console.log('   • Auto-refill amount: 0.01 APT');
  } else {
    console.log('💰 Testnet Payment Amounts:');
    console.log('   • Premium endpoints: 0.1 APT');
    console.log('   • Enterprise endpoint: 0.5 APT');
    console.log('   • Auto-refill threshold: 0.5 APT');
    console.log('   • Auto-refill amount: 1.5 APT');
  }
  
  console.log('');
  console.log('Press Ctrl+C to cancel at any time...');
  console.log('');

  // Wait 5 seconds to give user time to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    const demoClient = new RealBlockchainDemoClient('http://localhost:3000');
    await demoClient.runDemo();
  } catch (error) {
    console.error('❌ Real blockchain demo failed:', error);
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runRealBlockchainDemo().catch(console.error);
}

export { runRealBlockchainDemo }; 