/**
 * HTTP fetch interceptor for automatic 402 payment handling
 * 
 * Creates a modified fetch function that automatically handles HTTP 402
 * Payment Required responses using the AptosX402Client.
 */
import { AptosX402Client } from '../AptosX402Client';
import { WalletAdapter } from '@xapt/common';

/**
 * Fetch interceptor for automatic xAPT payment handling
 * 
 * This interceptor automatically handles HTTP 402 Payment Required
 * responses by creating and submitting APT transactions.
 */
export class FetchInterceptor {
  private client: AptosX402Client;

  constructor(walletAdapter: WalletAdapter) {
    this.client = new AptosX402Client(walletAdapter);
  }

  /**
   * Intercept fetch calls and handle payments automatically
   * @param input RequestInfo (URL or Request object)
   * @param init Optional RequestInit
   * @returns Response with payment handled if needed
   */
  async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    // Convert RequestInfo to string URL
    const url = typeof input === 'string' ? input : input.url;
    
    return this.client.fetchWithPayment(url, init || {});
  }

  /**
   * Get the underlying xAPT client
   * @returns AptosX402Client instance
   */
  getClient(): AptosX402Client {
    return this.client;
  }
} 