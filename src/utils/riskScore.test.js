import { describe, it, expect } from 'vitest';
import { calculateConfidence } from './riskScore.js';

describe('calculateConfidence', () => {
  it('returns Low if out of stock', () => {
    expect(calculateConfidence(10, 0.1, 1, 0)).toBe('Low');
  });
  it('returns High for fresh updates', () => {
    expect(calculateConfidence(1, 0.05, 0.1, 50)).toBe('High');
  });
});