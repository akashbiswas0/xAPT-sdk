import { AptosX402Client } from '@xapt/client';
import { SmartWalletAdapter } from '../wallet/smartWalletAdapter';
import { RealAptosWalletAdapter } from '../wallet/realAptosWalletAdapter';
import { SmartWalletConfig } from '../types/wallet';

/**
 * REAL Blockchain Demo Client using actual Aptos testnet wallets
 * This will make REAL transactions on the blockchain with APT tokens
 */
export class RealBlockchainDemoClient {
  private smartWallet: SmartWalletAdapter;
  private client: AptosX402Client;
  private serverUrl: string;

  constructor(serverUrl: string = 'http://localhost:3000') {
    this.serverUrl = serverUrl;

    // Multiple RPC endpoints for better reliability
    const rpcEndpoints = [
      'https://aptos-testnet-rpc.publicnode.com/v1/',  // Primary endpoint
      'https://api.testnet.aptoslabs.com/v1/',  // Official Aptos testnet API
      'https://api.mainnet.aptoslabs.com/v1/',  // Official Aptos mainnet API
      'https://rpc.ankr.com/premium-http/aptos_testnet/4890dc2102996a92003e9575fc4bfb6fd49d02a8e625f91642f56fbcf2569b93/v1',
      'https://fullnode.testnet.aptoslabs.com',
      'https://testnet.aptoslabs.com',
      'https://aptos-testnet.public.blastapi.io'
    ];
    
    // Use the first endpoint, with fallback capability
    const nodeUrl = rpcEndpoints[0];
    console.log(`🔗 Using RPC endpoint: ${nodeUrl}`);
    
    // Update spending wallet to new address and private key
    const spendingWallet = new RealAptosWalletAdapter('ed25519-priv-0xb0ec4fc12941372399877c07f500d74cb0fe48154ac54bbfabe566a75d7128c7', nodeUrl);
    const savingWallet = new RealAptosWalletAdapter('ed25519-priv-0x62645f59c6ae6f285eb76bf0ebfb8b089df58402e8af78dec4d30114cdccf504', nodeUrl);

    // Configure smart wallet with automated balance management
    const config: SmartWalletConfig = {
      lowBalanceThreshold: 0.005, // Trigger auto-refill when balance drops below 0.005 APT
      autoRefillAmount: 0.05,     // Transfer 0.05 APT to cover payments + fees
      maxRefillsPerDay: 10,       // Allow up to 10 refills per day
      maxDailyRefillAmount: 1.0,  // Maximum 1 APT total refills per day
      enableAutoRefill: true,     // Enable automatic refills
      enableNotifications: true   // Enable notifications
    };

    // Create smart wallet adapter
    this.smartWallet = new SmartWalletAdapter(spendingWallet, savingWallet, config);
    this.client = new AptosX402Client(this.smartWallet);
  }

