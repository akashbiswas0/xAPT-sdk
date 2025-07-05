import { 
  WalletAdapter as IWalletAdapter, 
  AptosAddress, 
  AptosTransactionPayload, 
  SignedTransaction, 
  AptosTransactionHash 
} from '@xapt/common';
import { AptosX402Client } from '@xapt/client';
import { SmartWalletConfig, WalletBalance, AutoRefillEvent, TransferTransaction } from '../types/wallet';

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Smart Wallet Adapter that implements saving and spending wallet functionality
 * Automatically refills spending wallet from savings when balance is low
 */
export class SmartWalletAdapter implements IWalletAdapter {
  private spendingWallet: IWalletAdapter;
  private savingWallet: IWalletAdapter;
  private spendingClient: AptosX402Client;
  private savingClient: AptosX402Client;
  private config: SmartWalletConfig;
  private dailyRefillCount: number = 0;
  private dailyRefillAmount: number = 0;
  private lastRefillDate: Date = new Date();
  private autoRefillEvents: AutoRefillEvent[] = [];
  private transferHistory: TransferTransaction[] = [];

  constructor(
    spendingWalletAdapter: IWalletAdapter,
    savingWalletAdapter: IWalletAdapter,
    config: SmartWalletConfig
  ) {
    this.spendingWallet = spendingWalletAdapter;
    this.savingWallet = savingWalletAdapter;
    this.spendingClient = new AptosX402Client(spendingWalletAdapter);
    this.savingClient = new AptosX402Client(savingWalletAdapter);
    this.config = config;
    this.resetDailyCounters();
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.spendingWallet.isConnected() && this.savingWallet.isConnected();
  }

  /**
   * Get the connected account address (spending wallet)
   */
  getAccountAddress(): AptosAddress | null {
    return this.spendingWallet.getAccountAddress();
  }

  /**
   * Get saving wallet address
   */
  getSavingAddress(): AptosAddress | null {
    return this.savingWallet.getAccountAddress();
  }

  /**
   * Connect to both wallets
   */
  async connect(): Promise<void> {
    await Promise.all([
      this.spendingWallet.connect(),
      this.savingWallet.connect()
    ]);
  }

  /**
   * Disconnect from both wallets
   */
  async disconnect(): Promise<void> {
    await Promise.all([
      this.spendingWallet.disconnect(),
      this.savingWallet.disconnect()
    ]);
  }

  /**
   * Sign a transaction (delegates to spending wallet)
   */
  async signTransaction(payload: AptosTransactionPayload): Promise<SignedTransaction> {
    return this.spendingWallet.signTransaction(payload);
  }

  /**
   * Sign and submit a transaction with smart refill logic
   */
  async signAndSubmitTransaction(payload: AptosTransactionPayload): Promise<AptosTransactionHash> {
    // Check if refill is needed before making payment
    await this.checkAndRefillIfNeeded();

    // Submit the transaction using real blockchain submission
    const transactionHash = await this.spendingWallet.signAndSubmitTransaction(payload);
    
    // Record the transaction
    this.recordTransaction(transactionHash, payload);
    
    return transactionHash;
  }

  /**
   * Smart payment method that handles auto-refill
   */
  async smartPayment(endpoint: string, amount?: string): Promise<Response> {
    try {
      // Check if refill is needed
      await this.checkAndRefillIfNeeded();
      
      // Make the payment
      return await this.spendingClient.fetchWithPayment(endpoint);
      
    } catch (error: any) {
      if (error.code === 'INSUFFICIENT_FUNDS') {
        // Try to refill and retry
        await this.emergencyRefill();
        return await this.spendingClient.fetchWithPayment(endpoint);
      }
      throw error;
    }
  }

  /**
   * Get spending wallet balance
   */
  async getSpendingBalance(): Promise<WalletBalance> {
    const address = this.getAccountAddress();
    if (!address) {
      throw new Error('Spending wallet not connected');
    }

    // Get real balance from the spending wallet adapter
    const balanceRaw = await (this.spendingWallet as any).getRealBalance();
    const balance = parseFloat(balanceRaw) / Math.pow(10, 8); // APT has 8 decimals, not 6

    return {
      address,
      balance,
      balanceRaw,
      lastUpdated: new Date()
    };
  }

  /**
   * Get saving wallet balance
   */
  async getSavingBalance(): Promise<WalletBalance> {
    const address = this.getSavingAddress();
    if (!address) {
      throw new Error('Saving wallet not connected');
    }

    // Get real balance from the saving wallet adapter
    const balanceRaw = await (this.savingWallet as any).getRealBalance();
    const balance = parseFloat(balanceRaw) / Math.pow(10, 8); // APT has 8 decimals, not 6

    return {
      address,
      balance,
      balanceRaw,
      lastUpdated: new Date()
    };
  }

