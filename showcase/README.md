# xAPT Showcase: Smart Wallet with APT Payments

This showcase demonstrates a complete implementation of the xAPT SDK with a smart wallet system that automatically manages APT token payments on Aptos testnet.

## 🎯 Overview

The showcase implements a "saving and spending wallet" concept where:
- **Spending Wallet**: Used for making payments to services
- **Saving Wallet**: Acts as a reserve that automatically funds the spending wallet
- **Smart Logic**: Automatically refills the spending wallet when balance is low

## 🚀 Features

- **Real Blockchain Integration**: Uses actual Aptos testnet wallets and APT tokens
- **Automatic Refill**: Spending wallet is automatically funded from savings when balance is low
- **Daily Limits**: Configurable daily refill limits and amounts
- **Transaction History**: Tracks all transfers and auto-refill events
- **HTTP 402 Payments**: Demonstrates the complete xAPT payment flow
- **Real-time Balance Monitoring**: Monitors balances from the blockchain

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Demo Client   │    │  Demo Server    │    │  Facilitator    │
│                 │    │                 │    │    Service      │
│ • Smart Wallet  │◄──►│ • Payment       │◄──►│ • Payment       │
│ • Auto-refill   │    │   Middleware    │    │   Verification  │
│ • Real APT      │    │ • APT Payments  │    │ • Transaction   │
│   Transactions  │    │ • HTTP 402      │    │   Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Components

### 1. Smart Wallet Adapter (`src/wallet/smartWalletAdapter.ts`)
- Manages spending and saving wallets
- Implements automatic refill logic
- Tracks daily limits and transaction history
- Handles low balance scenarios

### 2. Real Aptos Wallet Adapter (`src/wallet/realAptosWalletAdapter.ts`)
- Connects to real Aptos testnet wallets
- Submits actual blockchain transactions
- Queries real APT balances
- Uses your provided private keys

### 3. Demo Server (`src/server/demoServer.ts`)
- Express.js server with xAPT payment middleware
- Premium endpoints requiring APT payments
- Public endpoints for testing
- Configurable payment amounts

### 4. Real Blockchain Demo Client (`src/client/realBlockchainDemoClient.ts`)
- Demonstrates complete payment flow
- Tests all endpoints with real transactions
- Shows smart wallet auto-refill in action
- Displays real-time statistics

### 5. Simple Facilitator Service (`src/server/simpleFacilitator.ts`)
- Mock payment verification service
- Simulates transaction validation
- Used for testing payment flows

## 🔧 Setup

### Prerequisites
- Node.js 18+ and npm
- Aptos testnet APT tokens in your wallets
- Your wallet private keys (for real transactions)

### Installation
```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Configuration
The showcase uses your provided wallet addresses:
- **Spending Wallet**: `0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74`
- **Saving Wallet**: `0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17`

## 🚀 Running the Showcase

### 1. Start the Facilitator Service
```bash
# Terminal 1: Start the facilitator service
npm run facilitator
```

### 2. Start the Demo Server
```bash
# Terminal 2: Start the demo server
npm run server
```

### 3. Run the Real Blockchain Demo
```bash
# Terminal 3: Run the demo client
npm run demo:real
```

### Alternative: Run Everything in Sequence
```bash
# Kill any existing processes
pkill -f "node.*facilitator" || true
pkill -f "node.*server" || true

# Start facilitator service
npm run facilitator &
sleep 3

# Start demo server
npm run server &
sleep 3

# Run real blockchain demo
npm run demo:real
```

## 💰 Payment Flow

1. **Client Request**: Demo client requests premium data
2. **402 Response**: Server returns HTTP 402 Payment Required
3. **Payment Creation**: Client creates APT transfer transaction
4. **Blockchain Submission**: Transaction submitted to Aptos testnet
5. **Payment Header**: Client retries request with payment proof
6. **Verification**: Server verifies payment with facilitator service
7. **Success**: Premium data returned to client

## 🔄 Auto-Refill Flow

1. **Low Balance Detection**: Smart wallet detects spending balance below threshold
2. **Auto-Refill Trigger**: Automatically transfers APT from savings to spending
3. **Transaction Creation**: Creates real blockchain transaction
4. **Balance Update**: Updates spending wallet balance
5. **Event Recording**: Records auto-refill event in history

## 📊 Smart Wallet Configuration

```typescript
const config: SmartWalletConfig = {
  lowBalanceThreshold: 0.2,    // 0.2 APT
  autoRefillAmount: 1.0,       // 1 APT
  maxRefillsPerDay: 5,         // Max 5 refills per day
  maxDailyRefillAmount: 5.0,   // Max 5 APT per day
  enableAutoRefill: true,      // Enable auto-refill
  enableNotifications: true    // Enable notifications
};
```

## 🎯 Demo Endpoints

### Public Endpoints (No Payment Required)
- `GET /api/public/info` - Server information
- `GET /api/public/balance` - Free balance check

### Premium Endpoints (0.1 APT Payment Required)
- `GET /api/premium/data` - Premium market data
- `POST /api/premium/analysis` - Premium analysis service
- `GET /api/premium/reports` - Premium reports access
- `GET /api/subscription/feed` - Real-time subscription feed

### Enterprise Endpoint (0.5 APT Payment Required)
- `GET /api/enterprise/insights` - Enterprise insights

## 🔍 Monitoring

### Real-time Balances
The demo displays real APT balances from the blockchain:
- Spending wallet balance
- Saving wallet balance
- Daily refill statistics

### Transaction History
- Auto-refill events with transaction hashes
- Transfer history between wallets
- Payment transactions to services

### Explorer Links
All transactions include links to Aptos Explorer:
```
https://explorer.aptoslabs.com/txn/{transactionHash}?network=testnet
```

## ⚠️ Important Notes

### Real Transactions
- This demo makes **REAL** transactions on Aptos testnet
- **REAL** APT tokens will be transferred between your wallets
- All transactions are visible on the Aptos Explorer
- Ensure you have sufficient APT in your testnet wallets

### Testnet Only
- This demo uses Aptos testnet only
- No real value is at risk
- Testnet APT can be obtained from the Aptos faucet

### Private Keys
- Your private keys are used for real transactions
- Keep them secure and never share them
- Consider using test wallets with minimal balances

## 🛠️ Development

### Building
```bash
npm run build
```

### Testing
```bash
npm run test
```

### Clean
```bash
npm run clean
```

## 📚 Related Links

- [xAPT SDK Documentation](../README.md)
- [@xapt/client](../packages/client/README.md)
- [@xapt/server](../packages/server/README.md)
- [@xapt/common](../packages/common/README.md)
- [Aptos Explorer](https://explorer.aptoslabs.com/?network=testnet)
- [Aptos Testnet Faucet](https://aptoslabs.com/testnet-faucet)

## 🎉 Success Indicators

When the demo runs successfully, you should see:
- ✅ Real APT balances displayed
- ✅ Successful payment transactions
- ✅ Auto-refill events triggered
- ✅ Transaction hashes with explorer links
- ✅ Premium data accessed after payments
- ✅ Smart wallet statistics updated

The showcase demonstrates a complete, production-ready implementation of the xAPT SDK with real blockchain integration and smart wallet automation! 