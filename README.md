# x-APT SDK

A robust, open-source SDK for instant, automated stablecoin payments directly over HTTP, leveraging the Aptos blockchain with APT tokens. Inspired by  x402 for Aptos, this SDK enables seamless machine-to-machine (M2M) payment flows.


### Spending account txn : https://explorer.aptoslabs.com/account/0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74?network=mainnet

### Saving account txn : https://explorer.aptoslabs.com/account/0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17?network=mainnet

## 🎯 SDK Description

The xAPT SDK is a comprehensive solution for implementing HTTP 402 "Payment Required" flows on the Aptos blockchain. It provides a complete ecosystem for developers to build applications that require micro-payments for digital resources, API access, or premium content.

### Core Philosophy
- **Seamless Integration**: Drop-in middleware and client libraries
- **Blockchain Native**: Built specifically for Aptos with APT token support
- **Developer Friendly**: TypeScript-first with comprehensive type safety
- **Production Ready**: Battle-tested with real blockchain transactions
- **Modular Design**: Clean separation between client, server, and shared components

## 🚀 Features

### 🔧 Core Features
- **HTTP 402 Integration**: Seamless integration with HTTP 402 "Payment Required" status codes
- **Aptos APT Payments**: Built specifically for APT token payments on Aptos blockchain
- **Machine-to-Machine (M2M)**: Enable automated micro-payments for digital resources
- **Human-to-Machine (H2M)**: Facilitate user payments through wallet integration
- **TypeScript First**: Full TypeScript support with strict typing and comprehensive interfaces
- **Modular Architecture**: Clean separation between client and server components

### 💼 Client Features
- **Automatic Payment Handling**: Seamlessly handles HTTP 402 responses
- **Wallet Integration**: Supports any Aptos wallet through adapter pattern
- **Fetch Interceptor**: Drop-in replacement for fetch API with payment handling
- **Error Handling**: Comprehensive error handling with specific error types
- **React Support**: Ready-to-use React hooks and components
- **Transaction Management**: Automatic transaction creation and submission

### 🖥️ Server Features
- **Express.js Middleware**: Drop-in middleware for payment verification
- **Payment Rules**: Configurable payment amounts per endpoint
- **Facilitator Integration**: Built-in integration with payment facilitator services
- **Security**: Comprehensive validation and security checks
- **Logging**: Built-in logging for payment events and debugging
- **Rate Limiting**: Support for rate limiting and abuse prevention

### 🔐 Security Features
- **Transaction Verification**: Real-time transaction verification on blockchain
- **Payment Validation**: Comprehensive payment payload validation
- **Address Validation**: Aptos address format validation
- **HTTPS Enforcement**: Production-ready HTTPS configuration
- **Rate Limiting**: Built-in protection against payment abuse

### 🛠️ Developer Experience
- **Comprehensive Documentation**: Detailed guides and API references
- **Type Safety**: Full TypeScript support with strict typing
- **Testing**: Extensive test coverage with Jest
- **Examples**: Complete working examples for browser and server
- **Showcase**: Real blockchain integration demo with smart wallet

## 📦 Packages

This monorepo contains three main packages:

### `@xapt/common` (v1.2.0)
Shared types, interfaces, constants, and utility functions used across all packages.
- https://www.npmjs.com/package/@xapt/common

**Key Exports:**
- `AptosPaymentRequiredPayload` - Payment requirement interface
- `AptosPaymentPayload` - Payment response interface
- `PaymentRule` - Server payment configuration
- `XaptMiddlewareConfig` - Middleware configuration
- `WalletAdapter` - Wallet integration interface
- Aptos constants and utilities

### `@xapt/client` (v1.2.0)
Client-side library for web browsers and AI agents to handle payments.
- https://www.npmjs.com/package/@xapt/client

**Key Exports:**
- `AptosX402Client` - Main client class for payment handling
- `withPaymentHandling` - Fetch interceptor for automatic payments
- `WalletAdapter` - Interface for wallet integration
- Browser-compatible payment flows

### `@xapt/server` (v1.2.0)
Server-side library with Express.js middleware for payment verification.
- https://www.npmjs.com/package/@xapt/server

**Key Exports:**
- `xaptPaymentMiddleware` - Express.js middleware for payment verification
- `PaymentVerificationRequest` - Facilitator service integration
- `PaymentVerificationResponse` - Payment verification results
- Server-side payment validation

## 🚦 Quick Start

### Installation

