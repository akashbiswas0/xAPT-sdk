# @xapt/common

Shared types, interfaces, constants, and utility functions for the xAPT SDK - enabling instant, automated stablecoin payments over HTTP using Aptos Testnet USDC.

## 📦 Installation

```bash
npm install @xapt/common
```

## 🚀 Features

- **TypeScript Types**: Complete type definitions for Aptos transactions and payments
- **Constants**: Aptos network configurations and USDC settings
- **Error Codes**: Standardized error codes for payment processing
- **HTTP Headers**: Custom headers for HTTP 402 payment integration
- **Validation Utils**: Input validation and formatting utilities
- **Aptos Integration**: Native Aptos blockchain support

## 📚 API Reference

### Constants

#### Aptos Networks
```typescript
import { APTOS_NETWORKS } from '@xapt/common';

console.log(APTOS_NETWORKS.TESTNET); // 'testnet'
console.log(APTOS_NETWORKS.MAINNET); // 'mainnet'
console.log(APTOS_NETWORKS.DEVNET);  // 'devnet'
```

#### USDC Configuration
```typescript
import { USDC_CONFIG, APTOS_TESTNET_USDC_ADDRESS } from '@xapt/common';

console.log(USDC_CONFIG.DECIMALS); // 6
console.log(USDC_CONFIG.SYMBOL);   // 'USDC'
console.log(USDC_CONFIG.NAME);     // 'USD Coin'
console.log(APTOS_TESTNET_USDC_ADDRESS); // '0x...'
```

#### Error Codes
```typescript
import { ERROR_CODES } from '@xapt/common';

// Payment-related errors
console.log(ERROR_CODES.PAYMENT_REQUIRED);     // 'PAYMENT_REQUIRED'
console.log(ERROR_CODES.INSUFFICIENT_FUNDS);   // 'INSUFFICIENT_FUNDS'
console.log(ERROR_CODES.PAYMENT_FAILED);       // 'PAYMENT_FAILED'
console.log(ERROR_CODES.INVALID_PAYMENT);      // 'INVALID_PAYMENT'

// Wallet-related errors
console.log(ERROR_CODES.WALLET_NOT_CONNECTED); // 'WALLET_NOT_CONNECTED'
console.log(ERROR_CODES.TRANSACTION_FAILED);   // 'TRANSACTION_FAILED'
console.log(ERROR_CODES.INVALID_ADDRESS);      // 'INVALID_ADDRESS'

// Network-related errors
console.log(ERROR_CODES.NETWORK_ERROR);        // 'NETWORK_ERROR'
console.log(ERROR_CODES.TIMEOUT);              // 'TIMEOUT'
console.log(ERROR_CODES.RATE_LIMITED);         // 'RATE_LIMITED'
```

#### HTTP Headers
```typescript
import { HTTP_HEADERS } from '@xapt/common';

// Payment request headers
console.log(HTTP_HEADERS.X_PAYMENT_AMOUNT);      // 'x-payment-amount'
console.log(HTTP_HEADERS.X_PAYMENT_RECIPIENT);   // 'x-payment-recipient'
console.log(HTTP_HEADERS.X_PAYMENT_ID);          // 'x-payment-id'
console.log(HTTP_HEADERS.X_PAYMENT_CURRENCY);    // 'x-payment-currency'

// Payment response headers
console.log(HTTP_HEADERS.X_PAYMENT_STATUS);      // 'x-payment-status'
console.log(HTTP_HEADERS.X_PAYMENT_TRANSACTION); // 'x-payment-transaction'
console.log(HTTP_HEADERS.X_PAYMENT_VERIFIED);    // 'x-payment-verified'
```

### Types

#### Aptos Types
```typescript
import { 
  AptosAddress, 
  AptosTransactionPayload, 
  SignedTransaction, 
  AptosTransactionHash 
} from '@xapt/common';

// Aptos address type (string with validation)
const address: AptosAddress = '0x1234567890abcdef...';

// Transaction payload for coin transfer
const payload: AptosTransactionPayload = {
  type: 'coin::transfer',
  function: '0x1::coin::transfer',
  type_arguments: ['0x1::aptos_coin::AptosCoin'],
  arguments: [recipient, amount]
};

// Signed transaction
const signedTx: SignedTransaction = {
  transaction: payload,
  signature: '0x...',
  public_key: '0x...'
};

// Transaction hash
const txHash: AptosTransactionHash = '0x1234567890abcdef...';
```

