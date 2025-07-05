import express from 'express';
import cors from 'cors';
import { xaptPaymentMiddleware } from '@xapt/server';
import { DEFAULT_APTOS_TOKEN_ADDRESS } from '@xapt/common';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Detect if running on mainnet
const isMainnet = process.env.NETWORK === 'mainnet' || process.env.APTOS_NETWORK === 'mainnet';

// Configure payment amounts based on network
const getPaymentRules = () => {
  if (isMainnet) {
    // Mainnet configuration with very low amounts
    return {
      '/api/premium/data': {
        amount: '0.002',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17',
        description: 'Premium market data access (Mainnet)'
      },
      '/api/premium/analysis': {
        amount: '0.002',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17',
        description: 'Premium analysis service (Mainnet)'
      },
      '/api/premium/reports': {
        amount: '0.002',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17',
        description: 'Premium reports access (Mainnet)'
      },
      '/api/subscription/feed': {
        amount: '0.002',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17',
        description: 'Real-time subscription feed (Mainnet)'
      }
    };
  } else {
    // Testnet configuration with original amounts
    return {
      '/api/premium/data': {
        amount: '0.1',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17', // Your saving wallet
        description: 'Premium market data access (Testnet)'
      },
      '/api/premium/analysis': {
        amount: '0.1',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17', // Your saving wallet
        description: 'Premium analysis service (Testnet)'
      },
      '/api/premium/reports': {
        amount: '0.1',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17', // Your saving wallet
        description: 'Premium reports access (Testnet)'
      },
      '/api/subscription/feed': {
        amount: '0.1',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17', // Your saving wallet
        description: 'Real-time subscription feed (Testnet)'
      }
    };
  }
};

// Configure xAPT payment middleware
const paymentMiddleware = xaptPaymentMiddleware({
  facilitatorBaseUrl: 'http://localhost:3001', // Local facilitator service
  paymentRules: getPaymentRules(),
});

// Public endpoints (no payment required)
app.get('/api/public/info', (req, res) => {
  res.json({
    message: 'Welcome to xAPT Showcase Server',
    version: '1.0.0',
    features: [
      'Smart Wallet Auto-Refill',
      'APT Payments on Aptos Testnet',
      'HTTP 402 Payment Required',
      'Real-time Balance Monitoring'
    ]
  });
});

app.get('/api/public/balance', (req, res) => {
  res.json({
    message: 'Free balance check endpoint',
    timestamp: new Date().toISOString()
  });
});

// Premium endpoints (payment required)
app.get('/api/premium/data', paymentMiddleware, (req, res) => {
  res.json({
    message: 'Premium data accessed successfully!',
    data: {
      marketAnalysis: {
        trend: 'bullish',
        confidence: 0.85,
        recommendations: ['Buy APT', 'Hold USDC', 'Monitor BTC']
      },
      userStats: {
        totalTransactions: 156,
        averageAmount: 2.5,
        successRate: 0.98
      },
      timestamp: new Date().toISOString()
    }
  });
});

app.post('/api/premium/analysis', paymentMiddleware, (req, res) => {
  const { query } = req.body;
  
  res.json({
    message: 'Premium analysis completed!',
    query,
    analysis: {
      sentiment: 'positive',
      score: 0.78,
      insights: [
        'Strong market fundamentals',
        'Technical indicators favorable',
        'Risk level: moderate'
      ],
      recommendations: [
        'Consider increasing position',
        'Set stop-loss at 0.25 APT',
        'Monitor for 24 hours'
      ],
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/premium/reports', paymentMiddleware, (req, res) => {
  res.json({
    message: 'Premium reports generated!',
    reports: [
      {
        id: 'report-001',
        title: 'Market Analysis Q1 2024',
        summary: 'Comprehensive analysis of Q1 market performance',
        downloadUrl: '/api/premium/download/report-001'
      },
      {
        id: 'report-002',
        title: 'Risk Assessment Report',
        summary: 'Detailed risk analysis and mitigation strategies',
        downloadUrl: '/api/premium/download/report-002'
      },
      {
        id: 'report-003',
        title: 'Portfolio Optimization Guide',
        summary: 'Advanced portfolio optimization techniques',
        downloadUrl: '/api/premium/download/report-003'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// High-value endpoint (higher payment)
app.get('/api/enterprise/insights', (req, res) => {
  // Custom payment middleware for higher amount
  const enterprisePaymentMiddleware = xaptPaymentMiddleware({
    facilitatorBaseUrl: 'http://localhost:3001',
    paymentRules: {
      '/api/enterprise/insights': {
        amount: isMainnet ? '0.01' : '0.5',
        recipientAddress: '0x03aaf1fdf8525602baa4df875a4b76748b8e9fcd4502f2c28cf0d5caf3637a17', // Your saving wallet
        description: `Enterprise insights access (${isMainnet ? 'Mainnet' : 'Testnet'})`
      }
    },
  });

  return enterprisePaymentMiddleware(req, res, () => {
    res.json({
      message: 'Enterprise insights accessed!',
      insights: {
        marketPredictions: {
          nextWeek: 'bullish',
          nextMonth: 'sideways',
          nextQuarter: 'bullish'
        },
        riskMetrics: {
          volatility: 0.23,
          sharpeRatio: 1.45,
          maxDrawdown: 0.12
        },
        opportunities: [
          'DeFi yield farming',
          'NFT marketplace',
          'Cross-chain bridges'
        ],
        timestamp: new Date().toISOString()
      }
    });
  });
});

// Subscription endpoint (recurring payment concept)
app.get('/api/subscription/feed', paymentMiddleware, (req, res) => {
  res.json({
    message: 'Real-time subscription feed!',
    feed: [
      {
        id: 'feed-001',
        type: 'market_update',
        title: 'APT Price Surge',
        content: 'APT has increased by 15% in the last hour',
        timestamp: new Date().toISOString()
      },
      {
        id: 'feed-002',
        type: 'news_alert',
        title: 'New DeFi Protocol Launch',
        content: 'Major DeFi protocol launching on Aptos',
        timestamp: new Date().toISOString()
      },
      {
        id: 'feed-003',
        type: 'technical_analysis',
        title: 'Support Level Tested',
        content: 'APT testing key support at $8.50',
        timestamp: new Date().toISOString()
      }
    ],
    nextUpdate: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/public/info',
      'GET /api/public/balance',
      'GET /api/premium/data',
      'POST /api/premium/analysis',
      'GET /api/premium/reports',
      'GET /api/enterprise/insights',
      'GET /api/subscription/feed'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 xAPT Showcase Server running on port ${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   Public: http://localhost:${PORT}/api/public/*`);
  console.log(`   Premium: http://localhost:${PORT}/api/premium/*`);
  console.log(`   Enterprise: http://localhost:${PORT}/api/enterprise/*`);
  console.log(`   Subscription: http://localhost:${PORT}/api/subscription/*`);
});

export default app; 