```bash
# Install all packages
npm install @xapt/client @xapt/server @xapt/common

# Or install individually
npm install @xapt/client    # For client-side applications
npm install @xapt/server    # For server-side applications
npm install @xapt/common    # For shared types and utilities
```

### Client Usage

#### 1. Create a Wallet Adapter

```typescript
import { WalletAdapter } from '@xapt/client';

class MyWalletAdapter implements WalletAdapter {
  isConnected(): boolean { /* ... */ }
  getAccountAddress(): string | null { /* ... */ }
  async signTransaction(payload: any): Promise<any> { /* ... */ }
  async signAndSubmitTransaction(payload: any): Promise<string> { /* ... */ }
  async connect(): Promise<void> { /* ... */ }
  async disconnect(): Promise<void> { /* ... */ }
}
```

#### 2. Initialize the Client

```typescript
import { AptosX402Client } from '@xapt/client';

const walletAdapter = new MyWalletAdapter();
const client = new AptosX402Client(walletAdapter, {
  nodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1' // Optional
});
```

#### 3. Make Payment Requests

```typescript
try {
  const response = await client.fetchWithPayment('/api/premium-content');
  const data = await response.json();
  console.log('Access granted:', data);
} catch (error) {
  console.error('Payment failed:', error);
}
```

#### 4. Using Fetch Interceptor

```typescript
import { withPaymentHandling } from '@xapt/client';

const paymentFetch = withPaymentHandling(client);

// Use paymentFetch instead of fetch
const response = await paymentFetch('/api/premium-content');
```

### Server Usage

#### 1. Configure Payment Rules

```typescript
import { xaptPaymentMiddleware } from '@xapt/server';

const paymentConfig = {
  facilitatorBaseUrl: 'https://your-facilitator-service.com',
  paymentRules: {
    '/api/premium-content': {
      amount: '0.01',
      recipientAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      description: 'Access to premium content',
      currencySymbol: 'APT',
    },
    '/api/download': {
      amount: '0.005',
      recipientAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      description: 'File download',
      currencySymbol: 'APT',
    },
  },
  timeout: 30000, // 30 seconds
};
```

#### 2. Apply Middleware

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

#### 3. Define Route Handlers

```typescript
app.get('/api/premium-content', (req, res) => {
  res.json({
    message: 'Welcome to premium content!',
    data: 'This content is only available after payment.',
    timestamp: new Date().toISOString(),
  });
});
```

## 🏗️ Folder Structure

