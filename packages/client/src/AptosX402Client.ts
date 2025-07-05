/**
 * AptosX402Client
 *
 * Handles HTTP 402 Payment Required flows for Aptos USDC payments.
 *
 * @remarks
 * - Wraps fetch API to handle 402 responses and payment headers
 * - Integrates with Aptos wallet adapter for transaction signing
 * - Sends signed transaction payloads to the resource server
 */
import {
  WalletAdapter,
  AptosAddress,
  AptosTransactionPayload,
  AptosTransactionHash,
  DEFAULT_APTOS_TOKEN_ADDRESS,
  DEFAULT_APTOS_TOKEN_DECIMALS,
  DEFAULT_APTOS_TOKEN_SYMBOL
} from '@xapt/common';

export interface AptosX402ClientOptions {
  /** Optional: Override Aptos node URL */
  nodeUrl?: string;
}

export class AptosX402Client {
  private walletAdapter: WalletAdapter;
  private nodeUrl?: string;

  /**
   * Create a new AptosX402Client
   * @param wallet WalletAdapter instance
   * @param options Optional client options
   */
  constructor(walletAdapter: WalletAdapter, options?: AptosX402ClientOptions) {
    this.walletAdapter = walletAdapter;
    this.nodeUrl = options?.nodeUrl;
  }

  /**
   * Fetch with automatic payment handling
   * @param url The URL to fetch
   * @param options Fetch options
   * @returns Response with payment headers if needed
   */
  async fetchWithPayment(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      // First attempt without payment
      const response = await fetch(url, options);
      
      // If we get a 402 Payment Required, handle it
      if (response.status === 402) {
        return await this.handlePaymentRequired(response, url, options);
      }
      
      return response;
    } catch (error) {
      throw new Error(`Fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle HTTP 402 Payment Required response
   * @param response The 402 response
   * @param originalUrl The original URL that was requested
   * @param originalOptions The original fetch options
   * @returns Response with payment completed
   */
  private async handlePaymentRequired(
    response: Response, 
    originalUrl: string, 
    originalOptions: RequestInit
  ): Promise<Response> {
    try {
      // Parse payment requirements from headers
      const paymentRequired = this.parsePaymentRequiredHeader(response);
      
      if (!paymentRequired) {
        throw new Error('Invalid payment required header');
      }

      console.log(`💰 Payment required: ${paymentRequired.amount} ${DEFAULT_APTOS_TOKEN_SYMBOL}`);
      console.log(`📤 Recipient: ${paymentRequired.recipientAddress}`);

      // Create and submit payment transaction
      const transactionHash = await this.createPaymentTransaction(paymentRequired);
      
      console.log(`✅ Payment transaction submitted: ${transactionHash}`);

      // Retry the original request with payment header
      const paymentHeader = this.createPaymentHeader(paymentRequired, transactionHash);
      
      const retryOptions = {
        ...originalOptions,
        headers: {
          ...originalOptions.headers,
          'X-Aptos-Payment': paymentHeader
        }
      };

      const retryResponse = await fetch(originalUrl, retryOptions);
      
      if (!retryResponse.ok) {
        throw new Error(`Payment verification failed: ${retryResponse.status} ${retryResponse.statusText}`);
      }

      return retryResponse;
    } catch (error) {
      throw new Error(`Payment handling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse X-Aptos-Payment-Required header
   * @param response The 402 response
   * @returns Parsed payment requirements
   */
  private parsePaymentRequiredHeader(response: Response) {
    const header = response.headers.get('X-Aptos-Payment-Required');
    
    if (!header) {
      throw new Error('Missing X-Aptos-Payment-Required header');
    }

    try {
      const paymentRequired = JSON.parse(header);
      
      // Validate required fields
      if (!paymentRequired.amount || !paymentRequired.recipientAddress || !paymentRequired.paymentId) {
        throw new Error('Invalid payment required payload');
      }

      return paymentRequired;
    } catch (error) {
      throw new Error(`Failed to parse payment required header: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create payment transaction
   * @param paymentRequired Payment requirements
   * @returns Transaction hash
   */
  private async createPaymentTransaction(paymentRequired: any): Promise<AptosTransactionHash> {
    // Convert amount to raw units (APT has 8 decimals)
    const amountInRawUnits = this.convertToRawUnits(paymentRequired.amount);
    
    // Create transaction payload for APT transfer
    const payload: AptosTransactionPayload = {
      function: '0x1::coin::transfer',
      type_arguments: [DEFAULT_APTOS_TOKEN_ADDRESS],
      arguments: [paymentRequired.recipientAddress, amountInRawUnits.toString()]
    };

    // Submit transaction using wallet adapter
    return await this.walletAdapter.signAndSubmitTransaction(payload);
  }

  /**
   * Create X-Aptos-Payment header
   * @param paymentRequired Payment requirements
   * @param transactionHash Transaction hash
   * @returns Payment header value
   */
  private createPaymentHeader(paymentRequired: any, transactionHash: AptosTransactionHash): string {
    const paymentPayload = {
      x402Version: 1,
      paymentId: paymentRequired.paymentId,
      transactionHash: transactionHash,
      senderAddress: this.walletAdapter.getAccountAddress(),
      timestamp: Date.now()
    };

    return JSON.stringify(paymentPayload);
  }

  /**
   * Convert APT amount to raw units (8 decimals)
   * @param amount Amount in APT (e.g., "0.1")
   * @returns Amount in raw units
   */
  private convertToRawUnits(amount: string): number {
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat) || amountFloat < 0) {
      throw new Error('Invalid APT amount');
    }
    return Math.floor(amountFloat * Math.pow(10, DEFAULT_APTOS_TOKEN_DECIMALS));
  }
} 