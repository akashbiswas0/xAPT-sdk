// Test setup for client package

// Mock fetch globally
(global as any).fetch = jest.fn();

// Mock console methods to reduce noise in tests
(global as any).console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}; 