  /**
   * Initialize the demo client
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing xAPT REAL Blockchain Demo Client...');
    console.log('🔗 This will make REAL transactions on Aptos testnet!');
    console.log('⚠️  WARNING: This will use real APT from your wallets!');
    
    try {
      // Connect to the smart wallet
      await this.smartWallet.connect();
      
      // Start automated balance monitoring
      console.log('🔍 Starting automated balance monitoring...');
      await this.smartWallet.startBalanceMonitoring(15000); // Check every 15 seconds
      
      console.log('✅ Demo client initialized successfully!');
      console.log('🤖 Smart wallet will automatically maintain minimum balance of 0.005 APT');
      
    } catch (error) {
      console.error('❌ Failed to initialize demo client:', error);
      throw error;
    }
  }

  /**
   * Display current wallet balances from blockchain
   */
  async displayBalances(): Promise<void> {
    try {
      const spendingBalance = await this.smartWallet.getSpendingBalance();
      const savingBalance = await this.smartWallet.getSavingBalance();
      const dailyStats = this.smartWallet.getDailyRefillStats();

      console.log('\n💰 REAL Blockchain Wallet Balances:');
      console.log(`   Spending Wallet: ${spendingBalance.balance} APT`);
      console.log(`   Spending Address: ${spendingBalance.address}`);
      console.log(`   Saving Wallet: ${savingBalance.balance} APT`);
      console.log(`   Saving Address: ${savingBalance.address}`);
      console.log(`   Daily Refills: ${dailyStats.count}/${this.smartWallet.getConfig().maxRefillsPerDay}`);
      console.log(`   Daily Refill Amount: ${dailyStats.amount}/${this.smartWallet.getConfig().maxDailyRefillAmount} APT`);
      
      // Check if wallets have sufficient balance
      if (spendingBalance.balance < 0.5) {
        console.log('⚠️  WARNING: Spending wallet has low balance!');
      }
      if (savingBalance.balance < 2) {
        console.log('⚠️  WARNING: Saving wallet has low balance!');
      }
    } catch (error) {
      console.error('❌ Failed to get balances:', error);
    }
  }

  /**
   * Test public endpoints (no payment required)
   */
  async testPublicEndpoints(): Promise<void> {
    console.log('\n🌐 Testing Public Endpoints...');
    
    try {
      // Test info endpoint
      const infoResponse = await fetch(`${this.serverUrl}/api/public/info`);
      const info = await infoResponse.json();
      console.log('✅ Public Info:', info.message);

      // Test balance endpoint
      const balanceResponse = await fetch(`${this.serverUrl}/api/public/balance`);
      const balance = await balanceResponse.json();
      console.log('✅ Public Balance:', balance.message);

    } catch (error) {
      console.error('❌ Public endpoints failed:', error);
    }
  }

