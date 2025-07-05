import { AptosX402Client } from '@xapt/client';
import { SmartWalletAdapter } from '../wallet/smartWalletAdapter';
import { RealWalletAdapter } from '../wallet/realWalletAdapter';
import { SmartWalletConfig } from '../types/wallet';

/**
 * Real Demo Client using actual Aptos testnet wallets
 */
export class RealDemoClient {
  private smartWallet: SmartWalletAdapter;
  private client: AptosX402Client;
  private serverUrl: string;

  constructor(serverUrl: string = 'http://localhost:3000') {
    this.serverUrl = serverUrl;

    // Create real wallet adapters with your private keys
    const spendingWallet = new RealWalletAdapter('ed25519-priv-0x4078a5995dd03c1be12ded07f52a3605825934d95bc71930ff488c7a3755c29e');
    const savingWallet = new RealWalletAdapter('ed25519-priv-0x62645f59c6ae6f285eb76bf0ebfb8b089df58402e8af78dec4d30114cdccf504');

    // Configure smart wallet
    const config: SmartWalletConfig = {
      lowBalanceThreshold: 2.0, // $2 USDC
      autoRefillAmount: 10.0,   // $10 USDC
      maxRefillsPerDay: 5,
      maxDailyRefillAmount: 50.0, // $50 USDC
      enableAutoRefill: true,
      enableNotifications: true
    };

    // Create smart wallet adapter
    this.smartWallet = new SmartWalletAdapter(spendingWallet, savingWallet, config);
    this.client = new AptosX402Client(this.smartWallet);
  }

  /**
   * Initialize the real demo client
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing xAPT Real Demo Client...');
    console.log('🔑 Using REAL Aptos testnet wallets!');
    
    try {
      await this.smartWallet.connect();
      console.log('✅ Real smart wallet connected successfully');
      
      // Display real balances
      await this.displayBalances();
      
    } catch (error) {
      console.error('❌ Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Display current wallet balances
   */
  async displayBalances(): Promise<void> {
    try {
      const spendingBalance = await this.smartWallet.getSpendingBalance();
      const savingBalance = await this.smartWallet.getSavingBalance();
      const dailyStats = this.smartWallet.getDailyRefillStats();

      console.log('\n💰 REAL Wallet Balances:');
      console.log(`   Spending Wallet: ${spendingBalance.balance} USDC`);
      console.log(`   Spending Address: ${spendingBalance.address}`);
      console.log(`   Saving Wallet: ${savingBalance.balance} USDC`);
      console.log(`   Saving Address: ${savingBalance.address}`);
      console.log(`   Daily Refills: ${dailyStats.count}/${this.smartWallet.getConfig().maxRefillsPerDay}`);
      console.log(`   Daily Refill Amount: ${dailyStats.amount}/${this.smartWallet.getConfig().maxDailyRefillAmount} USDC`);
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
   * Test premium endpoints (payment required)
   */
  async testPremiumEndpoints(): Promise<void> {
    console.log('\n💎 Testing Premium Endpoints with REAL payments...');
    
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
      console.log('✅ Premium Analysis:', data.message);
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
   * Test enterprise endpoint (higher payment)
   */
  async testEnterpriseEndpoint(): Promise<void> {
    console.log('\n🏢 Testing Enterprise Endpoint with REAL payment...');
    
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
   * Test subscription endpoint
   */
  async testSubscriptionEndpoint(): Promise<void> {
    console.log('\n📡 Testing Subscription Endpoint with REAL payment...');
    
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
   * Simulate low balance scenario
   */
  async simulateLowBalance(): Promise<void> {
    console.log('\n⚠️  Simulating Low Balance Scenario with REAL wallets...');
    
    try {
      // Temporarily set low balance threshold to trigger auto-refill
      const originalConfig = this.smartWallet.getConfig();
      this.smartWallet.updateConfig({
        lowBalanceThreshold: 5.0, // $5 USDC
        autoRefillAmount: 15.0    // $15 USDC
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
   * Display smart wallet statistics
   */
  async displayStatistics(): Promise<void> {
    console.log('\n📊 REAL Smart Wallet Statistics:');
    
    try {
      const autoRefillEvents = this.smartWallet.getAutoRefillEvents();
      const transferHistory = this.smartWallet.getTransferHistory();
      const dailyStats = this.smartWallet.getDailyRefillStats();
      const config = this.smartWallet.getConfig();

      console.log(`   Auto-refill Events: ${autoRefillEvents.length}`);
      console.log(`   Transfer History: ${transferHistory.length}`);
      console.log(`   Daily Refills: ${dailyStats.count}/${config.maxRefillsPerDay}`);
      console.log(`   Daily Refill Amount: ${dailyStats.amount}/${config.maxDailyRefillAmount} USDC`);
      console.log(`   Auto-refill Enabled: ${config.enableAutoRefill}`);
      console.log(`   Low Balance Threshold: ${config.lowBalanceThreshold} USDC`);
      console.log(`   Auto-refill Amount: ${config.autoRefillAmount} USDC`);

      if (autoRefillEvents.length > 0) {
        console.log('\n   Recent Auto-refill Events:');
        autoRefillEvents.slice(-3).forEach((event, index) => {
          console.log(`     ${index + 1}. ${event.amount} USDC - ${event.reason} - ${event.success ? '✅' : '❌'}`);
          if (event.transactionHash) {
            console.log(`        Transaction: https://explorer.aptoslabs.com/txn/${event.transactionHash}?network=testnet`);
          }
        });
      }

      if (transferHistory.length > 0) {
        console.log('\n   Recent Transfer History:');
        transferHistory.slice(-3).forEach((tx, index) => {
          console.log(`     ${index + 1}. ${tx.amount} USDC from ${tx.from} to ${tx.to}`);
          console.log(`        Transaction: https://explorer.aptoslabs.com/txn/${tx.transactionHash}?network=testnet`);
        });
      }

    } catch (error) {
      console.error('❌ Failed to get statistics:', error);
    }
  }

  /**
   * Run complete real demo
   */
  async runDemo(): Promise<void> {
    console.log('🎯 Starting xAPT REAL Smart Wallet Demo...');
    console.log('==========================================\n');
    
    console.log('💡 This demo uses REAL Aptos testnet wallets:');
    console.log('   • Spending Wallet: 0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74');
    console.log('   • Saving Wallet: 0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17');
    console.log('   • Network: Aptos Testnet');
    console.log('   • Token: USDC (Testnet)');
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
      
      console.log('\n🎉 REAL Demo completed successfully!');
      console.log('💡 Key Features Demonstrated:');
      console.log('   • REAL HTTP 402 Payment Required handling');
      console.log('   • REAL Automatic wallet refill from savings');
      console.log('   • REAL Smart balance monitoring');
      console.log('   • REAL Transaction history tracking');
      console.log('   • REAL Daily refill limits');
      console.log('   • REAL Payment processing on Aptos testnet');
      console.log('');
      console.log('🔗 View transactions on Aptos Explorer:');
      console.log('   https://explorer.aptoslabs.com/?network=testnet');
      
    } catch (error) {
      console.error('❌ Demo failed:', error);
    } finally {
      await this.smartWallet.disconnect();
      console.log('\n🔌 Real smart wallet disconnected');
    }
  }
} 