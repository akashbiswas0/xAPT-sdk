# Server Usage Guide

This guide explains how to use the `@xapt/server` package to implement HTTP 402 payment middleware in your Express.js applications.

## Installation

```bash
npm install @xapt/server
```

## Basic Usage

### 1. Configure Payment Rules

Define which endpoints require payments and their associated amounts:

```typescript
import { xaptPaymentMiddleware } from '@xapt/server';

const paymentConfig = {
  facilitatorBaseUrl: 'https://your-facilitator-service.com',
  paymentRules: {
    '/api/premium-content': {
      amount: '0.01',
      recipientAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      description: 'Access to premium content',
      currencySymbol: 'USDC',
    },
    '/api/download': {
      amount: '0.005',
      recipientAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      description: 'File download',
      currencySymbol: 'USDC',
    },
  },
  timeout: 30000, // 30 seconds
};
```

### 2. Apply Middleware

Apply the middleware to your Express.js application:

```typescript
import express from 'express';
import { xaptPaymentMiddleware } from '@xapt/server';

const app = express();

// Apply to specific routes
app.use('/api/premium-content', xaptPaymentMiddleware(paymentConfig));
app.use('/api/download', xaptPaymentMiddleware(paymentConfig));

// Or apply to all routes under a prefix
app.use('/api', xaptPaymentMiddleware(paymentConfig));
```

### 3. Define Route Handlers

Your route handlers will only be called after successful payment verification:

```typescript
app.get('/api/premium-content', (req, res) => {
  res.json({
    message: 'Welcome to premium content!',
    data: 'This content is only available after payment.',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/download', (req, res) => {
  res.json({
    message: 'File download ready',
    downloadUrl: 'https://example.com/file.zip',
    timestamp: new Date().toISOString(),
  });
});
```

## Advanced Configuration

### Payment Rule Options

```typescript
interface PaymentRule {
  /** USDC amount required for this endpoint */
  amount: string;
  /** Aptos address to receive the payment */
  recipientAddress: string;
  /** Optional: Description of what the payment is for */
  description?: string;
  /** Optional: Currency symbol (defaults to "USDC") */
  currencySymbol?: string;
}
```

### Middleware Configuration

```typescript
interface XaptMiddlewareConfig {
  /** Base URL of the Aptos Payment Facilitator Service */
  facilitatorBaseUrl: string;
  /** Mapping of API paths to payment requirements */
  paymentRules: Record<string, PaymentRule>;
  /** Optional: Timeout for facilitator requests in milliseconds */
  timeout?: number;
  /** Optional: Custom headers to include in facilitator requests */
  headers?: Record<string, string>;
}
```

## Payment Flow

The middleware handles the following flow automatically:

1. **Request arrives** - Client makes a request to a protected endpoint
2. **Check payment header** - Middleware checks for `X-Aptos-Payment` header
3. **No payment provided** - Returns HTTP 402 with `X-Aptos-Payment-Required` header
4. **Payment provided** - Verifies payment with facilitator service
5. **Payment valid** - Calls the route handler
6. **Payment invalid** - Returns HTTP 402 with error details

## Error Handling

The middleware handles various error scenarios:

```typescript
// Add error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  
  if (err.message.includes('Facilitator service')) {
    res.status(503).json({
      error: 'Payment Service Unavailable',
      message: 'Payment verification service is temporarily unavailable',
    });
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
});
```

## Logging and Monitoring

The middleware provides built-in logging for payment events:

```typescript
// Payment verification success
console.log(`Payment verified for ${path}: ${transactionHash}`);

// Payment verification failure
console.error(`Payment verification failed for ${path}: ${reason}`);

// Middleware errors
console.error('xAPT middleware error:', error);
```

## Security Considerations

### 1. Validate Payment Rules

Ensure payment rules are properly configured:

```typescript
function validatePaymentConfig(config: XaptMiddlewareConfig) {
  for (const [path, rule] of Object.entries(config.paymentRules)) {
    if (!rule.amount || !rule.recipientAddress) {
      throw new Error(`Invalid payment rule for ${path}`);
    }
    
    // Validate Aptos address format
    if (!/^0x[a-fA-F0-9]{64}$/.test(rule.recipientAddress)) {
      throw new Error(`Invalid recipient address for ${path}`);
    }
  }
}
```

### 2. Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many payment attempts',
});

app.use('/api', paymentLimiter);
```

### 3. HTTPS Only

Ensure your application runs over HTTPS in production:

```typescript
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
```

## Testing

### Unit Tests

Test your middleware configuration:

```typescript
import request from 'supertest';
import { xaptPaymentMiddleware } from '@xapt/server';

describe('xAPT Middleware', () => {
  it('should return 402 for protected routes without payment', async () => {
    const app = express();
    app.use('/api/test', xaptPaymentMiddleware({
      facilitatorBaseUrl: 'https://test-facilitator.com',
      paymentRules: {
        '/api/test': {
          amount: '0.01',
          recipientAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        }
      }
    }));
    
    app.get('/api/test', (req, res) => res.json({ success: true }));
    
    const response = await request(app).get('/api/test');
    expect(response.status).toBe(402);
    expect(response.headers['x-aptos-payment-required']).toBeDefined();
  });
});
```

### Integration Tests

Test with a mock facilitator service:

```typescript
// Mock facilitator service
const mockFacilitator = {
  verifyPayment: jest.fn().mockResolvedValue({
    isValid: true,
    transactionHash: 'mock-tx-hash',
    amountTransferred: '0.01',
  }),
};
```

## Performance Optimization

### 1. Caching

Consider caching payment verification results:

```typescript
const paymentCache = new Map();

// In middleware
const cacheKey = `${paymentId}-${transactionHash}`;
if (paymentCache.has(cacheKey)) {
  return paymentCache.get(cacheKey);
}
```

### 2. Connection Pooling

Use connection pooling for facilitator requests:

```typescript
import { Agent } from 'http';

const agent = new Agent({
  keepAlive: true,
  maxSockets: 10,
});

// Pass agent to facilitator client
```

## Examples

See the `packages/server/examples/express-server/` directory for a complete working example.

## Troubleshooting

### Common Issues

1. **"Facilitator service error"** - Check facilitator service availability
2. **"Payment verification failed"** - Verify payment payload format
3. **"Invalid payment header"** - Check client-side payment construction
4. **"Timeout"** - Increase timeout or check network connectivity

### Debug Mode

Enable debug logging:

```typescript
const debug = require('debug')('xapt:middleware');

// In middleware
debug('Processing payment for path:', path);
debug('Payment verification result:', verificationResult);
``` 