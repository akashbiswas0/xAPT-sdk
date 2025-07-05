import { xaptPaymentMiddleware } from '../src/middleware/xaptPaymentMiddleware';

describe('xAPT Server Middleware', () => {
  it('should create middleware function', () => {
    const config = {
      facilitatorBaseUrl: 'https://test.com',
      paymentRules: {
        '/test': {
          amount: '0.01',
          recipientAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        },
      },
    };

    const middleware = xaptPaymentMiddleware(config);
    expect(typeof middleware).toBe('function');
  });
}); 