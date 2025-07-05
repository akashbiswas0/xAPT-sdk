/**
 * Aptos blockchain constants for xAPT SDK
 */

/**
 * Aptos Testnet USDC token address (replaced with APT)
 */
export const APTOS_TESTNET_APT_ADDRESS = '0x1::aptos_coin::AptosCoin';

/**
 * Aptos Mainnet APT token address
 */
export const APTOS_MAINNET_APT_ADDRESS = '0x1::aptos_coin::AptosCoin';

/**
 * Default APT decimals (8 decimals for APT)
 */
export const APT_DECIMALS = 8;

/**
 * Default USDC decimals (6 decimals for USDC) - kept for reference
 */
export const USDC_DECIMALS = 6;

/**
 * Network identifiers
 */
export const APTOS_TESTNET = 'testnet';
export const APTOS_MAINNET = 'mainnet';

/**
 * Default network for xAPT
 */
export const DEFAULT_APTOS_NETWORK = APTOS_TESTNET;

/**
 * Default token for xAPT (now APT instead of USDC)
 */
export const DEFAULT_APTOS_TOKEN_ADDRESS = APTOS_TESTNET_APT_ADDRESS;
export const DEFAULT_APTOS_TOKEN_DECIMALS = APT_DECIMALS;
export const DEFAULT_APTOS_TOKEN_SYMBOL = 'APT';

/**
 * Aptos network names
 */
export const APTOS_NETWORKS = {
  TESTNET: 'testnet',
  MAINNET: 'mainnet',
  DEVNET: 'devnet',
} as const;

/**
 * Default Aptos node URLs
 */
export const APTOS_NODE_URLS = {
  TESTNET: 'https://fullnode.testnet.aptoslabs.com/v1',
  MAINNET: 'https://fullnode.mainnet.aptoslabs.com/v1',
  DEVNET: 'https://fullnode.devnet.aptoslabs.com/v1',
} as const;

/**
 * USDC token configuration
 */
export const USDC_CONFIG = {
  DECIMALS: 6,
  SYMBOL: 'USDC',
  NAME: 'USD Coin',
} as const;

/**
 * Aptos transaction configuration
 */
export const APTOS_TRANSACTION_CONFIG = {
  /** Default gas price in octa */
  DEFAULT_GAS_PRICE: 100,
  /** Default max gas amount */
  DEFAULT_MAX_GAS_AMOUNT: 2000,
  /** Default transaction expiration time in seconds */
  DEFAULT_EXPIRATION_TIME: 600,
} as const;

/**
 * xAPT protocol version
 */
export const XAPT_PROTOCOL_VERSION = 1; 