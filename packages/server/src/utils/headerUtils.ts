/**
 * Utility functions for header parsing and payment ID generation
 */

/**
 * Generate a unique payment ID (UUID v4)
 * @returns UUID v4 string
 */
export function generatePaymentId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Parse and validate a payment header
 * @param headerValue Raw header value
 * @returns Parsed payment payload or null if invalid
 */
export function parsePaymentHeader(headerValue: string): any {
  try {
    const parsed = JSON.parse(headerValue);
    return parsed;
  } catch (error) {
    console.error('Failed to parse payment header:', error);
    return null;
  }
}

/**
 * Validate payment header format
 * @param headerValue Raw header value
 * @returns True if header is valid
 */
export function isValidPaymentHeader(headerValue: string): boolean {
  const parsed = parsePaymentHeader(headerValue);
  return parsed !== null && typeof parsed === 'object';
} 