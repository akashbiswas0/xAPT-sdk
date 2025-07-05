/**
 * Payload sent in X-Aptos-Payment-Required header when a payment is needed
 */
export interface AptosPaymentRequiredPayload {
  /** Version of the x402 protocol being used */
  x402Version: number;
  /** Unique ID for this payment request (UUID or similar) */
  paymentId: string;
  /** USDC amount as string, e.g., "0.01" */
  amount: string;
  /** Full Aptos address of the USDC coin type */
  tokenAddress: string;
  /** Aptos address of the resource server (where USDC should be sent) */
  recipientAddress: string;
  /** Aptos network: "testnet" */
  network: string;
  /** Optional: Currency symbol for display */
  currencySymbol?: string;
  /** Optional: Human-readable description of what the payment is for */
  description?: string;
  /** Optional: Timestamp when the payment request was created */
  timestamp?: number;
}

/**
 * Payload sent in X-Aptos-Payment header after initiating/completing an Aptos transaction
 */
export interface AptosPaymentPayload {
  /** Version of the x402 protocol being used */
  x402Version: number;
  /** Must match the paymentId from the X-Aptos-Payment-Required header */
  paymentId: string;
  /** Aptos transaction hash if already submitted by client */
  transactionHash?: string;
  /** Base64 encoded signed raw transaction payload (for facilitator to submit) */
  signedTransactionPayload?: string;
  /** Client's Aptos address (optional, can be derived from signature) */
  senderAddress?: string;
  /** Optional: Timestamp when the payment was initiated */
  timestamp?: number;
  /** Optional: Client application identifier */
  clientAppId?: string;
}

/**
 * Request sent to the Aptos Payment Facilitator Service for payment verification
 */
export interface PaymentVerificationRequest {
  /** Payment ID to verify */
  paymentId: string;
  /** Raw BCS bytes of signed transaction payload (Base64 encoded) */
  signedTransactionPayload?: string;
  /** Transaction hash if client submitted directly */
  transactionHash?: string;
  /** Expected amount in USDC (string) */
  expectedAmount: string;
  /** Expected USDC token address */
  expectedTokenAddress: string;
  /** Expected recipient address */
  expectedRecipientAddress: string;
  /** Expected network: "testnet" */
  expectedNetwork: string;
}

/**
 * Response from the Aptos Payment Facilitator Service
 */
export interface PaymentVerificationResponse {
  /** True if payment is confirmed valid */
  isValid: boolean;
  /** Reason for invalidation if isValid is false */
  reason?: string;
  /** Confirmed transaction hash on Aptos */
  transactionHash?: string;
  /** Confirmed sender of the payment */
  senderAddress?: string;
  /** Confirmed amount actually transferred */
  amountTransferred?: string;
  /** Optional: Timestamp when verification was completed */
  timestamp?: number;
}

/**
 * Payment rule configuration for server middleware
 */
export interface PaymentRule {
  /** USDC amount required for this endpoint */
  amount: string;
  /** Aptos address to receive the payment */
  recipientAddress: string;
  /** Optional: Description of what the payment is for */
  description?: string;
  /** Optional: Currency symbol (defaults to "USDC") */
  currencySymbol?: string;
}

/**
 * Configuration for the xAPT payment middleware
 */
export interface XaptMiddlewareConfig {
  /** Base URL of the Aptos Payment Facilitator Service */
  facilitatorBaseUrl: string;
  /** Mapping of API paths to payment requirements */
  paymentRules: Record<string, PaymentRule>;
  /** Optional: Timeout for facilitator requests in milliseconds */
  timeout?: number;
  /** Optional: Custom headers to include in facilitator requests */
  headers?: Record<string, string>;
} 