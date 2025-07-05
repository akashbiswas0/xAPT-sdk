# @xapt/server

Server-side SDK for xAPT: HTTP 402 Aptos USDC payment middleware for Express.js applications. Enables instant, automated stablecoin payment verification over HTTP using the Aptos blockchain with Testnet USDC.

## 📦 Installation

```bash
npm install @xapt/server
```

## 🚀 Features

- **Express.js Middleware**: Seamless integration with Express.js applications
- **Payment Verification**: Automatic payment verification via external facilitator service
- **HTTP 402 Integration**: Native support for HTTP 402 "Payment Required" responses
- **Payment Rules**: Configurable payment rules per endpoint
- **TypeScript Support**: Full TypeScript support with strict typing
- **Error Handling**: Comprehensive error handling and logging
- **Header Management**: Automatic payment header generation and parsing
- **Facilitator Integration**: Built-in facilitator service client

## 📚 API Reference

### xaptPaymentMiddleware

The main middleware function for handling HTTP 402 payments.

```typescript
import { xaptPaymentMiddleware } from '@xapt/server';

app.use('/api/protected', xaptPaymentMiddleware(config));
```

#### Configuration

```typescript
interface PaymentMiddlewareConfig {
  facilitatorBaseUrl: string;           // Base URL of the facilitator service
  paymentRules: PaymentRules;           // Payment rules configuration
  timeout?: number;                     // Request timeout in ms (default: 30000)
  retries?: number;                     // Number of retry attempts (default: 3)
  enableLogging?: boolean;              // Enable detailed logging (default: false)
  customHeaders?: Record<string, string>; // Custom headers to include
}
```

#### Payment Rules

```typescript
interface PaymentRules {
  [endpoint: string]: PaymentRule;
}

interface PaymentRule {
  amount: string;                       // Payment amount in USDC (e.g., '0.01')
  recipientAddress: string;             // Recipient's Aptos address
  currency?: string;                    // Currency (default: 'USDC')
  description?: string;                 // Payment description
  expiresIn?: number;                   // Payment expiration in seconds
}
```

### FacilitatorClient

Client for communicating with the external facilitator service.

```typescript
import { FacilitatorClient } from '@xapt/server';

const facilitator = new FacilitatorClient({
  baseUrl: 'https://your-facilitator.com',
  timeout: 30000,
  retries: 3
});
```

#### Methods

##### requestPayment

Request a new payment from the facilitator service.

```typescript
async requestPayment(
  amount: string, 
  recipientAddress: string,
  options?: PaymentRequestOptions
): Promise<PaymentRequestResponse>
```

**Parameters:**
- `amount`: Payment amount in USDC
- `recipientAddress`: Recipient's Aptos address
- `options`: Optional payment request options

**Returns:** Promise<PaymentRequestResponse> - Payment request details

**Example:**
```typescript
const paymentRequest = await facilitator.requestPayment('0.01', '0x1234567890abcdef...');
console.log('Payment ID:', paymentRequest.paymentId);
```

##### verifyPayment

Verify a payment with the facilitator service.

```typescript
async verifyPayment(
  paymentId: string,
  transactionHash: string
): Promise<PaymentVerificationResponse>
```

**Parameters:**
- `paymentId`: Unique payment identifier
- `transactionHash`: Aptos transaction hash

**Returns:** Promise<PaymentVerificationResponse> - Payment verification result

**Example:**
```typescript
const verification = await facilitator.verifyPayment('payment-123', '0xabc123...');
console.log('Payment verified:', verification.verified);
```

### Utility Functions

#### generatePaymentId

Generate a unique payment identifier.

```typescript
import { generatePaymentId } from '@xapt/server';

const paymentId = generatePaymentId(); // Returns UUID string
```

#### parsePaymentHeaders

Parse payment headers from HTTP request.

```typescript
import { parsePaymentHeaders } from '@xapt/server';

const headers = parsePaymentHeaders(req.headers);
console.log('Payment amount:', headers.amount);
console.log('Recipient:', headers.recipient);
```

## 🔧 Usage Examples

### Basic Setup

```typescript
import express from 'express';
import { xaptPaymentMiddleware } from '@xapt/server';

const app = express();

// Configure payment rules
const paymentRules = {
  '/api/premium-content': {
    amount: '0.01',
    recipientAddress: '0x1234567890abcdef...',
    description: 'Premium content access'
  },
  '/api/download': {
    amount: '0.05',
    recipientAddress: '0x1234567890abcdef...',
    description: 'File download'
  }
};

// Apply middleware to protected routes
app.use('/api/premium-content', xaptPaymentMiddleware({
  facilitatorBaseUrl: 'https://your-facilitator.com',
  paymentRules
}));

// Your protected endpoint
app.get('/api/premium-content', (req, res) => {
  res.json({
    title: 'Premium Article',
    content: 'This is premium content that requires payment...',
    author: 'John Doe'
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Advanced Configuration

```typescript
import express from 'express';
import { xaptPaymentMiddleware } from '@xapt/server';

