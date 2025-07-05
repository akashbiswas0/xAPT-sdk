import { 
  WalletAdapter as IWalletAdapter, 
  AptosAddress, 
  AptosTransactionPayload, 
  SignedTransaction, 
  AptosTransactionHash 
} from '@xapt/common';

/**
 * MOCK Aptos Wallet Adapter that simulates real wallet functionality
 * Used for testing when blockchain nodes are not synced
 */
export class MockAptosWalletAdapter implements IWalletAdapter {
  private connected: boolean = false;
  private address: AptosAddress;
  private mockBalance: number;
  private sequenceNumber: number = 0;

  constructor(address: AptosAddress, mockBalance: number = 5.0) {
    this.address = address;
    this.mockBalance = mockBalance;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getAccountAddress(): AptosAddress | null {
    return this.connected ? this.address : null;
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log(`🔗 Connected to MOCK Aptos wallet: ${this.address}`);
    console.log(`💰 MOCK balance: ${this.mockBalance} APT`);
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log(`🔌 Disconnected from MOCK wallet: ${this.address}`);
  }

  async signTransaction(payload: AptosTransactionPayload): Promise<SignedTransaction> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    console.log(`✍️  Signing MOCK transaction for ${this.address}:`, payload);

    // Create a mock signed transaction
    return {
      payload: payload,
      signature: '0x' + 'mock_signature_' + Date.now().toString(16),
      public_key: '0x' + 'mock_public_key_' + this.address.substring(2, 34)
    };
  }

  async signAndSubmitTransaction(payload: AptosTransactionPayload): Promise<AptosTransactionHash> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    console.log(`📤 Submitting MOCK transaction for ${this.address}:`, payload);

    try {
      // Simulate transaction processing
      const amount = parseFloat(payload.arguments[1]) / Math.pow(10, 8);
      
      // Check if we have sufficient balance
      if (amount > this.mockBalance) {
        throw new Error(`Insufficient MOCK balance: ${this.mockBalance} APT, required: ${amount} APT`);
      }

      // Deduct from mock balance
      this.mockBalance -= amount;
      
      // Generate mock transaction hash
      const transactionHash = '0x' + 'mock_tx_' + Date.now().toString(16) + '_' + Math.random().toString(16).substring(2, 10);
      
      console.log(`✅ MOCK transaction submitted: ${transactionHash}`);
      console.log(`🔗 View on explorer: https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`);
      console.log(`📊 Transaction details:`);
      console.log(`   From: ${this.address}`);
      console.log(`   To: ${payload.arguments[0]}`);
      console.log(`   Amount: ${amount} APT`);
      console.log(`   Function: ${payload.function}`);
      console.log(`   New Balance: ${this.mockBalance} APT`);
      
      // Increment sequence number
      this.sequenceNumber++;
      
      return transactionHash;
    } catch (error) {
      console.error(`❌ MOCK transaction failed: ${error}`);
      throw error;
    }
  }

  async getRealBalance(): Promise<string> {
    // Return mock balance in raw units (8 decimals)
    const balanceRaw = Math.floor(this.mockBalance * Math.pow(10, 8));
    console.log(`💰 MOCK balance: ${balanceRaw} raw units (${this.mockBalance} APT)`);
    return balanceRaw.toString();
  }

  async getAccountSequenceNumber(): Promise<number> {
    return this.sequenceNumber;
  }

  // Mock methods for testing
  getMockBalance(): number {
    return this.mockBalance;
  }

  setMockBalance(balance: number): void {
    this.mockBalance = balance;
    console.log(`💰 MOCK balance updated to: ${balance} APT`);
  }

  addMockBalance(amount: number): void {
    this.mockBalance += amount;
    console.log(`💰 MOCK balance increased by ${amount} APT to: ${this.mockBalance} APT`);
  }
} 