import { isValidAptosAddress, isValidUsdcAmount, isValidPaymentId } from '../src/utils/validation';

describe('Validation Utilities', () => {
  it('should validate Aptos addresses', () => {
    expect(isValidAptosAddress('0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832')).toBe(true);
    expect(isValidAptosAddress('0x123')).toBe(false);
    expect(isValidAptosAddress('')).toBe(false);
  });

  it('should validate USDC amounts', () => {
    expect(isValidUsdcAmount('1')).toBe(true);
    expect(isValidUsdcAmount('0.01')).toBe(true);
    expect(isValidUsdcAmount('0.000001')).toBe(true);
    expect(isValidUsdcAmount('0.0000001')).toBe(false);
    expect(isValidUsdcAmount('abc')).toBe(false);
  });

  it('should validate payment IDs (UUID v4)', () => {
    expect(isValidPaymentId('123e4567-e89b-4d3a-a456-426614174000')).toBe(true);
    expect(isValidPaymentId('not-a-uuid')).toBe(false);
  });
}); 