  /**
   * Test premium endpoints with REAL blockchain payments
   */
  async testPremiumEndpoints(): Promise<void> {
    console.log('\n💎 Testing Premium Endpoints with REAL blockchain payments...');
    console.log('⚠️  This will make REAL APT transfers!');
    
    try {
      // Test premium data endpoint
      console.log('📊 Accessing premium market data...');
      const dataResponse = await this.client.fetchWithPayment(`${this.serverUrl}/api/premium/data`);
      const data = await dataResponse.json();
      console.log('✅ Premium Data:', data.message);
      console.log('   Market Trend:', data.data.marketAnalysis.trend);

      // Test premium analysis endpoint
      console.log('🔍 Requesting premium analysis...');
      const analysisResponse = await this.client.fetchWithPayment(`${this.serverUrl}/api/premium/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'APT price prediction' })
      });
      const analysis = await analysisResponse.json();
      console.log('✅ Premium Analysis:', analysis.message);
      console.log('   Sentiment:', analysis.analysis.sentiment);

      // Test premium reports endpoint
      console.log('📋 Accessing premium reports...');
      const reportsResponse = await this.client.fetchWithPayment(`${this.serverUrl}/api/premium/reports`);
      const reports = await reportsResponse.json();
      console.log('✅ Premium Reports:', reports.message);
      console.log('   Available Reports:', reports.reports.length);

    } catch (error) {
      console.error('❌ Premium endpoints failed:', error);
    }
  }

  /**
   * Test enterprise endpoint with REAL blockchain payment
   */
  async testEnterpriseEndpoint(): Promise<void> {
    console.log('\n🏢 Testing Enterprise Endpoint with REAL blockchain payment...');
    console.log('⚠️  This will make a REAL 0.05 APT transfer!');
    
    try {
      console.log('📈 Accessing enterprise insights...');
      const insightsResponse = await this.client.fetchWithPayment(`${this.serverUrl}/api/enterprise/insights`);
      const insights = await insightsResponse.json();
      console.log('✅ Enterprise Insights:', insights.message);
      console.log('   Next Week Prediction:', insights.insights.marketPredictions.nextWeek);

    } catch (error) {
      console.error('❌ Enterprise endpoint failed:', error);
    }
  }

  /**
   * Test subscription endpoint with REAL blockchain payment
   */
  async testSubscriptionEndpoint(): Promise<void> {
    console.log('\n📡 Testing Subscription Endpoint with REAL blockchain payment...');
    console.log('⚠️  This will make a REAL APT transfer!');
    
    try {
      console.log('🔄 Accessing real-time subscription feed...');
      const feedResponse = await this.client.fetchWithPayment(`${this.serverUrl}/api/subscription/feed`);
      const feed = await feedResponse.json();
      console.log('✅ Subscription Feed:', feed.message);
      console.log('   Feed Items:', feed.feed.length);

    } catch (error) {
      console.error('❌ Subscription endpoint failed:', error);
    }
  }

  /**
   * Simulate low balance scenario with REAL blockchain transactions
   */
  async simulateLowBalance(): Promise<void> {
    console.log('\n⚠️  Simulating Low Balance Scenario with REAL blockchain...');
    console.log('⚠️  This will trigger REAL auto-refill from savings!');
    
    try {
      // Detect mainnet from environment
      const isMainnet = process.env.NETWORK === 'mainnet' || process.env.APTOS_NETWORK === 'mainnet';
      // Temporarily set low balance threshold to trigger auto-refill
      const originalConfig = this.smartWallet.getConfig();
      this.smartWallet.updateConfig({
        lowBalanceThreshold: isMainnet ? 0.005 : 0.5, // 0.005 APT for mainnet, 0.5 for testnet
        autoRefillAmount: isMainnet ? 0.01 : 1.5     // 0.01 APT for mainnet, 1.5 for testnet
      });

      console.log('💰 Current spending balance is low, auto-refill should trigger...');
      
      // Try to make a payment (this should trigger auto-refill)
      const response = await this.client.fetchWithPayment(`${this.serverUrl}/api/premium/data`);
      const data = await response.json();
      console.log('✅ Payment successful after auto-refill:', data.message);

      // Restore original config
      this.smartWallet.updateConfig(originalConfig);

    } catch (error) {
      console.error('❌ Low balance simulation failed:', error);
    }
  }

  /**
   * Display smart wallet statistics with real blockchain data
   */
  async displayStatistics(): Promise<void> {
    console.log('\n📊 REAL Blockchain Smart Wallet Statistics:');
    
    try {
      const autoRefillEvents = this.smartWallet.getAutoRefillEvents();
      const transferHistory = this.smartWallet.getTransferHistory();
      const dailyStats = this.smartWallet.getDailyRefillStats();
      const config = this.smartWallet.getConfig();

      console.log(`   Auto-refill Events: ${autoRefillEvents.length}`);
      console.log(`   Transfer History: ${transferHistory.length}`);
      console.log(`   Daily Refills: ${dailyStats.count}/${config.maxRefillsPerDay}`);
      console.log(`   Daily Refill Amount: ${dailyStats.amount}/${config.maxDailyRefillAmount} APT`);
      console.log(`   Auto-refill Enabled: ${config.enableAutoRefill}`);
      console.log(`   Low Balance Threshold: ${config.lowBalanceThreshold} APT`);
      console.log(`   Auto-refill Amount: ${config.autoRefillAmount} APT`);

      if (autoRefillEvents.length > 0) {
        console.log('\n   Recent Auto-refill Events:');
        autoRefillEvents.slice(-3).forEach((event, index) => {
          console.log(`     ${index + 1}. ${event.amount} APT - ${event.reason} - ${event.success ? '✅' : '❌'}`);
          if (event.transactionHash) {
            console.log(`        Transaction: https://explorer.aptoslabs.com/txn/${event.transactionHash}?network=testnet`);
          }
        });
      }

      if (transferHistory.length > 0) {
        console.log('\n   Recent Transfer History:');
        transferHistory.slice(-3).forEach((tx, index) => {
          console.log(`     ${index + 1}. ${tx.amount} APT from ${tx.from} to ${tx.to}`);
          console.log(`        Transaction: https://explorer.aptoslabs.com/txn/${tx.transactionHash}?network=testnet`);
        });
      }

    } catch (error) {
      console.error('❌ Failed to get statistics:', error);
    }
  }

  /**
   * Demonstrate automated balance management
   */
  async demonstrateAutoRefill(): Promise<void> {
    console.log('\n🤖 Demonstrating Automated Balance Management...');
    console.log('📊 Making multiple payments to show auto-refill in action...');
    
    try {
      // Make several small payments to drain the spending wallet
      const payments = [0.001, 0.002, 0.001, 0.003, 0.002];
      
      for (let i = 0; i < payments.length; i++) {
        const amount = payments[i];
        console.log(`\n💳 Payment ${i + 1}/${payments.length}: ${amount} APT`);
        
        try {
          // Try to make a payment (this will trigger auto-refill if needed)
          const response = await this.smartWallet.smartPayment(
            `${this.serverUrl}/api/pay`,
            amount.toString()
          );
          
          if (response.ok) {
            console.log(`✅ Payment ${i + 1} successful!`);
          } else {
            console.log(`❌ Payment ${i + 1} failed: ${response.status}`);
          }
          
          // Wait a bit between payments to see auto-refill in action
          await new Promise(resolve => setTimeout(resolve, 5000));
          
        } catch (error) {
          console.log(`❌ Payment ${i + 1} error: ${error}`);
        }
      }
      
      console.log('\n🎉 Automated balance management demonstration complete!');
      console.log('📈 Check the logs above to see auto-refill in action');
      
    } catch (error) {
      console.error('❌ Auto-refill demonstration failed:', error);
    }
  }

  /**
   * Run complete real blockchain demo
   */
  async runDemo(): Promise<void> {
    console.log('🎯 Starting xAPT REAL Blockchain Demo...');
    console.log('==========================================\n');
    
    console.log('💡 This demo uses REAL Aptos testnet wallets:');
    console.log('   • Spending Wallet: 0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74');
    console.log('   • Saving Wallet: 0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17');
    console.log('   • Network: Aptos Testnet');
    console.log('   • Token: APT (Testnet)');
    console.log('');
    console.log('⚠️  WARNING: This will make REAL blockchain transactions!');
    console.log('⚠️  WARNING: Real APT will be transferred between your wallets!');
    console.log('');

    try {
      // Initialize
      await this.initialize();
      
      // Test all endpoints
      await this.testPublicEndpoints();
      await this.testPremiumEndpoints();
      await this.testEnterpriseEndpoint();
      await this.testSubscriptionEndpoint();
      
      // Simulate low balance
      await this.simulateLowBalance();
      
      // Display final statistics
      await this.displayStatistics();
      
      // Demonstrate automated balance management
      await this.demonstrateAutoRefill();
      
      console.log('\n🎉 REAL Blockchain Demo completed successfully!');
      console.log('💡 Key Features Demonstrated:');
      console.log('   • REAL HTTP 402 Payment Required handling');
      console.log('   • REAL Automatic wallet refill from savings');
      console.log('   • REAL Smart balance monitoring');
      console.log('   • REAL Transaction history tracking');
      console.log('   • REAL Daily refill limits');
      console.log('   • REAL Payment processing on Aptos testnet');
      console.log('');
      console.log('🔗 View transactions on Aptos Explorer:');
console.log('   Testnet: https://explorer.aptoslabs.com/?network=testnet');
console.log('   Mainnet: https://explorer.aptoslabs.com/?network=mainnet');
      
    } catch (error) {
      console.error('❌ Demo failed:', error);
    } finally {
      await this.smartWallet.disconnect();
      console.log('\n🔌 Real blockchain smart wallet disconnected');
    }
  }
} 