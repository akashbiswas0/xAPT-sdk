# xAPT SDK Documentation

Welcome to the xAPT SDK documentation. This SDK enables instant, automated stablecoin payments directly over HTTP, leveraging the Aptos blockchain with Testnet USDC.

## 📚 Documentation Sections

- [Client Usage Guide](client-usage.md) - How to use the client SDK for payments
- [Server Usage Guide](server-usage.md) - How to implement payment middleware
- [Facilitator API Reference](facilitator-api.md) - External facilitator service API

## 🏗️ Architecture Overview

The xAPT SDK is built as a monorepo with three main packages:

### `@xapt/common`
Shared types, interfaces, constants, and utility functions used by both client and server packages.

**Key exports:**
- Payment payload interfaces (`AptosPaymentRequiredPayload`, `AptosPaymentPayload`)
- HTTP header constants (`X_APTOS_PAYMENT_REQUIRED_HEADER`, etc.)
- Aptos constants (`APTOS_TESTNET_USDC_ADDRESS`, `USDC_CONFIG`)
- Error handling (`XaptError`, `XaptErrorCode`)

### `@xapt/client`
Client-side library for web browsers and AI agents to initiate payments.

**Key features:**
- `AptosX402Client` class for handling HTTP 402 responses
- Wallet integration with Aptos wallet adapters
- Automatic payment flow handling
- Fetch interceptor for seamless integration

### `@xapt/server`
Server-side library with Express.js middleware for payment verification.

**Key features:**
- `xaptPaymentMiddleware` for Express.js applications
- Payment rule configuration
- Integration with external facilitator service
- Automatic 402 response generation

## 🚀 Quick Start

### Installation

```bash
npm install @xapt/client @xapt/server
```

### Basic Client Usage

```typescript
import { AptosX402Client } from '@xapt/client';

const client = new AptosX402Client(walletAdapter);
const response = await client.fetchWithPayment('/api/premium-content');
```

### Basic Server Usage

```typescript
import { xaptPaymentMiddleware } from '@xapt/server';

app.use('/api/premium-content', xaptPaymentMiddleware({
  facilitatorBaseUrl: 'https://your-facilitator.com',
  paymentRules: {
    '/api/premium-content': {
      amount: '0.01',
      recipientAddress: '0x...'
    }
  }
}));
```

## 🔧 Development

### Building the SDK

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Run linting
npm run lint
```

### Project Structure

```
xapt/
├── packages/
│   ├── common/          # Shared types and utilities
│   ├── client/          # Client SDK
│   └── server/          # Server middleware
├── docs/               # Documentation
├── scripts/            # Build and test scripts
└── examples/           # Usage examples
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

MIT License - see LICENSE file for details. 