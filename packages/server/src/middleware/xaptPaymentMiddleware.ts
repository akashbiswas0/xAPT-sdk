/**
 * xAPT Payment Middleware
 * 
 * Handles HTTP 402 Payment Required responses and payment verification
 * for APT token payments on Aptos blockchain.
 */
import { Request, Response, NextFunction } from 'express';
import { FacilitatorClient } from '../facilitator/facilitatorClient';
import { 
  XaptMiddlewareConfig, 
  PaymentRule,
  DEFAULT_APTOS_TOKEN_ADDRESS,
  DEFAULT_APTOS_TOKEN_DECIMALS,
  DEFAULT_APTOS_TOKEN_SYMBOL
} from '@xapt/common';

export function xaptPaymentMiddleware(config: XaptMiddlewareConfig) {
  const facilitatorClient = new FacilitatorClient(config.facilitatorBaseUrl, {
    timeout: config.timeout,
    headers: config.headers,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Find payment rule for this endpoint
      const paymentRule = findPaymentRule(req.path, config.paymentRules);
      
      if (!paymentRule) {
        return next();
      }

      // Check if payment header is present
      const paymentHeader = req.headers['x-aptos-payment'] as string;
      
      if (!paymentHeader) {
        // Return 402 Payment Required with APT payment details
        return sendPaymentRequired(res, req.path, paymentRule);
      }

      // Verify payment with facilitator service
      const verificationResult = await verifyPayment(
        facilitatorClient, 
        paymentHeader, 
        paymentRule
      );

      if (!verificationResult.isValid) {
        return res.status(402).json({
          error: 'Payment verification failed',
          reason: verificationResult.reason
        });
      }

      // Payment verified, continue to next middleware
      next();
    } catch (error) {
      console.error('Payment middleware error:', error);
      res.status(500).json({
        error: 'Payment processing error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * Find payment rule for the given path
 */
function findPaymentRule(path: string, paymentRules: Record<string, PaymentRule>): PaymentRule | null {
  // Exact match first
  if (paymentRules[path]) {
    return paymentRules[path];
  }

  // Pattern matching (simple implementation)
  for (const [pattern, rule] of Object.entries(paymentRules)) {
    if (path.startsWith(pattern)) {
      return rule;
    }
  }

  return null;
}

/**
 * Send HTTP 402 Payment Required response with APT payment details
 */
function sendPaymentRequired(res: Response, path: string, paymentRule: PaymentRule) {
  const paymentRequired = {
    x402Version: 1,
    paymentId: generatePaymentId(),
    amount: paymentRule.amount,
    tokenAddress: DEFAULT_APTOS_TOKEN_ADDRESS,
    recipientAddress: paymentRule.recipientAddress,
    network: 'testnet',
    currencySymbol: DEFAULT_APTOS_TOKEN_SYMBOL,
    description: paymentRule.description || `Payment for ${path}`,
    timestamp: Date.now()
  };

  res.status(402)
    .set('X-Aptos-Payment-Required', JSON.stringify(paymentRequired))
    .json({
      error: 'Payment Required',
      message: `Payment of ${paymentRule.amount} ${DEFAULT_APTOS_TOKEN_SYMBOL} required`,
      paymentDetails: {
        amount: paymentRule.amount,
        currency: DEFAULT_APTOS_TOKEN_SYMBOL,
        recipient: paymentRule.recipientAddress,
        description: paymentRule.description
      }
    });
}

/**
 * Verify payment with facilitator service
 */
async function verifyPayment(
  facilitatorClient: FacilitatorClient,
  paymentHeader: string,
  paymentRule: PaymentRule
) {
  try {
    const paymentPayload = JSON.parse(paymentHeader);
    
    const verificationRequest = {
      paymentId: paymentPayload.paymentId,
      transactionHash: paymentPayload.transactionHash,
      expectedAmount: paymentRule.amount,
      expectedTokenAddress: DEFAULT_APTOS_TOKEN_ADDRESS,
      expectedRecipientAddress: paymentRule.recipientAddress,
      expectedNetwork: 'testnet'
    };

    return await facilitatorClient.verifyPayment(verificationRequest);
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      isValid: false,
      reason: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Generate unique payment ID
 */
function generatePaymentId(): string {
  return 'payment_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
} 