const app = express();

// Advanced payment configuration
const paymentConfig = {
  facilitatorBaseUrl: 'https://your-facilitator.com',
  paymentRules: {
    '/api/articles/*': {
      amount: '0.01',
      recipientAddress: '0x1234567890abcdef...',
      currency: 'USDC',
      description: 'Article access',
      expiresIn: 3600 // 1 hour
    },
    '/api/videos/*': {
      amount: '0.02',
      recipientAddress: '0x1234567890abcdef...',
      currency: 'USDC',
      description: 'Video access',
      expiresIn: 7200 // 2 hours
    }
  },
  timeout: 30000,
  retries: 3,
  enableLogging: true,
  customHeaders: {
    'X-Custom-Header': 'custom-value'
  }
};

// Apply middleware with advanced config
app.use('/api', xaptPaymentMiddleware(paymentConfig));
```

### Dynamic Payment Rules

```typescript
import express from 'express';
import { xaptPaymentMiddleware } from '@xapt/server';

const app = express();

// Dynamic payment configuration
const dynamicPaymentConfig = {
  facilitatorBaseUrl: 'https://your-facilitator.com',
  paymentRules: {
    '/api/dynamic-content': {
      amount: '0.01',
      recipientAddress: '0x1234567890abcdef...'
    }
  },
  // Dynamic amount calculation
  getAmount: (req: express.Request) => {
    const userTier = req.user?.tier || 'standard';
    const baseAmount = 0.01;
    
    switch (userTier) {
      case 'premium':
        return (baseAmount * 0.5).toString(); // 50% discount
      case 'vip':
        return (baseAmount * 0.25).toString(); // 75% discount
      default:
        return baseAmount.toString();
    }
  }
};

app.use('/api/dynamic-content', xaptPaymentMiddleware(dynamicPaymentConfig));
```

### Custom Error Handling

```typescript
import express from 'express';
import { xaptPaymentMiddleware } from '@xapt/server';

const app = express();

// Custom error handling middleware
const customPaymentMiddleware = (config) => {
  return (req, res, next) => {
    xaptPaymentMiddleware(config)(req, res, (error) => {
      if (error) {
        // Custom error handling
        switch (error.code) {
          case 'PAYMENT_REQUIRED':
            res.status(402).json({
              error: 'Payment required',
              amount: error.paymentDetails.amount,
              recipient: error.paymentDetails.recipient,
              paymentId: error.paymentDetails.paymentId
            });
            break;
          case 'PAYMENT_FAILED':
            res.status(400).json({
              error: 'Payment failed',
              reason: error.message
            });
            break;
          case 'PAYMENT_EXPIRED':
            res.status(410).json({
              error: 'Payment expired',
              paymentId: error.paymentId
            });
            break;
          default:
            res.status(500).json({
              error: 'Internal server error',
              message: error.message
            });
        }
      } else {
        next();
      }
    });
  };
};

app.use('/api/protected', customPaymentMiddleware({
  facilitatorBaseUrl: 'https://your-facilitator.com',
  paymentRules: {
    '/api/protected/*': {
      amount: '0.01',
      recipientAddress: '0x1234567890abcdef...'
    }
  }
}));
```

### Facilitator Service Integration

```typescript
import { FacilitatorClient } from '@xapt/server';

class PaymentService {
  private facilitator: FacilitatorClient;

  constructor() {
    this.facilitator = new FacilitatorClient({
      baseUrl: 'https://your-facilitator.com',
      timeout: 30000,
      retries: 3
    });
  }

