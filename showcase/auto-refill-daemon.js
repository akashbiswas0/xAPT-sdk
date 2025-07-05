const { RealAptosWalletAdapter } = require('./dist/wallet/realAptosWalletAdapter');
const { SmartWalletAdapter } = require('./dist/wallet/smartWalletAdapter');

class AutoRefillDaemon {
  constructor() {
    this.isRunning = false;
    this.monitoringInterval = null;
    this.lastRefillTime = null;
    this.dailyRefillCount = 0;
    this.dailyRefillAmount = 0;
    this.lastResetDate = new Date().toDateString();
  }

  async start() {
    console.log('🤖 Starting Auto-Refill Daemon...');
    console.log('💰 This will continuously monitor your spending wallet balance');
    console.log('🔄 Auto-refill will trigger when balance drops below 0.005 APT\n');

    // Check environment variables
    const spendingWalletPrivateKey = process.env.SPENDING_WALLET_PRIVATE_KEY;
    const savingWalletPrivateKey = process.env.SAVING_WALLET_PRIVATE_KEY;

    if (!spendingWalletPrivateKey || !savingWalletPrivateKey) {
      console.error('❌ Please set SPENDING_WALLET_PRIVATE_KEY and SAVING_WALLET_PRIVATE_KEY environment variables');
      process.exit(1);
    }

    // Check network mode
    const isMainnet = process.env.NETWORK === 'mainnet';
    const nodeUrl = isMainnet 
      ? 'https://aptos-mainnet.public.blastapi.io'
      : 'https://aptos-testnet-rpc.publicnode.com/v1/';

    console.log(`🌐 Network: ${isMainnet ? 'Mainnet' : 'Testnet'}`);
    console.log(`🔗 RPC Endpoint: ${nodeUrl}`);

    try {
      // Create wallet adapters
      const spendingWallet = new RealAptosWalletAdapter(spendingWalletPrivateKey, nodeUrl);
      const savingWallet = new RealAptosWalletAdapter(savingWalletPrivateKey, nodeUrl);

      // Configure smart wallet for production
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
      await this.displayBalances(smartWallet);

      // Start continuous monitoring
      this.isRunning = true;
      console.log('\n🔍 Starting continuous balance monitoring...');
      console.log('⏰ Checking balance every 30 seconds...');
      console.log('💡 Press Ctrl+C to stop the daemon\n');

      // Set up monitoring interval (check every 30 seconds)
      this.monitoringInterval = setInterval(async () => {
        try {
          await this.checkAndRefill(smartWallet);
        } catch (error) {
          console.error('❌ Error during balance check:', error);
        }
      }, 30000); // 30 seconds

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down Auto-Refill Daemon...');
        await this.stop(smartWallet);
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        console.log('\n🛑 Shutting down Auto-Refill Daemon...');
        await this.stop(smartWallet);
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ Failed to start Auto-Refill Daemon:', error);
      process.exit(1);
    }
  }

  async checkAndRefill(smartWallet) {
    try {
      // Reset daily counters if it's a new day
      this.resetDailyCounters();

      // Get current balances
      const spendingBalance = await smartWallet.getSpendingBalance();
      const savingBalance = await smartWallet.getSavingBalance();

      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] 💰 Spending: ${spendingBalance.balance.toFixed(6)} APT | Saving: ${savingBalance.balance.toFixed(6)} APT`);

      // Check if refill is needed
      if (spendingBalance.balance < 0.005) {
        console.log(`[${timestamp}] ⚠️  Low balance detected: ${spendingBalance.balance.toFixed(6)} APT < 0.005 APT`);

        // Check daily limits
        if (this.dailyRefillCount >= 10) {
          console.log(`[${timestamp}] ❌ Daily refill limit reached (10/10)`);
          return;
        }

        if (this.dailyRefillAmount >= 1.0) {
          console.log(`[${timestamp}] ❌ Daily refill amount limit reached (${this.dailyRefillAmount.toFixed(3)}/1.0 APT)`);
          return;
        }

        // Check if savings wallet has enough funds
        if (savingBalance.balance < 0.05) {
          console.log(`[${timestamp}] ❌ Insufficient funds in savings wallet: ${savingBalance.balance.toFixed(6)} APT < 0.05 APT`);
          return;
        }

        // Perform auto-refill
        console.log(`[${timestamp}] 🔄 Initiating auto-refill of 0.05 APT...`);
        
        try {
          // Create transfer payload
          const payload = {
            function: '0x1::coin::transfer',
            type_arguments: ['0x1::aptos_coin::AptosCoin'],
            arguments: [smartWallet.getAccountAddress(), '5000000'] // 0.05 APT in raw units
          };

          // Submit transaction from savings wallet
          const transactionHash = await smartWallet.savingWallet.signAndSubmitTransaction(payload);
          
          // Update counters
          this.dailyRefillCount++;
          this.dailyRefillAmount += 0.05;
          this.lastRefillTime = new Date();

          console.log(`[${timestamp}] ✅ Auto-refill successful!`);
          console.log(`[${timestamp}] 🔗 Transaction: ${transactionHash}`);
          console.log(`[${timestamp}] 📊 Daily stats: ${this.dailyRefillCount}/10 refills, ${this.dailyRefillAmount.toFixed(3)}/1.0 APT`);

          // Wait a bit for transaction to confirm
          await new Promise(resolve => setTimeout(resolve, 5000));

          // Display updated balances
          await this.displayBalances(smartWallet);

        } catch (error) {
          console.error(`[${timestamp}] ❌ Auto-refill failed:`, error.message);
        }

      } else {
        console.log(`[${timestamp}] ✅ Balance healthy: ${spendingBalance.balance.toFixed(6)} APT >= 0.005 APT`);
      }

    } catch (error) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error during balance check:`, error.message);
    }
  }

  async displayBalances(smartWallet) {
    try {
      const spendingBalance = await smartWallet.getSpendingBalance();
      const savingBalance = await smartWallet.getSavingBalance();
      
      console.log('\n💰 Current Balances:');
      console.log(`   Spending Wallet: ${spendingBalance.balance.toFixed(6)} APT`);
      console.log(`   Saving Wallet: ${savingBalance.balance.toFixed(6)} APT`);
      console.log(`   Low Balance Threshold: 0.005 APT`);
      console.log(`   Auto-refill Amount: 0.05 APT`);
      console.log(`   Daily Refills: ${this.dailyRefillCount}/10`);
      console.log(`   Daily Amount: ${this.dailyRefillAmount.toFixed(3)}/1.0 APT`);
      if (this.lastRefillTime) {
        console.log(`   Last Refill: ${this.lastRefillTime.toLocaleString()}`);
      }
      console.log('');
    } catch (error) {
      console.error('❌ Error displaying balances:', error.message);
    }
  }

  resetDailyCounters() {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyRefillCount = 0;
      this.dailyRefillAmount = 0;
      this.lastResetDate = today;
      console.log(`[${new Date().toLocaleTimeString()}] 📅 New day - Daily counters reset`);
    }
  }

  async stop(smartWallet) {
    this.isRunning = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    if (smartWallet) {
      await smartWallet.disconnect();
    }
    
    console.log('✅ Auto-Refill Daemon stopped');
  }
}

// Start the daemon
const daemon = new AutoRefillDaemon();
daemon.start().catch(error => {
  console.error('❌ Failed to start daemon:', error);
  process.exit(1);
}); 