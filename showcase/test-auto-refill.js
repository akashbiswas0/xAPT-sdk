const { RealAptosWalletAdapter } = require('./dist/wallet/realAptosWalletAdapter');
const { SmartWalletAdapter } = require('./dist/wallet/smartWalletAdapter');

async function testAutoRefill() {
  console.log('🤖 Testing Automated Balance Management...');
  console.log('💰 This will check your spending wallet balance and auto-refill if needed\n');

  // Check if we're in mainnet mode
  const isMainnet = process.env.NETWORK === 'mainnet';
  const nodeUrl = isMainnet 
    ? 'https://aptos-mainnet.public.blastapi.io'
    : 'https://aptos-testnet-rpc.publicnode.com/v1/';

  // Get private keys from environment
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

    // Configure smart wallet
    const config = {
      lowBalanceThreshold: 0.005, // Trigger auto-refill when balance drops below 0.005 APT
      autoRefillAmount: 0.05,     // Transfer 0.05 APT to cover payments + fees
      maxRefillsPerDay: 10,       // Allow up to 10 refills per day
      maxDailyRefillAmount: 1.0,  // Maximum 1 APT total refills per day
      enableAutoRefill: true,     // Enable automatic refills
      enableNotifications: true   // Enable notifications
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
    console.log(`   Low Balance Threshold: ${config.lowBalanceThreshold} APT`);

    // Check if auto-refill is needed
    console.log('\n🔍 Checking if auto-refill is needed...');
    
    if (spendingBalance.balance < config.lowBalanceThreshold) {
      console.log(`⚠️  Low balance detected: ${spendingBalance.balance.toFixed(6)} APT < ${config.lowBalanceThreshold} APT`);
      console.log(`🔄 Triggering automatic refill of ${config.autoRefillAmount} APT...`);
      
      // This will trigger the auto-refill
      await smartWallet.startBalanceMonitoring(1000); // Check every 1 second for demo
      
      // Wait a bit for the transaction to complete
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Check balances again
      console.log('\n💰 Balances after auto-refill:');
      const newSpendingBalance = await smartWallet.getSpendingBalance();
      const newSavingBalance = await smartWallet.getSavingBalance();
      
      console.log(`   Spending Wallet: ${newSpendingBalance.balance.toFixed(6)} APT`);
      console.log(`   Saving Wallet: ${newSavingBalance.savingBalance.toFixed(6)} APT`);
      
      // Show auto-refill events
      const events = smartWallet.getAutoRefillEvents();
      if (events.length > 0) {
        console.log('\n📊 Auto-refill Events:');
        events.forEach(event => {
          console.log(`   ✅ ${event.timestamp.toISOString()}: ${event.amount} APT (${event.reason})`);
          if (event.transactionHash) {
            console.log(`      Transaction: ${event.transactionHash}`);
          }
        });
      }
      
    } else {
      console.log(`✅ Spending balance is healthy: ${spendingBalance.balance.toFixed(6)} APT >= ${config.lowBalanceThreshold} APT`);
      console.log('💡 To test auto-refill, reduce your spending wallet balance below 0.005 APT');
    }

    // Disconnect
    await smartWallet.disconnect();
    console.log('\n✅ Auto-refill test completed!');

  } catch (error) {
    console.error('❌ Auto-refill test failed:', error);
  }
}

// Run the test
testAutoRefill(); 