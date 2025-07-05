/**
 * Validate if a string is a valid Aptos address (0x-prefixed, 64 hex chars)
 */
export function isValidAptosAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
}

/**
 * Validate if a string is a valid USDC amount (decimal, up to 6 decimals)
 */
export function isValidUsdcAmount(amount: string): boolean {
  return /^\d+(\.\d{1,6})?$/.test(amount);
}

/**
 * Validate if a string is a valid payment ID (UUID v4)
 */
export function isValidPaymentId(paymentId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(paymentId);
}

/**
 * Validate if an object is a valid AptosPaymentRequiredPayload (basic check)
 */
export function isValidPaymentRequiredPayload(payload: any): boolean {
  return (
    typeof payload === 'object' &&
    typeof payload.x402Version === 'number' &&
    typeof payload.paymentId === 'string' &&
    isValidPaymentId(payload.paymentId) &&
    typeof payload.amount === 'string' &&
    isValidUsdcAmount(payload.amount) &&
    typeof payload.tokenAddress === 'string' &&
    isValidAptosAddress(payload.recipientAddress) &&
    typeof payload.network === 'string'
  );
}

/**
 * Validate if an object is a valid AptosPaymentPayload (basic check)
 */
export function isValidPaymentPayload(payload: any): boolean {
  return (
    typeof payload === 'object' &&
    typeof payload.x402Version === 'number' &&
    typeof payload.paymentId === 'string' &&
    isValidPaymentId(payload.paymentId)
  );
} 