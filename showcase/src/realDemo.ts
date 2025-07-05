#!/usr/bin/env node

/**
 * xAPT Real Demo - Using Actual Aptos Testnet Wallets
 * 
 * This demo uses REAL private keys and connects to Aptos testnet
 */

import { RealDemoClient } from './client/realDemoClient';

async function main() {
  console.log('🎯 xAPT REAL Smart Wallet Demo');
  console.log('================================\n');
  
  console.log('🔑 Using REAL Aptos testnet wallets:');
  console.log('   • Spending: 0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74');
  console.log('   • Saving: 0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17');
  console.log('   • Network: Aptos Testnet');
  console.log('   • Token: USDC (Testnet)');
  console.log('');

  // Check if server URL is provided
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
  console.log(`🌐 Using server: ${serverUrl}`);
  console.log('');

  const client = new RealDemoClient(serverUrl);
  await client.runDemo();
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('xAPT Real Smart Wallet Demo');
  console.log('');
  console.log('Usage:');
  console.log('  npm run real-demo              # Run the real demo with actual wallets');
  console.log('  npm run facilitator            # Start the facilitator service');
  console.log('  npm run server                 # Start the demo server');
  console.log('');
  console.log('Environment Variables:');
  console.log('  SERVER_URL                     # Server URL (default: http://localhost:3000)');
  console.log('  FACILITATOR_PORT               # Facilitator port (default: 3001)');
  console.log('');
  console.log('🔑 Wallets Used:');
  console.log('   Spending: 0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74');
  console.log('   Saving: 0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17');
  console.log('');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Real demo failed:', error);
  process.exit(1);
}); 