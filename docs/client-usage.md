# Client Usage Guide

This guide explains how to use the `@xapt/client` package to handle HTTP 402 payments in your web applications.

## Installation

```bash
npm install @xapt/client
```

## Basic Usage

### 1. Create a Wallet Adapter

First, you need to create a wallet adapter that implements the `WalletAdapter` interface. This adapter should integrate with your preferred Aptos wallet (e.g., Petra, Martian, etc.).

```typescript
import { WalletAdapter } from '@xapt/client';

class MyWalletAdapter implements WalletAdapter {
  // Implement the required methods
  isConnected(): boolean { /* ... */ }
  getAccountAddress(): string | null { /* ... */ }
  async signTransaction(payload: any): Promise<any> { /* ... */ }
  async signAndSubmitTransaction(payload: any): Promise<string> { /* ... */ }
  async connect(): Promise<void> { /* ... */ }
  async disconnect(): Promise<void> { /* ... */ }
}
```

### 2. Initialize the Client

```typescript
import { AptosX402Client } from '@xapt/client';

const walletAdapter = new MyWalletAdapter();
const client = new AptosX402Client(walletAdapter, {
  nodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1' // Optional
});
```

### 3. Make Payment Requests

Use the `fetchWithPayment` method to automatically handle HTTP 402 responses:

```typescript
try {
  const response = await client.fetchWithPayment('/api/premium-content');
  const data = await response.json();
  console.log('Access granted:', data);
} catch (error) {
  console.error('Payment failed:', error);
}
```

## Advanced Usage

### Using the Fetch Interceptor

For seamless integration, you can create a modified fetch function that automatically handles payments:

```typescript
import { withPaymentHandling } from '@xapt/client';

const paymentFetch = withPaymentHandling(client);

// Use paymentFetch instead of fetch
const response = await paymentFetch('/api/premium-content');
```

### Custom Payment Flow

If you need more control over the payment process, you can handle the 402 response manually:

```typescript
const response = await fetch('/api/premium-content');

if (response.status === 402) {
  const paymentRequiredHeader = response.headers.get('X-Aptos-Payment-Required');
  const paymentRequired = JSON.parse(paymentRequiredHeader!);
  
  // Handle payment manually
  // ... your custom payment logic
  
  // Retry the request with payment header
  const retryResponse = await fetch('/api/premium-content', {
    headers: {
      'X-Aptos-Payment': JSON.stringify(paymentPayload)
    }
  });
}
```

## Error Handling

The client throws specific errors for different scenarios:

```typescript
try {
  await client.fetchWithPayment('/api/premium-content');
} catch (error) {
  if (error.message.includes('Wallet not connected')) {
    // Handle wallet connection error
  } else if (error.message.includes('Payment verification failed')) {
    // Handle payment verification error
  } else {
    // Handle other errors
  }
}
```

## React Integration

Here's an example of how to integrate the xAPT client with React:

```typescript
import React, { useEffect, useState } from 'react';
import { AptosX402Client } from '@xapt/client';

function PremiumContent() {
  const [client, setClient] = useState<AptosX402Client | null>(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize client with wallet adapter
    const walletAdapter = new MyWalletAdapter();
    const xaptClient = new AptosX402Client(walletAdapter);
    setClient(xaptClient);
  }, []);

  const fetchContent = async () => {
    if (!client) return;
    
    setLoading(true);
    try {
      const response = await client.fetchWithPayment('/api/premium-content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchContent} disabled={loading}>
        {loading ? 'Loading...' : 'Access Premium Content'}
      </button>
      {content && <div>{JSON.stringify(content)}</div>}
    </div>
  );
}
```

## Configuration Options

### AptosX402ClientOptions

```typescript
interface AptosX402ClientOptions {
  /** Optional: Override Aptos node URL */
  nodeUrl?: string;
}
```

## Best Practices

1. **Always handle errors gracefully** - Payment flows can fail for various reasons
2. **Provide user feedback** - Show loading states and error messages
3. **Cache wallet connections** - Don't reconnect unnecessarily
4. **Validate payment amounts** - Double-check amounts before signing transactions
5. **Test with small amounts** - Use testnet and small amounts during development

## Examples

See the `packages/client/examples/browser-app/` directory for a complete working example.

## Troubleshooting

### Common Issues

1. **"Wallet not connected"** - Ensure the wallet adapter is properly connected
2. **"Payment verification failed"** - Check that the facilitator service is running
3. **"Invalid payment header"** - Verify the payment payload format
4. **"Transaction failed"** - Check wallet balance and network connectivity

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=xapt:* npm start
``` 