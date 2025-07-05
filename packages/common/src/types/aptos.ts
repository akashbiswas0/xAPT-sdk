/**
 * Aptos address type (64 character hex string)
 */
export type AptosAddress = string;

/**
 * Aptos transaction hash type (64 character hex string)
 */
export type AptosTransactionHash = string;

/**
 * Aptos transaction payload for coin transfers
 */
export interface AptosTransactionPayload {
  /** Function to call: "0x1::coin::transfer" */
  function: string;
  /** Type arguments: [USDC coin type] */
  type_arguments: string[];
  /** Function arguments: [recipient, amount] */
  arguments: [AptosAddress, string];
}

/**
 * Signed transaction structure
 */
export interface SignedTransaction {
  /** The transaction payload */
  payload: AptosTransactionPayload;
  /** The signature of the transaction */
  signature: string;
  /** The public key used to sign */
  public_key: string;
}

/**
 * Raw transaction bytes (BCS encoded)
 */
export type RawTransactionBytes = Uint8Array;

/**
 * Base64 encoded transaction bytes
 */
export type Base64TransactionBytes = string;

/**
 * Wallet adapter interface for client integration
 */
export interface WalletAdapter {
  /** Check if wallet is connected */
  isConnected(): boolean;
  /** Get the connected account address */
  getAccountAddress(): AptosAddress | null;
  /** Sign a transaction payload */
  signTransaction(payload: AptosTransactionPayload): Promise<SignedTransaction>;
  /** Sign and submit a transaction */
  signAndSubmitTransaction(payload: AptosTransactionPayload): Promise<AptosTransactionHash>;
  /** Connect to wallet */
  connect(): Promise<void>;
  /** Disconnect from wallet */
  disconnect(): Promise<void>;
}

/**
 * Error types for Aptos-related operations
 */
export enum AptosErrorType {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  SIGNATURE_FAILED = 'SIGNATURE_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

/**
 * Custom error for Aptos operations
 */
export class AptosError extends Error {
  constructor(
    message: string,
    public type: AptosErrorType,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AptosError';
  }
} 