#### Payment Types
```typescript
import { 
  PaymentRequest, 
  PaymentResponse, 
  PaymentVerificationRequest,
  PaymentVerificationResponse 
} from '@xapt/common';

// Payment request
const paymentRequest: PaymentRequest = {
  amount: '0.01',
  recipientAddress: '0x1234567890abcdef...',
  currency: 'USDC',
  paymentId: 'uuid-here'
};

// Payment response
const paymentResponse: PaymentResponse = {
  success: true,
  transactionHash: '0x1234567890abcdef...',
  amount: '0.01',
  recipientAddress: '0x1234567890abcdef...',
  timestamp: new Date().toISOString()
};

// Payment verification request
const verificationRequest: PaymentVerificationRequest = {
  paymentId: 'uuid-here',
  transactionHash: '0x1234567890abcdef...',
  amount: '0.01',
  recipientAddress: '0x1234567890abcdef...'
};

// Payment verification response
const verificationResponse: PaymentVerificationResponse = {
  verified: true,
  paymentId: 'uuid-here',
  transactionHash: '0x1234567890abcdef...',
  amount: '0.01',
  timestamp: new Date().toISOString()
};
```

#### Wallet Adapter Interface
```typescript
import { WalletAdapter } from '@xapt/common';

// Implement this interface for your wallet
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

### Utilities

#### Validation Functions
```typescript
import { 
  isValidAptosAddress, 
  isValidAmount, 
  formatAmount,
  generatePaymentId 
} from '@xapt/common';

// Validate Aptos address
const isValid = isValidAptosAddress('0x1234567890abcdef...'); // true/false

// Validate payment amount
const isValidAmount = isValidAmount('0.01'); // true/false

// Format amount for display
const formatted = formatAmount('0.01'); // '0.01 USDC'

// Generate unique payment ID
const paymentId = generatePaymentId(); // 'uuid-string'
```

## 🔧 Usage Examples

### Basic Setup
```typescript
import { 
  APTOS_NETWORKS, 
  USDC_CONFIG, 
  ERROR_CODES,
  isValidAptosAddress 
} from '@xapt/common';

// Configure for testnet
const network = APTOS_NETWORKS.TESTNET;

// Check USDC configuration
console.log(`USDC has ${USDC_CONFIG.DECIMALS} decimals`);

// Validate address
if (isValidAptosAddress(userAddress)) {
  console.log('Valid Aptos address');
}
```

### Payment Processing
```typescript
import { 
  PaymentRequest, 
  PaymentResponse,
  generatePaymentId,
  isValidAmount 
} from '@xapt/common';

// Create payment request
const createPaymentRequest = (amount: string, recipient: string): PaymentRequest => {
  if (!isValidAmount(amount)) {
    throw new Error('Invalid amount');
  }

  return {
    amount,
    recipientAddress: recipient,
    currency: 'USDC',
    paymentId: generatePaymentId()
  };
};

// Process payment response
const processPaymentResponse = (response: PaymentResponse): boolean => {
  if (response.success) {
    console.log(`Payment successful: ${response.transactionHash}`);
    return true;
  }
  return false;
};
```

### Error Handling
```typescript
import { ERROR_CODES } from '@xapt/common';

const handlePaymentError = (error: any) => {
  switch (error.code) {
    case ERROR_CODES.PAYMENT_REQUIRED:
      console.log('Payment is required for this request');
      break;
    case ERROR_CODES.INSUFFICIENT_FUNDS:
      console.log('Insufficient funds in wallet');
      break;
    case ERROR_CODES.WALLET_NOT_CONNECTED:
      console.log('Please connect your wallet');
      break;
    default:
      console.log('Unknown error occurred');
  }
};
```

## 🧪 Testing

```typescript
import { 
  APTOS_TESTNET_USDC_ADDRESS,
  isValidAptosAddress,
  isValidAmount 
} from '@xapt/common';

// Test constants
console.log(APTOS_TESTNET_USDC_ADDRESS); // Should be valid address

// Test validation
console.log(isValidAptosAddress('0x123')); // false
console.log(isValidAptosAddress('0x1234567890abcdef...')); // true

console.log(isValidAmount('0.01')); // true
console.log(isValidAmount('-0.01')); // false
console.log(isValidAmount('abc')); // false
```

## 📋 Requirements

- Node.js 16+
- TypeScript 4.5+
- Aptos blockchain access

## 🔗 Related Packages

- [@xapt/client](./../client) - Client-side SDK for browsers and AI agents
- [@xapt/server](./../server) - Server-side Express.js middleware

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 🔗 Links

- [Aptos Documentation](https://aptos.dev/)
- [USDC on Aptos](https://developers.circle.com/developers/usdc-on-aptos)
- [HTTP 402 Specification](https://httpwg.org/specs/rfc9110.html#status.402) 