  /**
   * Check if refill is needed and perform it
   */
  private async checkAndRefillIfNeeded(): Promise<void> {
    if (!this.config.enableAutoRefill) {
      return;
    }

    // Reset daily counters if it's a new day
    this.resetDailyCounters();

    // Check if we've hit daily limits
    if (this.dailyRefillCount >= this.config.maxRefillsPerDay) {
      console.log('Daily refill limit reached');
      return;
    }

    if (this.dailyRefillAmount >= this.config.maxDailyRefillAmount) {
      console.log('Daily refill amount limit reached');
      return;
    }

    const spendingBalance = await this.getSpendingBalance();
    
    if (spendingBalance.balance < this.config.lowBalanceThreshold) {
      console.log(`Low balance detected: ${spendingBalance.balance} APT`);
      await this.performAutoRefill('low_balance');
    }
  }

  /**
   * Perform automatic refill from savings
   */
  private async performAutoRefill(reason: 'low_balance' | 'insufficient_funds' | 'manual'): Promise<void> {
    console.log(`🔄 Performing REAL auto-refill: ${reason}`);
    
    try {
      const savingBalance = await this.getSavingBalance();
      
      if (savingBalance.balance < this.config.autoRefillAmount) {
        throw new Error('Insufficient funds in savings wallet');
      }

      console.log(`💰 Transferring ${this.config.autoRefillAmount} APT from savings to spending via REAL blockchain transaction...`);

      // Transfer from savings to spending using real blockchain transaction
      const transactionHash = await this.transferFromSavings(
        this.config.autoRefillAmount.toString()
      );

      // Record the auto-refill event
      const event: AutoRefillEvent = {
        id: generateUUID(),
        walletAddress: this.getAccountAddress()!,
        amount: this.config.autoRefillAmount,
        transactionHash,
        reason,
        timestamp: new Date(),
        success: true
      };

      this.autoRefillEvents.push(event);
      this.dailyRefillCount++;
      this.dailyRefillAmount += this.config.autoRefillAmount;

      console.log(`✅ REAL auto-refill successful! Transaction: ${transactionHash}`);
      console.log(`🔗 View on explorer: https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`);

    } catch (error) {
      console.error('❌ Auto-refill failed:', error);
      
      const event: AutoRefillEvent = {
        id: generateUUID(),
        walletAddress: this.getAccountAddress()!,
        amount: this.config.autoRefillAmount,
        transactionHash: '',
        reason,
        timestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      this.autoRefillEvents.push(event);
      throw error;
    }
  }

  /**
   * Emergency refill when payment fails due to insufficient funds
   */
  private async emergencyRefill(): Promise<void> {
    console.log('Emergency refill triggered');
    await this.performAutoRefill('insufficient_funds');
  }

  /**
   * Transfer funds from savings to spending wallet
   */
  private async transferFromSavings(amount: string): Promise<AptosTransactionHash> {
    const spendingAddress = this.getAccountAddress();
    if (!spendingAddress) {
      throw new Error('Spending wallet not connected');
    }

    // Create transfer payload
    const payload: AptosTransactionPayload = {
      function: '0x1::coin::transfer',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [spendingAddress, this.convertToRawUnits(amount).toString()]
    };

    // Submit transaction from savings wallet
    const transactionHash = await this.savingWallet.signAndSubmitTransaction(payload);
    
    // Record the transfer
    this.recordTransaction(transactionHash, payload, 'savings_to_spending');
    
    return transactionHash;
  }

  /**
   * Convert APT amount to raw units (8 decimals)
   */
  private convertToRawUnits(amount: string): number {
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat) || amountFloat < 0) {
      throw new Error('Invalid APT amount');
    }
    return Math.floor(amountFloat * Math.pow(10, 8));
  }

  /**
   * Record a transaction in history
   */
  private recordTransaction(
    transactionHash: AptosTransactionHash, 
    payload: AptosTransactionPayload,
    type: 'payment' | 'savings_to_spending' = 'payment'
  ): void {
    const transaction: TransferTransaction = {
      transactionHash,
      from: this.getAccountAddress()!,
      to: payload.arguments[0] as AptosAddress,
      amount: parseFloat(payload.arguments[1]) / Math.pow(10, 8),
      timestamp: new Date(),
      status: 'success'
    };

    this.transferHistory.push(transaction);
  }

  /**
   * Reset daily counters if it's a new day
   */
  private resetDailyCounters(): void {
    const today = new Date().toDateString();
    const lastRefillDay = this.lastRefillDate.toDateString();
    
    if (today !== lastRefillDay) {
      this.dailyRefillCount = 0;
      this.dailyRefillAmount = 0;
      this.lastRefillDate = new Date();
    }
  }

  /**
   * Get auto-refill events
   */
  getAutoRefillEvents(): AutoRefillEvent[] {
    return [...this.autoRefillEvents];
  }

  /**
   * Get transfer history
   */
  getTransferHistory(): TransferTransaction[] {
    return [...this.transferHistory];
  }

  /**
   * Get daily refill statistics
   */
  getDailyRefillStats(): { count: number; amount: number } {
    return {
      count: this.dailyRefillCount,
      amount: this.dailyRefillAmount
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SmartWalletConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): SmartWalletConfig {
    return { ...this.config };
  }
} 