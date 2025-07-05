/**
 * FacilitatorClient
 * 
 * Handles HTTP requests to the external Aptos Payment Facilitator Service
 * for payment verification and transaction submission.
 */
import {
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from '@xapt/common';

export interface FacilitatorClientOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Additional headers to include in requests */
  headers?: Record<string, string>;
}

export class FacilitatorClient {
  private baseUrl: string;
  private options: FacilitatorClientOptions;

  constructor(baseUrl: string, options: FacilitatorClientOptions = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.options = {
      timeout: 30000, // 30 seconds default
      ...options,
    };
  }

  /**
   * Verify a payment with the facilitator service
   * @param request Payment verification request
   * @returns Payment verification response
   */
  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.options.headers,
        },
        body: JSON.stringify(request),
        signal: this.createTimeoutSignal(this.options.timeout!),
      });

      if (!response.ok) {
        throw new Error(`Facilitator service error: ${response.status} ${response.statusText}`);
      }

      const result: PaymentVerificationResponse = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Facilitator service timeout');
      }
      throw new Error(`Failed to verify payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Submit a signed transaction to the facilitator service
   * @param signedTransactionPayload Base64 encoded signed transaction
   * @returns Transaction submission response
   */
  async submitTransaction(signedTransactionPayload: string): Promise<{ transactionHash: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/submit-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.options.headers,
        },
        body: JSON.stringify({ signedTransactionPayload }),
        signal: this.createTimeoutSignal(this.options.timeout!),
      });

      if (!response.ok) {
        throw new Error(`Facilitator service error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Facilitator service timeout');
      }
      throw new Error(`Failed to submit transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Helper to create a timeout signal for fetch requests
   */
  private createTimeoutSignal(timeoutMs: number): AbortSignal | undefined {
    if (typeof AbortController === 'undefined') return undefined;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    return controller.signal;
  }
} 