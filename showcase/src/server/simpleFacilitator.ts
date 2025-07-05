import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.FACILITATOR_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple payment verification endpoint
app.post('/verify-payment', (req, res) => {
  const { 
    paymentId, 
    signedTransactionPayload, 
    transactionHash,
    expectedAmount, 
    expectedTokenAddress, 
    expectedRecipientAddress,
    expectedNetwork 
  } = req.body;

  console.log('🔍 Verifying payment:', {
    paymentId,
    expectedAmount,
    expectedTokenAddress,
    expectedRecipientAddress,
    expectedNetwork,
    hasSignedPayload: !!signedTransactionPayload,
    hasTransactionHash: !!transactionHash
  });

  // For testing purposes, always return success
  // In a real implementation, you would verify the transaction on the blockchain
  const mockTransactionHash = transactionHash || '0x' + Math.random().toString(16).substring(2, 66);

  res.json({
    isValid: true,
    transactionHash: mockTransactionHash,
    senderAddress: '0x7cf9db286bac18834b20bb31b34809fe308ac7c8f683e5daa0dfca434e5d8f74',
    amountTransferred: expectedAmount,
    timestamp: Date.now()
  });
});

// Transaction submission endpoint
app.post('/submit-transaction', (req, res) => {
  const { signedTransactionPayload } = req.body;

  console.log('📤 Submitting transaction:', {
    hasSignedPayload: !!signedTransactionPayload,
    payloadLength: signedTransactionPayload?.length || 0
  });

  // For testing purposes, return a mock transaction hash
  // In a real implementation, you would submit to the blockchain
  const mockTransactionHash = '0x' + Math.random().toString(16).substring(2, 66);

  res.json({
    transactionHash: mockTransactionHash,
    status: 'submitted',
    timestamp: Date.now()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'xAPT Simple Facilitator',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔧 Simple Facilitator Service running on port ${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Verify: http://localhost:${PORT}/verify-payment`);
  console.log(`   Submit: http://localhost:${PORT}/submit-transaction`);
});

export default app; 