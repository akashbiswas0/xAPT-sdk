import { AptosAddress, AptosTransactionHash } from '@xapt/common';

/**
 * Wallet configuration for the smart wallet system
 */
export interface SmartWalletConfig {
  /** Low balance threshold that triggers auto-refill (in USDC) */
  lowBalanceThreshold: number;
  /** Amount to refill when balance is low (in USDC) */
  autoRefillAmount: number;
  /** Maximum number of refills per day */
  maxRefillsPerDay: number;
  /** Maximum amount that can be refilled per day (in USDC) */
  maxDailyRefillAmount: number;
  /** Whether to enable automatic refills */
  enableAutoRefill: boolean;
  /** Whether to enable notifications */
  enableNotifications: boolean;
}

/**
 * Wallet balance information
 */
export interface WalletBalance {
  /** Wallet address */
  address: AptosAddress;
  /** Current USDC balance */
  balance: number;
  /** Balance in raw units (6 decimals) */
  balanceRaw: string;
  /** Last updated timestamp */
  lastUpdated: Date;
}

/**
 * Transfer transaction details
 */
export interface TransferTransaction {
  /** Transaction hash */
  transactionHash: AptosTransactionHash;
  /** From address */
  from: AptosAddress;
  /** To address */
  to: AptosAddress;
  /** Amount transferred (in USDC) */
  amount: number;
  /** Transaction timestamp */
  timestamp: Date;
  /** Transaction status */
  status: 'pending' | 'success' | 'failed';
  /** Gas used */
  gasUsed?: number;
  /** Gas price */
  gasPrice?: number;
}

/**
 * Auto-refill event details
 */
export interface AutoRefillEvent {
  /** Event ID */
  id: string;
  /** Triggering wallet address */
  walletAddress: AptosAddress;
  /** Amount refilled (in USDC) */
  amount: number;
  /** Transaction hash */
  transactionHash: AptosTransactionHash;
  /** Trigger reason */
  reason: 'low_balance' | 'insufficient_funds' | 'manual';
  /** Event timestamp */
  timestamp: Date;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Spending analytics
 */
export interface SpendingAnalytics {
  /** Total spent today (in USDC) */
  totalSpentToday: number;
  /** Total spent this week (in USDC) */
  totalSpentThisWeek: number;
  /** Total spent this month (in USDC) */
  totalSpentThisMonth: number;
  /** Number of transactions today */
  transactionsToday: number;
  /** Number of auto-refills today */
  autoRefillsToday: number;
  /** Average transaction amount */
  averageTransactionAmount: number;
  /** Most frequent recipient */
  mostFrequentRecipient?: AptosAddress;
}

/**
 * Wallet status
 */
export interface WalletStatus {
  /** Is wallet connected */
  isConnected: boolean;
  /** Current wallet address */
  address?: AptosAddress;
  /** Network being used */
  network: 'testnet' | 'mainnet' | 'devnet';
  /** Last activity timestamp */
  lastActivity?: Date;
}

/**
 * Payment request details
 */
export interface PaymentRequest {
  /** Payment ID */
  paymentId: string;
  /** Amount required (in USDC) */
  amount: number;
  /** Recipient address */
  recipientAddress: AptosAddress;
  /** Payment description */
  description: string;
  /** Payment timestamp */
  timestamp: Date;
  /** Payment status */
  status: 'pending' | 'completed' | 'failed';
  /** Transaction hash if completed */
  transactionHash?: AptosTransactionHash;
} 