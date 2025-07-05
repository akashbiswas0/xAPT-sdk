import { AptosX402Client } from '@xapt/client';
import { SmartWalletAdapter } from '../wallet/smartWalletAdapter';
import { MockAptosWalletAdapter } from '../wallet/mockAptosWalletAdapter';
import { SmartWalletConfig } from '../types/wallet';

/**
 * MOCK Blockchain Demo Client for testing when nodes are not synced
 * This simulates real transactions without requiring actual blockchain access
 */
export class MockBlockchainDemoClient {
  private smartWallet: SmartWalletAdapter;
  private client: AptosX402Client;
  private serverUrl: string;

  constructor(serverUrl: string = 'http://localhost:3000') {
    this.serverUrl = serverUrl;

    // Create mock wallet adapters with simulated balances
    const spendingWallet = new MockAptosWalletAdapter('0x54aac012a65ed3aae7c829877ac604a9f579aebee87818e4eb5d8e6220fdb93d', 2.5); // 2.5 APT
    const savingWallet = new MockAptosWalletAdapter('0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17', 10.0); // 10 APT

    // Configure smart wallet
    const config: SmartWalletConfig = {
      lowBalanceThreshold: 0.2, // 0.2 APT
      autoRefillAmount: 1.0,    // 1 APT
      maxRefillsPerDay: 5,
      maxDailyRefillAmount: 5.0, // 5 APT
      enableAutoRefill: true,
      enableNotifications: true
    };

    // Create smart wallet adapter
    this.smartWallet = new SmartWalletAdapter(spendingWallet, savingWallet, config);
    this.client = new AptosX402Client(this.smartWallet);
  }

  /**
   * Initialize the mock blockchain demo client
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing xAPT MOCK Blockchain Demo Client...');
    console.log('🔗 This simulates REAL transactions on Aptos testnet!');
    console.log('⚠️  WARNING: This uses MOCK wallets with simulated balances!');
    
    try {
      await this.smartWallet.connect();
      console.log('✅ Mock blockchain smart wallet connected successfully');
      
      // Display mock balances
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

      console.log('\n💰 MOCK Blockchain Wallet Balances:');
      console.log(`   Spending Wallet: ${spendingBalance.balance} APT`);
      console.log(`   Spending Address: ${spendingBalance.address}`);
      console.log(`   Saving Wallet: ${savingBalance.balance} APT`);
      console.log(`   Saving Address: ${savingBalance.address}`);
      console.log(`   Daily Refills: ${dailyStats.count}/${this.smartWallet.getConfig().maxRefillsPerDay}`);
      console.log(`   Daily Refill Amount: ${dailyStats.amount}/${this.smartWallet.getConfig().maxDailyRefillAmount} APT`);
      
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
   * Test premium endpoints with MOCK blockchain payments
   */
  async testPremiumEndpoints(): Promise<void> {
    console.log('\n💎 Testing Premium Endpoints with MOCK blockchain payments...');
    console.log('⚠️  This simulates REAL APT transfers!');
    
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
   * Test enterprise endpoint with MOCK blockchain payment
   */
  async testEnterpriseEndpoint(): Promise<void> {
    console.log('\n🏢 Testing Enterprise Endpoint with MOCK blockchain payment...');
    console.log('⚠️  This simulates a REAL 0.05 APT transfer!');
    
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
   * Test subscription endpoint with MOCK blockchain payment
   */
  async testSubscriptionEndpoint(): Promise<void> {
    console.log('\n📡 Testing Subscription Endpoint with MOCK blockchain payment...');
    console.log('⚠️  This simulates a REAL APT transfer!');
    
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
   * Simulate low balance scenario with MOCK blockchain transactions
   */
  async simulateLowBalance(): Promise<void> {
    console.log('\n⚠️  Simulating Low Balance Scenario with MOCK blockchain...');
    console.log('⚠️  This will trigger MOCK auto-refill from savings!');
    
    try {
      // Temporarily set low balance threshold to trigger auto-refill
      const originalConfig = this.smartWallet.getConfig();
      this.smartWallet.updateConfig({
        lowBalanceThreshold: 0.05, // 0.05 APT
        autoRefillAmount: 0.1     // 0.1 APT
      });

      console.log('💰 Current spending balance is low, auto-refill should trigger...');
      
      // Try to make a payment that will trigger auto-refill
      const response = await this.client.fetchWithPayment(`${this.serverUrl}/api/premium/data`);
      const data = await response.json();
      console.log('✅ Low balance simulation successful:', data.message);

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
    console.log('\n📊 MOCK Blockchain Smart Wallet Statistics:');
    
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
        const status = event.success ? '✅' : '❌';
        console.log(`     ${index + 1}. ${event.amount} APT - ${event.reason} - ${status}`);
      });
    }
  }

  /**
   * Run the complete mock blockchain demo
   */
  async runDemo(): Promise<void> {
    try {
      await this.initialize();
      
      // Test all endpoints
      await this.testPublicEndpoints();
      await this.testPremiumEndpoints();
      await this.testEnterpriseEndpoint();
      await this.testSubscriptionEndpoint();
      
      // Test smart wallet features
      await this.simulateLowBalance();
      
      // Display statistics
      await this.displayStatistics();
      
      console.log('\n🎉 MOCK Blockchain Demo completed successfully!');
      console.log('💡 Key Features Demonstrated:');
      console.log('   • MOCK HTTP 402 Payment Required handling');
      console.log('   • MOCK Automatic wallet refill from savings');
      console.log('   • MOCK Smart balance monitoring');
      console.log('   • MOCK Transaction history tracking');
      console.log('   • MOCK Daily refill limits');
      console.log('   • MOCK Payment processing simulation');
      
    } catch (error) {
      console.error('❌ Mock blockchain demo failed:', error);
    } finally {
      await this.smartWallet.disconnect();
      console.log('\n🔌 Mock blockchain smart wallet disconnected');
    }
  }
} 