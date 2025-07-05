/**
 * Error codes for xAPT SDK
 */
export enum XaptErrorCode {
  // Payment-related errors
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  PAYMENT_INVALID = 'PAYMENT_INVALID',
  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED',
  PAYMENT_AMOUNT_MISMATCH = 'PAYMENT_AMOUNT_MISMATCH',
  PAYMENT_RECIPIENT_MISMATCH = 'PAYMENT_RECIPIENT_MISMATCH',
  
  // Wallet-related errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_FAILED = 'WALLET_CONNECTION_FAILED',
  WALLET_SIGNATURE_FAILED = 'WALLET_SIGNATURE_FAILED',
  
  // Transaction-related errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  TRANSACTION_INVALID = 'TRANSACTION_INVALID',
  
  // Network-related errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  FACILITATOR_ERROR = 'FACILITATOR_ERROR',
  FACILITATOR_TIMEOUT = 'FACILITATOR_TIMEOUT',
  
  // Validation errors
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INVALID_PAYMENT_ID = 'INVALID_PAYMENT_ID',
  INVALID_HEADER = 'INVALID_HEADER',
  
  // Configuration errors
  MISSING_CONFIG = 'MISSING_CONFIG',
  INVALID_CONFIG = 'INVALID_CONFIG',
}

/**
 * Error messages for xAPT SDK
 */
export const XAPT_ERROR_MESSAGES: Record<XaptErrorCode, string> = {
  [XaptErrorCode.PAYMENT_REQUIRED]: 'Payment is required to access this resource',
  [XaptErrorCode.PAYMENT_INVALID]: 'Payment verification failed',
  [XaptErrorCode.PAYMENT_EXPIRED]: 'Payment request has expired',
  [XaptErrorCode.PAYMENT_AMOUNT_MISMATCH]: 'Payment amount does not match required amount',
  [XaptErrorCode.PAYMENT_RECIPIENT_MISMATCH]: 'Payment recipient does not match expected recipient',
  
  [XaptErrorCode.WALLET_NOT_CONNECTED]: 'Wallet is not connected',
  [XaptErrorCode.WALLET_CONNECTION_FAILED]: 'Failed to connect to wallet',
  [XaptErrorCode.WALLET_SIGNATURE_FAILED]: 'Failed to sign transaction',
  
  [XaptErrorCode.TRANSACTION_FAILED]: 'Transaction failed on blockchain',
  [XaptErrorCode.TRANSACTION_TIMEOUT]: 'Transaction timed out',
  [XaptErrorCode.TRANSACTION_INVALID]: 'Invalid transaction payload',
  
  [XaptErrorCode.NETWORK_ERROR]: 'Network error occurred',
  [XaptErrorCode.FACILITATOR_ERROR]: 'Payment facilitator service error',
  [XaptErrorCode.FACILITATOR_TIMEOUT]: 'Payment facilitator service timeout',
  
  [XaptErrorCode.INVALID_ADDRESS]: 'Invalid Aptos address',
  [XaptErrorCode.INVALID_AMOUNT]: 'Invalid payment amount',
  [XaptErrorCode.INVALID_PAYMENT_ID]: 'Invalid payment ID',
  [XaptErrorCode.INVALID_HEADER]: 'Invalid HTTP header format',
  
  [XaptErrorCode.MISSING_CONFIG]: 'Missing required configuration',
  [XaptErrorCode.INVALID_CONFIG]: 'Invalid configuration provided',
};

/**
 * Custom error class for xAPT SDK
 */
export class XaptError extends Error {
  constructor(
    message: string,
    public code: XaptErrorCode,
    public statusCode?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'XaptError';
  }

  /**
   * Create a XaptError from an error code
   */
  static fromCode(code: XaptErrorCode, statusCode?: number, details?: Record<string, any>): XaptError {
    return new XaptError(XAPT_ERROR_MESSAGES[code], code, statusCode, details);
  }
} 