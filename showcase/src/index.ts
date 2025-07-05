#!/usr/bin/env node

/**
 * xAPT Showcase - Smart Wallet Demo
 * 
 * Demonstrates saving and spending wallet functionality with automatic refill
 */

import { DemoClient } from './client/demoClient';

async function main() {
  console.log('🎯 xAPT Smart Wallet Showcase');
  console.log('================================\n');
  
  console.log('💡 This showcase demonstrates:');
  console.log('   • Smart wallet with automatic refill from savings');
  console.log('   • HTTP 402 Payment Required handling');
  console.log('   • Real-time balance monitoring');
  console.log('   • Transaction history tracking');
  console.log('   • Daily refill limits and controls');
  console.log('   • Multiple payment tiers and use cases');
  console.log('');

  // Check if server URL is provided
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
  console.log(`🌐 Using server: ${serverUrl}`);
  console.log('');

  const client = new DemoClient(serverUrl);
  await client.runDemo();
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('xAPT Smart Wallet Showcase');
  console.log('');
  console.log('Usage:');
  console.log('  npm start                    # Run the demo');
  console.log('  npm run server              # Start the demo server');
  console.log('  npm run client              # Run the demo client');
  console.log('');
  console.log('Environment Variables:');
  console.log('  SERVER_URL                  # Server URL (default: http://localhost:3000)');
  console.log('');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Showcase failed:', error);
  process.exit(1);
}); 