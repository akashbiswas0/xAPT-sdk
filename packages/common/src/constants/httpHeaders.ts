/**
 * HTTP header names for xAPT payment protocol
 */
export const X_APTOS_PAYMENT_REQUIRED_HEADER = 'X-Aptos-Payment-Required';
export const X_APTOS_PAYMENT_HEADER = 'X-Aptos-Payment';
export const X_APTOS_PAYMENT_RESPONSE_HEADER = 'X-Aptos-Payment-Response';

/**
 * Content type for JSON headers
 */
export const CONTENT_TYPE_JSON = 'application/json';

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  PAYMENT_REQUIRED: 402,
  BAD_REQUEST: 400,
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
} as const; 