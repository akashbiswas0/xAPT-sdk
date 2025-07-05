# @xapt/client

Client-side SDK for xAPT: HTTP 402 Aptos USDC payments for browsers and AI agents. Enables instant, automated stablecoin payments over HTTP using the Aptos blockchain with Testnet USDC.

## 📦 Installation

```bash
npm install @xapt/client
```

## 🚀 Features

- **HTTP 402 Integration**: Automatic handling of HTTP 402 "Payment Required" responses
- **Wallet Integration**: Seamless wallet connection and transaction signing
- **Automatic Retries**: Smart retry logic for failed payments
- **TypeScript Support**: Full TypeScript support with strict typing
- **Browser Compatible**: Works in all modern browsers
- **AI Agent Ready**: Designed for automated AI agent payments
- **Error Handling**: Comprehensive error handling and recovery
- **Payment Headers**: Automatic payment header management

## 📚 API Reference

### AptosX402Client

The main client class for handling HTTP 402 payments.

```typescript
import { AptosX402Client } from '@xapt/client';

const client = new AptosX402Client(walletAdapter);
```

#### Constructor

```typescript
constructor(walletAdapter: WalletAdapter, options?: ClientOptions)
```

**Parameters:**
- `walletAdapter`: Implementation of the WalletAdapter interface
- `options`: Optional client configuration

**Options:**
```typescript
interface ClientOptions {
  maxRetries?: number;           // Maximum retry attempts (default: 3)
  retryDelay?: number;           // Delay between retries in ms (default: 1000)
  timeout?: number;              // Request timeout in ms (default: 30000)
  network?: string;              // Aptos network (default: 'testnet')
}
```

#### Methods

##### fetchWithPayment

Makes an HTTP request and automatically handles payment if required.

```typescript
async fetchWithPayment(
  url: string, 
  options?: RequestInit
): Promise<Response>
```

**Parameters:**
- `url`: The URL to fetch
- `options`: Standard fetch options (method, headers, body, etc.)

**Returns:** Promise<Response> - The response from the server

**Example:**
```typescript
const response = await client.fetchWithPayment('/api/premium-content');
const data = await response.json();
```

##### makePayment

Manually initiate a payment transaction.

```typescript
async makePayment(
  amount: string, 
  recipientAddress: string
): Promise<PaymentResponse>
```

**Parameters:**
- `amount`: Payment amount in USDC (e.g., '0.01')
- `recipientAddress`: Recipient's Aptos address

**Returns:** Promise<PaymentResponse> - Payment result

**Example:**
```typescript
const payment = await client.makePayment('0.01', '0x1234567890abcdef...');
console.log('Payment successful:', payment.transactionHash);
```

##### getBalance

Get the current USDC balance of the connected wallet.

```typescript
async getBalance(): Promise<string>
```

**Returns:** Promise<string> - Current balance in USDC

**Example:**
```typescript
const balance = await client.getBalance();
console.log('Current balance:', balance, 'USDC');
```

##### isConnected

Check if the wallet is connected.

```typescript
async isConnected(): Promise<boolean>
```

**Returns:** Promise<boolean> - True if wallet is connected

**Example:**
```typescript
if (await client.isConnected()) {
  console.log('Wallet is connected');
}
```

### WalletAdapter Interface

Interface that must be implemented for wallet integration.

```typescript
import { WalletAdapter } from '@xapt/common';

class MyWalletAdapter implements WalletAdapter {
  async connect(): Promise<AptosAddress> {
    // Connect to wallet and return address
    return '0x1234567890abcdef...';
  }

  async signTransaction(payload: AptosTransactionPayload): Promise<SignedTransaction> {
    // Sign transaction and return signed transaction
    return {
      transaction: payload,
      signature: '0x...',
      public_key: '0x...'
    };
  }

  async getAddress(): Promise<AptosAddress> {
    // Get current wallet address
    return '0x1234567890abcdef...';
  }

  async isConnected(): Promise<boolean> {
    // Check if wallet is connected
    return true;
  }
}
```

## 🔧 Usage Examples

### Basic Setup

```typescript
import { AptosX402Client } from '@xapt/client';

// Create wallet adapter (you need to implement this)
class MyWalletAdapter {
  async connect() {
    // Connect to wallet (e.g., Petra, Martian, etc.)
    return '0x1234567890abcdef...';
  }

  async signTransaction(payload) {
    // Sign transaction with wallet
    return {
      transaction: payload,
      signature: '0x...',
      public_key: '0x...'
    };
  }

  async getAddress() {
    return '0x1234567890abcdef...';
  }

  async isConnected() {
    return true;
  }
}

// Initialize client
const walletAdapter = new MyWalletAdapter();
const client = new AptosX402Client(walletAdapter, {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  network: 'testnet'
});
```

### Making Payments

```typescript
// Simple payment request
try {
  const response = await client.fetchWithPayment('/api/premium-content');
  const data = await response.json();
  console.log('Content received:', data);
} catch (error) {
  if (error.code === 'PAYMENT_REQUIRED') {
    console.log('Payment required for this content');
  } else {
    console.error('Error:', error);
  }
}

// Manual payment
try {
  const payment = await client.makePayment('0.01', '0x1234567890abcdef...');
  console.log('Payment successful:', payment.transactionHash);
} catch (error) {
  console.error('Payment failed:', error);
}
```

