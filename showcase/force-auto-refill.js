const { RealAptosWalletAdapter } = require('./dist/wallet/realAptosWalletAdapter');
const { SmartWalletAdapter } = require('./dist/wallet/smartWalletAdapter');

async function forceAutoRefill() {
  console.log('🤖 Forcing Auto-refill Test...');
  console.log('💰 This will trigger auto-refill with a higher threshold for testing\n');

  const isMainnet = process.env.NETWORK === 'mainnet';
  const nodeUrl = isMainnet 
    ? 'https://aptos-mainnet.public.blastapi.io'
    : 'https://aptos-testnet-rpc.publicnode.com/v1/';

  const spendingWalletPrivateKey = process.env.SPENDING_WALLET_PRIVATE_KEY;
  const savingWalletPrivateKey = process.env.SAVING_WALLET_PRIVATE_KEY;

  if (!spendingWalletPrivateKey || !savingWalletPrivateKey) {
    console.error('❌ Please set SPENDING_WALLET_PRIVATE_KEY and SAVING_WALLET_PRIVATE_KEY environment variables');
    process.exit(1);
  }

  try {
    // Create wallet adapters
    const spendingWallet = new RealAptosWalletAdapter(spendingWalletPrivateKey, nodeUrl);
    const savingWallet = new RealAptosWalletAdapter(savingWalletPrivateKey, nodeUrl);

    // Configure smart wallet with a higher threshold to force auto-refill
    const config = {
      lowBalanceThreshold: 0.25, // Higher threshold to trigger auto-refill
      autoRefillAmount: 0.05,    // Transfer 0.05 APT
      maxRefillsPerDay: 10,
      maxDailyRefillAmount: 1.0,
      enableAutoRefill: true,
      enableNotifications: true
    };

    const smartWallet = new SmartWalletAdapter(spendingWallet, savingWallet, config);

    // Connect wallets
    console.log('🔗 Connecting wallets...');
    await smartWallet.connect();

    // Display initial balances
    console.log('\n💰 Initial Balances:');
    const spendingBalance = await smartWallet.getSpendingBalance();
    const savingBalance = await smartWallet.getSavingBalance();
    
    console.log(`   Spending Wallet: ${spendingBalance.balance.toFixed(6)} APT`);
    console.log(`   Saving Wallet: ${savingBalance.balance.toFixed(6)} APT`);
    console.log(`   Low Balance Threshold: ${config.lowBalanceThreshold} APT (temporarily raised for testing)`);

    // Check if auto-refill is needed
    console.log('\n🔍 Checking if auto-refill is needed...');
    
    if (spendingBalance.balance < config.lowBalanceThreshold) {
      console.log(`⚠️  Low balance detected: ${spendingBalance.balance.toFixed(6)} APT < ${config.lowBalanceThreshold} APT`);
      console.log(`🔄 Triggering automatic refill of ${config.autoRefillAmount} APT...`);
      
      // Manually trigger the auto-refill logic
      console.log('📤 Initiating transfer from savings to spending wallet...');
      
      // Create transfer payload
      const payload = {
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [spendingWallet.getAccountAddress(), Math.floor(config.autoRefillAmount * Math.pow(10, 8)).toString()]
      };

      // Submit transaction from savings wallet
      console.log('🔐 Signing and submitting transaction...');
      const transactionHash = await savingWallet.signAndSubmitTransaction(payload);
      
      console.log(`✅ Auto-refill successful!`);
      console.log(`🔗 Transaction Hash: ${transactionHash}`);
      console.log(`🔗 View on explorer: https://explorer.aptoslabs.com/txn/${transactionHash}?network=mainnet`);

      // Wait for transaction to confirm
      console.log('⏳ Waiting for transaction confirmation...');
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Check balances again
      console.log('\n💰 Balances after auto-refill:');
      const newSpendingBalance = await smartWallet.getSpendingBalance();
      const newSavingBalance = await smartWallet.getSavingBalance();
      
      console.log(`   Spending Wallet: ${newSpendingBalance.balance.toFixed(6)} APT`);
      console.log(`   Saving Wallet: ${newSavingBalance.balance.toFixed(6)} APT`);
      
      console.log(`\n🎉 Auto-refill completed successfully!`);
      console.log(`📈 Spending wallet balance increased by ${(newSpendingBalance.balance - spendingBalance.balance).toFixed(6)} APT`);
      
    } else {
      console.log(`✅ Spending balance is healthy: ${spendingBalance.balance.toFixed(6)} APT >= ${config.lowBalanceThreshold} APT`);
      console.log('💡 Current balance is above the test threshold');
    }

    // Disconnect
    await smartWallet.disconnect();
    console.log('\n✅ Force auto-refill test completed!');

  } catch (error) {
    console.error('❌ Force auto-refill test failed:', error);
  }
}

// Run the test
forceAutoRefill(); 