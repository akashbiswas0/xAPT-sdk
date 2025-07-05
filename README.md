# xAPT SDK

A robust, open-source SDK for instant, automated stablecoin payments directly over HTTP, leveraging the Aptos blockchain with Testnet USDC. Inspired by Coinbase's x402 for Aptos.

## 🚀 Features

- **HTTP 402 Integration**: Seamless integration with HTTP 402 "Payment Required" status codes
- **Aptos Testnet USDC**: Built specifically for USDC payments on Aptos Testnet
- **Machine-to-Machine (M2M)**: Enable automated micro-payments for digital resources
- **Human-to-Machine (H2M)**: Facilitate user payments through wallet integration
- **TypeScript First**: Full TypeScript support with strict typing
- **Modular Architecture**: Clean separation between client and server components

## 📦 Packages

This monorepo contains three main packages:

- **`@xapt/common`**: Shared types, interfaces, constants, and utility functions
- **`@xapt/client`**: Client-side library for web browsers and AI agents
- **`@xapt/server`**: Server-side library with Express.js middleware

## 🏗️ Architecture

```
xapt/
├── packages/
│   ├── common/          # Shared types and utilities
│   ├── client/          # Client SDK for payments
│   └── server/          # Server middleware for payment verification
├── docs/               # Documentation
└── scripts/            # Build and test scripts
```

## 🚦 Quick Start

### Installation

```bash
npm install @xapt/client @xapt/server
```

### Client Usage

```typescript
import { AptosX402Client } from '@xapt/client';

const client = new AptosX402Client(walletAdapter);
const response = await client.fetchWithPayment('/api/premium-content');
```

### Server Usage

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

## 📚 Documentation

- [Client Usage Guide](docs/client-usage.md)
- [Server Usage Guide](docs/server-usage.md)
- [Facilitator API Reference](docs/facilitator-api.md)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [Aptos Documentation](https://aptos.dev/)
- [HTTP 402 Specification](https://httpwg.org/specs/rfc9110.html#status.402)
- [USDC on Aptos](https://developers.circle.com/developers/usdc-on-aptos) 