  async processPayment(amount: string, recipient: string) {
    try {
      // Request payment
      const paymentRequest = await this.facilitator.requestPayment(amount, recipient);
      
      console.log('Payment requested:', paymentRequest.paymentId);
      
      // Wait for payment (in real app, this would be async)
      await this.waitForPayment(paymentRequest.paymentId);
      
      // Verify payment
      const verification = await this.facilitator.verifyPayment(
        paymentRequest.paymentId,
        paymentRequest.transactionHash
      );
      
      return verification.verified;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  private async waitForPayment(paymentId: string) {
    // Implementation to wait for payment confirmation
    return new Promise(resolve => setTimeout(resolve, 5000));
  }
}

// Usage
const paymentService = new PaymentService();
const isPaid = await paymentService.processPayment('0.01', '0x1234567890abcdef...');
```

### Multiple Payment Tiers

```typescript
import express from 'express';
import { xaptPaymentMiddleware } from '@xapt/server';

const app = express();

// Different payment tiers
const paymentTiers = {
  basic: {
    amount: '0.01',
    description: 'Basic access'
  },
  premium: {
    amount: '0.05',
    description: 'Premium access'
  },
  vip: {
    amount: '0.10',
    description: 'VIP access'
  }
};

// Apply different middleware for different tiers
Object.entries(paymentTiers).forEach(([tier, config]) => {
  app.use(`/api/${tier}`, xaptPaymentMiddleware({
    facilitatorBaseUrl: 'https://your-facilitator.com',
    paymentRules: {
      [`/api/${tier}/*`]: {
        amount: config.amount,
        recipientAddress: '0x1234567890abcdef...',
        description: config.description
      }
    }
  }));
});

// Tier-specific endpoints
app.get('/api/basic/content', (req, res) => {
  res.json({ content: 'Basic content' });
});

app.get('/api/premium/content', (req, res) => {
  res.json({ content: 'Premium content' });
});

app.get('/api/vip/content', (req, res) => {
  res.json({ content: 'VIP content' });
});
```

## 🎯 Use Cases

### Content Monetization Platform

```typescript
import express from 'express';
import { xaptPaymentMiddleware } from '@xapt/server';

const app = express();

// Content monetization setup
const contentPaymentRules = {
  '/api/articles/*': {
    amount: '0.01',
    recipientAddress: '0x1234567890abcdef...',
    description: 'Article access'
  },
  '/api/videos/*': {
    amount: '0.02',
    recipientAddress: '0x1234567890abcdef...',
    description: 'Video access'
  },
  '/api/downloads/*': {
    amount: '0.05',
    recipientAddress: '0x1234567890abcdef...',
    description: 'File download'
  }
};

app.use('/api', xaptPaymentMiddleware({
  facilitatorBaseUrl: 'https://your-facilitator.com',
  paymentRules: contentPaymentRules
}));

// Content endpoints
app.get('/api/articles/:id', (req, res) => {
  const articleId = req.params.id;
  res.json({
    id: articleId,
    title: 'Premium Article',
    content: 'This is premium content...'
  });
});
```

### API Monetization Service

```typescript
import express from 'express';
import { xaptPaymentMiddleware } from '@xapt/server';

const app = express();

// API monetization setup
const apiPaymentRules = {
  '/api/ai/generate': {
    amount: '0.01',
    recipientAddress: '0x1234567890abcdef...',
    description: 'AI text generation'
  },
  '/api/data/prices': {
    amount: '0.005',
    recipientAddress: '0x1234567890abcdef...',
    description: 'Real-time price data'
  },
  '/api/analytics/report': {
    amount: '0.02',
    recipientAddress: '0x1234567890abcdef...',
    description: 'Analytics report'
  }
};

app.use('/api', xaptPaymentMiddleware({
  facilitatorBaseUrl: 'https://your-facilitator.com',
  paymentRules: apiPaymentRules
}));

// API endpoints
app.post('/api/ai/generate', (req, res) => {
  const { prompt } = req.body;
  res.json({
    generated: `AI generated content for: ${prompt}`,
    timestamp: new Date().toISOString()
  });
});
```

## 🧪 Testing

```typescript
import express from 'express';
import request from 'supertest';
import { xaptPaymentMiddleware } from '@xapt/server';

// Test setup
const createTestApp = () => {
  const app = express();
  
  app.use('/api/test', xaptPaymentMiddleware({
    facilitatorBaseUrl: 'https://test-facilitator.com',
    paymentRules: {
      '/api/test': {
        amount: '0.01',
        recipientAddress: '0x1234567890abcdef...'
      }
    }
  }));
  
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Test successful' });
  });
  
  return app;
};

// Test cases
describe('Payment Middleware', () => {
  it('should require payment for protected endpoint', async () => {
    const app = createTestApp();
    
    const response = await request(app)
      .get('/api/test')
      .expect(402);
    
    expect(response.body.error).toBe('Payment required');
    expect(response.body.amount).toBe('0.01');
  });
});
```

## 📋 Requirements

- Node.js 16+
- TypeScript 4.5+
- Express.js 4.18+
- Aptos blockchain access
- External facilitator service

## 🔗 Dependencies

- `@xapt/common` - Shared types and utilities
- `express` - Express.js web framework

## 🔗 Related Packages

- [@xapt/common](./../common) - Shared types, constants, and utilities
- [@xapt/client](./../client) - Client-side SDK for browsers and AI agents

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 🔗 Links

- [Aptos Documentation](https://aptos.dev/)
- [USDC on Aptos](https://developers.circle.com/developers/usdc-on-aptos)
- [HTTP 402 Specification](https://httpwg.org/specs/rfc9110.html#status.402)
- [Express.js Documentation](https://expressjs.com/) 