### Advanced Usage

```typescript
// Custom request with payment
const response = await client.fetchWithPayment('/api/download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileId: '12345',
    format: 'pdf'
  })
});

// Check balance before payment
const balance = await client.getBalance();
if (parseFloat(balance) < 0.01) {
  console.log('Insufficient balance');
} else {
  const response = await client.fetchWithPayment('/api/premium-content');
}

// Handle different payment scenarios
const handlePayment = async (endpoint: string) => {
  try {
    const response = await client.fetchWithPayment(endpoint);
    return await response.json();
  } catch (error) {
    switch (error.code) {
      case 'PAYMENT_REQUIRED':
        console.log('Payment required, amount:', error.paymentDetails.amount);
        break;
      case 'INSUFFICIENT_FUNDS':
        console.log('Insufficient funds in wallet');
        break;
      case 'WALLET_NOT_CONNECTED':
        console.log('Please connect your wallet');
        break;
      default:
        console.error('Unknown error:', error);
    }
    throw error;
  }
};
```

### React Integration

```typescript
import React, { useState, useEffect } from 'react';
import { AptosX402Client } from '@xapt/client';

function PremiumContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Initialize client when component mounts
    const initClient = async () => {
      const walletAdapter = new MyWalletAdapter();
      const xaptClient = new AptosX402Client(walletAdapter);
      setClient(xaptClient);
    };
    initClient();
  }, []);

  const fetchContent = async () => {
    if (!client) return;

    setLoading(true);
    setError(null);

    try {
      const response = await client.fetchWithPayment('/api/premium-content');
      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchContent} disabled={loading || !client}>
        {loading ? 'Loading...' : 'Get Premium Content'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {content && (
        <div className="content">
          <h2>{content.title}</h2>
          <p>{content.body}</p>
        </div>
      )}
    </div>
  );
}
```

### AI Agent Integration

```typescript
import { AptosX402Client } from '@xapt/client';

class AIAgent {
  private client: AptosX402Client;

  constructor(walletAdapter) {
    this.client = new AptosX402Client(walletAdapter, {
      maxRetries: 5,
      retryDelay: 2000
    });
  }

  async fetchData(endpoint: string) {
    try {
      const response = await this.client.fetchWithPayment(endpoint);
      return await response.json();
    } catch (error) {
      console.error('AI Agent payment error:', error);
      throw error;
    }
  }

  async processMultipleRequests(endpoints: string[]) {
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const data = await this.fetchData(endpoint);
        results.push({ endpoint, data, success: true });
      } catch (error) {
        results.push({ endpoint, error: error.message, success: false });
      }
    }
    
    return results;
  }
}
```

## 🎯 Use Cases

### Content Monetization
```typescript
// Pay-per-article news site
const article = await client.fetchWithPayment('/api/articles/premium-article-123');

// Pay-per-video streaming
const video = await client.fetchWithPayment('/api/videos/premium-video-456');

// Pay-per-download
const file = await client.fetchWithPayment('/api/downloads/ebook-789');
```

### API Monetization
```typescript
// Pay-per-API-call for AI services
const aiResponse = await client.fetchWithPayment('/api/ai/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Generate a story' })
});

// Pay-per-data-access
const data = await client.fetchWithPayment('/api/data/real-time-prices');
```

### Gaming & Entertainment
```typescript
// In-game purchases
const item = await client.fetchWithPayment('/api/game/purchase-item', {
  method: 'POST',
  body: JSON.stringify({ itemId: 'sword-123' })
});

// Tournament entry
const entry = await client.fetchWithPayment('/api/tournament/enter', {
  method: 'POST',
  body: JSON.stringify({ tournamentId: 'tournament-456' })
});
```

## 🧪 Testing

```typescript
import { AptosX402Client } from '@xapt/client';

// Mock wallet adapter for testing
class MockWalletAdapter {
  async connect() {
    return '0x1234567890abcdef...';
  }

  async signTransaction(payload) {
    return {
      transaction: payload,
      signature: '0xmock-signature',
      public_key: '0xmock-public-key'
    };
  }

  async getAddress() {
    return '0x1234567890abcdef...';
  }

  async isConnected() {
    return true;
  }
}

// Test client
const mockAdapter = new MockWalletAdapter();
const testClient = new AptosX402Client(mockAdapter);

// Test payment
const testPayment = async () => {
  try {
    const response = await testClient.fetchWithPayment('/api/test');
    console.log('Test successful');
  } catch (error) {
    console.log('Test error:', error);
  }
};
```

## 📋 Requirements

- Node.js 16+
- TypeScript 4.5+
- Aptos blockchain access
- Wallet adapter implementation

## 🔗 Dependencies

- `@xapt/common` - Shared types and utilities
- `@aptos-labs/ts-sdk` - Aptos TypeScript SDK
- `@aptos-labs/wallet-adapter-react` - React wallet adapter

## 🔗 Related Packages

- [@xapt/common](./../common) - Shared types, constants, and utilities
- [@xapt/server](./../server) - Server-side Express.js middleware

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 🔗 Links

- [Aptos Documentation](https://aptos.dev/)
- [USDC on Aptos](https://developers.circle.com/developers/usdc-on-aptos)
- [HTTP 402 Specification](https://httpwg.org/specs/rfc9110.html#status.402) 