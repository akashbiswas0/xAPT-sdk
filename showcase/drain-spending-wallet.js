const { RealAptosWalletAdapter } = require('./dist/wallet/realAptosWalletAdapter');

async function drainSpendingWallet() {
  console.log('💸 Draining Spending Wallet for Auto-refill Test...');
  console.log('💰 This will transfer most APT from spending to saving wallet\n');

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
    const spendingWallet = new RealAptosWalletAdapter(spendingWalletPrivateKey, nodeUrl);
    const savingWallet = new RealAptosWalletAdapter(savingWalletPrivateKey, nodeUrl);

    // Connect wallets
    console.log('🔗 Connecting wallets...');
    await spendingWallet.connect();
    await savingWallet.connect();

    // Get balances
    const spendingBalance = await spendingWallet.getRealBalance();
    const savingBalance = await savingWallet.getRealBalance();
    
    const spendingBalanceAPT = parseFloat(spendingBalance) / Math.pow(10, 8);
    const savingBalanceAPT = parseFloat(savingBalance) / Math.pow(10, 8);
    
    console.log(`💰 Current Balances:`);
    console.log(`   Spending Wallet: ${spendingBalanceAPT.toFixed(6)} APT`);
    console.log(`   Saving Wallet: ${savingBalanceAPT.toFixed(6)} APT`);

    // Calculate transfer amount (leave 0.01 APT for fees)
    const transferAmount = Math.max(0, spendingBalanceAPT - 0.01);
    
    if (transferAmount <= 0) {
      console.log('❌ Insufficient balance to transfer (need at least 0.01 APT for fees)');
      return;
    }

    console.log(`\n💸 Transferring ${transferAmount.toFixed(6)} APT from spending to saving wallet...`);
    console.log(`   (Leaving 0.01 APT for transaction fees)`);

    // Create transfer payload
    const payload = {
      function: '0x1::coin::transfer',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [savingWallet.getAccountAddress(), Math.floor(transferAmount * Math.pow(10, 8)).toString()]
    };

    // Submit transaction
    console.log('📤 Submitting transfer transaction...');
    const transactionHash = await spendingWallet.signAndSubmitTransaction(payload);
    
    console.log(`✅ Transfer successful!`);
    console.log(`🔗 Transaction Hash: ${transactionHash}`);
    console.log(`🔗 View on explorer: https://explorer.aptoslabs.com/txn/${transactionHash}?network=mainnet`);

    // Wait a bit for transaction to confirm
    console.log('⏳ Waiting for transaction confirmation...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check new balances
    const newSpendingBalance = await spendingWallet.getRealBalance();
    const newSavingBalance = await savingWallet.getRealBalance();
    
    const newSpendingBalanceAPT = parseFloat(newSpendingBalance) / Math.pow(10, 8);
    const newSavingBalanceAPT = parseFloat(newSavingBalance) / Math.pow(10, 8);
    
    console.log(`\n💰 New Balances:`);
    console.log(`   Spending Wallet: ${newSpendingBalanceAPT.toFixed(6)} APT`);
    console.log(`   Saving Wallet: ${newSavingBalanceAPT.toFixed(6)} APT`);

    if (newSpendingBalanceAPT < 0.005) {
      console.log(`\n🎉 Perfect! Spending wallet balance is now below 0.005 APT`);
      console.log(`🤖 Auto-refill should trigger on next check!`);
    } else {
      console.log(`\n⚠️  Spending wallet still has ${newSpendingBalanceAPT.toFixed(6)} APT (above 0.005 threshold)`);
    }

    // Disconnect
    await spendingWallet.disconnect();
    await savingWallet.disconnect();
    console.log('\n✅ Drain operation completed!');

  } catch (error) {
    console.error('❌ Drain operation failed:', error);
  }
}

// Run the drain operation
drainSpendingWallet(); 