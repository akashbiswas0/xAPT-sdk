# xAPT Smart Wallet Showcase - Quick Start

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Test Basic Functionality
```bash
npm test
```

### 4. Run the Full Demo
```bash
# Terminal 1: Start the server
npm run server

# Terminal 2: Run the client
npm run client
```

## 🎯 What You'll See

### Smart Wallet Features
- **Automatic Refill**: When spending wallet balance drops below $2, automatically transfers $10 from savings
- **Balance Monitoring**: Real-time tracking of both wallets
- **Daily Limits**: Maximum 5 refills per day, up to $50 total
- **Transaction History**: Complete audit trail of all transfers

### Payment Scenarios
- **Public Endpoints**: Free access to basic information
- **Premium Endpoints**: 1 USDC for market data and analysis
- **Enterprise Endpoints**: 5 USDC for advanced insights
- **Subscription Endpoints**: 1 USDC for real-time feeds

### Demo Flow
1. **Initialization**: Connect to both spending and saving wallets
2. **Balance Check**: Display current balances and limits
3. **Public Access**: Test free endpoints
4. **Premium Access**: Test paid endpoints with automatic payment handling
5. **Low Balance Simulation**: Trigger auto-refill from savings
6. **Statistics**: Show transaction history and refill events

## 🔧 Configuration

### Smart Wallet Settings
```typescript
{
  lowBalanceThreshold: 2.0,      // Trigger refill below $2
  autoRefillAmount: 10.0,        // Refill $10 at a time
  maxRefillsPerDay: 5,           // Max 5 refills per day
  maxDailyRefillAmount: 50.0,    // Max $50 total per day
  enableAutoRefill: true,        // Enable automatic refills
  enableNotifications: true      // Enable notifications
}
```

### Server Endpoints
- **Public**: `/api/public/*` - No payment required
- **Premium**: `/api/premium/*` - 1 USDC payment
- **Enterprise**: `/api/enterprise/*` - 5 USDC payment
- **Subscription**: `/api/subscription/*` - 1 USDC payment

## 🎮 Interactive Demo

### Start the Server
```bash
npm run server
```

You'll see:
```
🚀 xAPT Showcase Server running on port 3000
📊 Available endpoints:
   Public: http://localhost:3000/api/public/*
   Premium: http://localhost:3000/api/premium/*
   Enterprise: http://localhost:3000/api/enterprise/*
   Subscription: http://localhost:3000/api/subscription/*
```

### Run the Client
```bash
npm run client
```

You'll see the complete demo flow with:
- Wallet connection and balance display
- Payment processing for premium endpoints
- Auto-refill simulation when balance is low
- Transaction history and statistics

## 🔍 Key Features Demonstrated

### 1. **Smart Balance Management**
- Automatic detection of low balance
- Seamless refill from savings wallet
- Configurable thresholds and limits

### 2. **HTTP 402 Payment Required**
- Server sends 402 status with payment details
- Client automatically handles payment flow
- Real-time payment verification

### 3. **Transaction Tracking**
- Complete history of all transfers
- Auto-refill event logging
- Daily statistics and limits

### 4. **Error Handling**
- Graceful handling of insufficient funds
- Retry logic for failed payments
- Comprehensive error reporting

## 🛠️ Development

### Project Structure
```
showcase/
├── src/
│   ├── client/demoClient.ts      # Demo client
│   ├── server/demoServer.ts      # Demo server
│   ├── wallet/smartWalletAdapter.ts # Smart wallet
│   └── types/wallet.ts           # Type definitions
├── dist/                         # Built files
├── test-showcase.js              # Test script
└── README.md                     # Full documentation
```

### Available Scripts
- `npm run build` - Build the project
- `npm test` - Run basic tests
- `npm run server` - Start demo server
- `npm run client` - Run demo client
- `npm start` - Run complete demo
- `npm run clean` - Clean build files

## 🎉 Success Indicators

When everything is working correctly, you should see:

✅ **Wallet Connection**: Both wallets connected successfully
✅ **Balance Display**: Current balances shown for both wallets
✅ **Payment Processing**: Successful payments for premium endpoints
✅ **Auto-refill**: Automatic transfer from savings when needed
✅ **Statistics**: Complete transaction history and refill events

## 🆘 Troubleshooting

### Common Issues

1. **Server won't start**: Check if port 3000 is available
2. **Client connection failed**: Ensure server is running first
3. **Payment errors**: Check facilitator service configuration
4. **Build errors**: Run `npm run clean && npm run build`

### Getting Help

- Check the full [README.md](README.md) for detailed documentation
- Review the [xAPT SDK documentation](https://github.com/xapt/xapt-sdk)
- Open an issue on GitHub for bugs or questions

---

**Ready to explore the future of automated payments! 🚀** 