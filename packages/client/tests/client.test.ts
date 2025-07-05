import { AptosX402Client } from '../src/AptosX402Client';
import { WalletAdapter } from '../src/wallet/walletAdapter';

// Mock wallet adapter for testing
class MockWalletAdapter extends WalletAdapter {
  private connected = false;
  private address = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  isConnected(): boolean {
    return this.connected;
  }

  getAccountAddress(): string | null {
    return this.connected ? this.address : null;
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async signTransaction(): Promise<any> {
    return { signature: 'mock-signature' };
  }

  async signAndSubmitTransaction(): Promise<string> {
    return 'mock-tx-hash';
  }
}

describe('AptosX402Client', () => {
  let client: AptosX402Client;
  let wallet: MockWalletAdapter;

  beforeEach(() => {
    wallet = new MockWalletAdapter();
    client = new AptosX402Client(wallet);
  });

  it('should create client instance', () => {
    expect(client).toBeInstanceOf(AptosX402Client);
  });

  it('should handle non-402 responses normally', async () => {
    // Mock fetch to return 200
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      headers: new Headers(),
    });

    const response = await client.fetchWithPayment('/api/test');
    expect(response.status).toBe(200);
  });
}); 