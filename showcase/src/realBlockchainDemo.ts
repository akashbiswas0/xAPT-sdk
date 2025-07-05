import { RealBlockchainDemoClient } from './client/realBlockchainDemoClient';

/**
 * REAL Blockchain Demo - This will make ACTUAL transactions on Aptos testnet
 * 
 * WARNING: This demo uses real private keys and will make real USDC transfers
 * between your wallets on Aptos testnet. Make sure you understand the implications.
 */
async function runRealBlockchainDemo() {
  console.log('🚀 Starting xAPT REAL Blockchain Demo...');
  console.log('==========================================\n');
  
  console.log('💡 This demo will make REAL transactions on Aptos testnet:');
  console.log('   • Spending Wallet: 0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74');
  console.log('   • Saving Wallet: 0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17');
  console.log('   • Network: Aptos Testnet');
  console.log('   • Token: USDC (Testnet)');
  console.log('');
  console.log('⚠️  WARNING: This will make REAL blockchain transactions!');
  console.log('⚠️  WARNING: Real USDC will be transferred between your wallets!');
  console.log('⚠️  WARNING: Make sure you have sufficient USDC in your wallets!');
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