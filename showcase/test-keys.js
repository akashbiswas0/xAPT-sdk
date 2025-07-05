const { AptosAccount } = require('aptos');

// Test the private keys from Petra wallet
function testPrivateKeys() {
  console.log('🔐 Testing Private Keys from Petra Wallet...\n');

  // Your private keys from Petra wallet (replace with your actual keys)
  const spendingWalletPrivateKey = process.env.SPENDING_WALLET_PRIVATE_KEY || '4078a5995dd03c1be12ded07f52a3605825934d95bc71930ff488c7a3755c29e';
  const savingWalletPrivateKey = process.env.SAVING_WALLET_PRIVATE_KEY || '62645f59c6ae6f285eb76bf0ebfb8b089df58402e8af78dec4d30114cdccf504';

  // Expected addresses
  const expectedSpendingAddress = '0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74';
  const expectedSavingAddress = '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17';

  try {
    // Test spending wallet private key
    console.log('📤 Testing Spending Wallet Private Key:');
    console.log(`   Private Key: ${spendingWalletPrivateKey.substring(0, 16)}...`);
    console.log(`   Length: ${spendingWalletPrivateKey.length} characters`);
    
    if (spendingWalletPrivateKey.length !== 64) {
      console.log('   ❌ ERROR: Private key must be exactly 64 hex characters');
      return;
    }

    // Create AptosAccount from private key
    const spendingAccount = new AptosAccount(Uint8Array.from(Buffer.from(spendingWalletPrivateKey, 'hex')));
    const generatedSpendingAddress = spendingAccount.address().toString();
    
    console.log(`   Generated Address: ${generatedSpendingAddress}`);
    console.log(`   Expected Address:  ${expectedSpendingAddress}`);
    console.log(`   Match: ${generatedSpendingAddress === expectedSpendingAddress ? '✅ YES' : '❌ NO'}`);

    // Test saving wallet private key
    console.log('\n📤 Testing Saving Wallet Private Key:');
    console.log(`   Private Key: ${savingWalletPrivateKey.substring(0, 16)}...`);
    console.log(`   Length: ${savingWalletPrivateKey.length} characters`);
    
    if (savingWalletPrivateKey.length !== 64) {
      console.log('   ❌ ERROR: Private key must be exactly 64 hex characters');
      return;
    }

    // Create AptosAccount from private key
    const savingAccount = new AptosAccount(Uint8Array.from(Buffer.from(savingWalletPrivateKey, 'hex')));
    const generatedSavingAddress = savingAccount.address().toString();
    
    console.log(`   Generated Address: ${generatedSavingAddress}`);
    console.log(`   Expected Address:  ${expectedSavingAddress}`);
    console.log(`   Match: ${generatedSavingAddress === expectedSavingAddress ? '✅ YES' : '❌ NO'}`);

    // Summary
    console.log('\n📊 Summary:');
    const spendingMatch = generatedSpendingAddress === expectedSpendingAddress;
    const savingMatch = generatedSavingAddress === expectedSavingAddress;
    
    if (spendingMatch && savingMatch) {
      console.log('   ✅ Both private keys are valid and match expected addresses!');
      console.log('   🚀 You can now run real blockchain transactions.');
    } else {
      console.log('   ❌ Private keys do not match expected addresses.');
      console.log('   🔧 Please check your private keys from Petra wallet.');
    }

  } catch (error) {
    console.error('❌ Error testing private keys:', error.message);
    console.log('   🔧 This usually means the private key format is incorrect.');
    console.log('   📝 Make sure you copied the exact private key from Petra wallet.');
  }
}

// Run the test
testPrivateKeys(); 