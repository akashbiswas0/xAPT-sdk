#!/usr/bin/env node

/**
 * Simple test script for the xAPT Showcase
 */

const { DemoClient } = require('./dist/client/demoClient');

async function testShowcase() {
  console.log('🧪 Testing xAPT Showcase...\n');
  
  try {
    const client = new DemoClient('http://localhost:3000');
    
    // Test initialization
    console.log('1. Testing initialization...');
    await client.initialize();
    console.log('✅ Initialization successful\n');
    
    // Test public endpoints
    console.log('2. Testing public endpoints...');
    await client.testPublicEndpoints();
    console.log('✅ Public endpoints successful\n');
    
    // Test smart wallet features
    console.log('3. Testing smart wallet features...');
    await client.displayBalances();
    await client.displayStatistics();
    console.log('✅ Smart wallet features successful\n');
    
    console.log('🎉 All tests passed!');
    console.log('\n💡 To run the full demo with payment endpoints:');
    console.log('   1. Start the server: npm run server');
    console.log('   2. Run the client: npm run client');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testShowcase(); 