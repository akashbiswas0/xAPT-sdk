#!/usr/bin/env node

/**
 * xAPT Mock Blockchain Demo
 * 
 * Demonstrates the showcase functionality using mock wallets when blockchain nodes are not synced
 */

import { MockBlockchainDemoClient } from './client/mockBlockchainDemoClient';

async function runMockBlockchainDemo() {
  console.log('🎯 Starting xAPT MOCK Blockchain Demo...');
  console.log('==========================================\n');
  
  console.log('💡 This demo simulates REAL transactions on Aptos testnet:');
  console.log('   • Spending Wallet: 0x54aac012a65ed3aae7c829877ac604a9f579aebee87818e4eb5d8e6220fdb93d');
  console.log('   • Saving Wallet: 0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17');
  console.log('   • Network: Aptos Testnet (MOCK)');
  console.log('   • Token: APT (Testnet) - MOCK BALANCES');
  
  console.log('\n⚠️  WARNING: This uses MOCK wallets with simulated balances!');
  console.log('⚠️  No real blockchain transactions will be made!');
  console.log('⚠️  This is for testing when nodes are not synced!');
  
  console.log('\nPress Ctrl+C to cancel at any time...');
  
  // Wait a moment for user to read
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('\n🎯 Starting xAPT MOCK Blockchain Demo...');
  console.log('==========================================\n');
  
  console.log('💡 This demo uses MOCK Aptos testnet wallets:');
  console.log('   • Spending Wallet: 0x54aac012a65ed3aae7c829877ac604a9f579aebee87818e4eb5d8e6220fdb93d');
  console.log('   • Saving Wallet: 0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17');
  console.log('   • Network: Aptos Testnet (MOCK)');
  console.log('   • Token: APT (Testnet) - MOCK BALANCES');
  
  console.log('\n⚠️  WARNING: This uses MOCK wallets with simulated balances!');
  console.log('⚠️  No real blockchain transactions will be made!');
  
  // Wait a moment for user to read
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const client = new MockBlockchainDemoClient();
  await client.runDemo();
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('xAPT Mock Blockchain Demo');
  console.log('');
  console.log('Usage:');
  console.log('  npm run mock-blockchain-demo     # Run the mock demo');
  console.log('  npm run full-mock-blockchain-demo # Run with server and facilitator');
  console.log('');
  console.log('This demo simulates real blockchain transactions using mock wallets.');
  console.log('Useful when Aptos testnet nodes are not synced.');
  console.log('');
  process.exit(0);
}

runMockBlockchainDemo().catch((error) => {
  console.error('❌ Mock blockchain demo failed:', error);
  process.exit(1);
}); 