```
xapt/
├── packages/
│   ├── common/                    # Shared types and utilities
│   │   ├── src/
│   │   │   ├── constants/         # Aptos constants and configurations
│   │   │   │   ├── aptos.ts       # Aptos-specific constants
│   │   │   │   ├── errorCodes.ts  # Error code definitions
│   │   │   │   ├── httpHeaders.ts # HTTP header constants
│   │   │   │   └── index.ts       # Main constants export
│   │   │   ├── types/             # TypeScript type definitions
│   │   │   │   ├── aptos.ts       # Aptos-specific types
│   │   │   │   ├── commonTypes.ts # Shared payment types
│   │   │   │   └── index.ts       # Main types export
│   │   │   ├── utils/             # Utility functions
│   │   │   │   ├── validation.ts  # Validation utilities
│   │   │   │   └── index.ts       # Main utils export
│   │   │   └── index.ts           # Main package export
│   │   ├── tests/                 # Unit tests
│   │   ├── package.json           # Package configuration
│   │   └── tsconfig.json          # TypeScript configuration
│   │
│   ├── client/                    # Client-side SDK
│   │   ├── src/
│   │   │   ├── AptosX402Client.ts # Main client implementation
│   │   │   ├── http/              # HTTP utilities
│   │   │   │   ├── fetchInterceptor.ts # Fetch interceptor
│   │   │   │   └── index.ts       # HTTP utilities export
│   │   │   ├── wallet/            # Wallet integration
│   │   │   │   ├── walletAdapter.ts # Wallet adapter interface
│   │   │   │   └── index.ts       # Wallet utilities export
│   │   │   └── index.ts           # Main package export
│   │   ├── examples/              # Usage examples
│   │   │   └── browser-app/       # Browser application example
│   │   ├── tests/                 # Unit tests
│   │   ├── package.json           # Package configuration
│   │   └── tsconfig.json          # TypeScript configuration
│   │
│   └── server/                    # Server-side SDK
│       ├── src/
│       │   ├── facilitator/       # Facilitator service integration
│       │   │   ├── facilitatorClient.ts # Facilitator client
│       │   │   └── index.ts       # Facilitator utilities export
│       │   ├── middleware/        # Express.js middleware
│       │   │   ├── xaptPaymentMiddleware.ts # Payment middleware
│       │   │   └── index.ts       # Middleware export
│       │   ├── utils/             # Server utilities
│       │   │   ├── headerUtils.ts # Header processing utilities
│       │   │   └── index.ts       # Server utils export
│       │   └── index.ts           # Main package export
│       ├── examples/              # Usage examples
│       │   └── express-server/    # Express.js server example
│       ├── tests/                 # Unit tests
│       ├── package.json           # Package configuration
│       └── tsconfig.json          # TypeScript configuration
│
├── docs/                          # Documentation
│   ├── client-usage.md            # Client usage guide
│   ├── server-usage.md            # Server usage guide
│   ├── facilitator-api.md         # Facilitator API reference
│   └── index.md                   # Documentation index
│
├── showcase/                      # Complete implementation demo
│   ├── src/
│   │   ├── client/                # Demo client implementations
│   │   │   ├── demoClient.ts      # Base demo client
│   │   │   ├── realBlockchainDemoClient.ts # Real blockchain demo
│   │   │   └── mockBlockchainDemoClient.ts # Mock blockchain demo
│   │   ├── server/                # Demo server implementations
│   │   │   ├── demoServer.ts      # Demo server
│   │   │   └── simpleFacilitator.ts # Simple facilitator service
│   │   ├── wallet/                # Wallet implementations
│   │   │   ├── smartWalletAdapter.ts # Smart wallet with auto-refill
│   │   │   ├── realAptosWalletAdapter.ts # Real Aptos wallet
│   │   │   └── mockAptosWalletAdapter.ts # Mock wallet for testing
│   │   └── types/                 # Demo-specific types
│   ├── README.md                  # Showcase documentation
│   └── package.json               # Showcase dependencies
│
├── scripts/                       # Build and development scripts
│   ├── build.sh                   # Build script
│   └── test.sh                    # Test script
│
├── package.json                   # Root package configuration
├── tsconfig.json                  # Root TypeScript configuration
└── README.md                      # This file
```

## 🛠️ Tech Stack

### Core Technologies
- **TypeScript 5.0+**: Primary language with strict typing
- **Node.js 18+**: Runtime environment
- **npm**: Package manager and monorepo management

### Blockchain & Payments
- **Aptos Blockchain**: Layer 1 blockchain for transactions
- **APT Tokens**: Native token for payments
- **Aptos Labs SDK**: Official Aptos TypeScript SDK
- **Wallet Adapter Pattern**: Flexible wallet integration

### Client-Side
- **Fetch API**: Modern HTTP client with interception
- **Wallet Integration**: Support for any Aptos wallet
- **React Support**: Ready-to-use React components
- **Browser Compatibility**: Works in all modern browsers

### Server-Side
- **Express.js**: Web framework for middleware
- **HTTP 402**: Payment Required status code handling
- **Middleware Pattern**: Modular payment verification
- **Facilitator Services**: Payment verification integration

### Development & Testing
- **Jest**: Unit testing framework
- **ESLint**: Code linting and formatting
- **TypeScript Compiler**: Type checking and compilation
- **Monorepo Structure**: Lerna-style package management

### Documentation & Examples
- **Markdown**: Documentation format
- **Code Examples**: Complete working examples
- **Showcase Application**: Real blockchain integration demo
- **API Documentation**: Comprehensive type definitions

### Security & Validation
- **Address Validation**: Aptos address format checking
- **Transaction Verification**: Real-time blockchain verification
- **Payload Validation**: Comprehensive input validation
- **Error Handling**: Specific error types and messages

### Performance & Monitoring
- **Request Interception**: Efficient payment handling
- **Logging**: Built-in payment event logging
- **Rate Limiting**: Abuse prevention mechanisms
- **Timeout Handling**: Configurable request timeouts

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

# Run showcase demo
cd showcase
npm install
npm run demo:real
```

## 📚 Documentation

- [Client Usage Guide](docs/client-usage.md) - Complete client implementation guide
- [Server Usage Guide](docs/server-usage.md) - Server middleware implementation
- [Facilitator API Reference](docs/facilitator-api.md) - Payment verification API
- [Showcase Demo](showcase/README.md) - Real blockchain integration example


