/**
 * Example Express.js server demonstrating xAPT middleware usage
 */
import express from 'express';
import { xaptPaymentMiddleware } from '../../src/middleware/xaptPaymentMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
const xaptConfig = {
  facilitatorBaseUrl: 'https://your-facilitator-service.com',
  paymentRules: {
    '/api/premium-content': {
      amount: '0.01',
      recipientAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      description: 'Access to premium content',
      currencySymbol: 'USDC',
    },
    '/api/download': {
      amount: '0.005',
      recipientAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      description: 'File download',
      currencySymbol: 'USDC',
    },
  },
  timeout: 30000, // 30 seconds
};

// Apply xAPT middleware to specific routes
app.use('/api/premium-content', xaptPaymentMiddleware(xaptConfig));
app.use('/api/download', xaptPaymentMiddleware(xaptConfig));

// Protected route handlers
app.get('/api/premium-content', (req, res) => {
  res.json({
    message: 'Welcome to premium content!',
    data: 'This content is only available after payment.',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/download', (req, res) => {
  res.json({
    message: 'File download ready',
    downloadUrl: 'https://example.com/file.zip',
    timestamp: new Date().toISOString(),
  });
});

// Public route (no payment required)
app.get('/api/public', (req, res) => {
  res.json({
    message: 'Public content - no payment required',
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`xAPT Example Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Public content: http://localhost:${PORT}/api/public`);
  console.log(`Premium content (requires payment): http://localhost:${PORT}/api/premium-content`);
  console.log(`Download (requires payment): http://localhost:${PORT}/api/download`);
});

export default app; 