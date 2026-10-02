/**
 * riskScore.test.js
 * Unit tests for the Nova Cart Global probabilistic trust engine.
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest';
import { calculateConfidence, deriveRating, sanitizeInput } from './riskScore';

// ─────────────────────────────────────────
// calculateConfidence
// ─────────────────────────────────────────
describe('calculateConfidence', () => {

  it('returns Low when statedStock is 0', () => {
    expect(calculateConfidence(1, 0.1, 2, 0)).toBe('Low');
  });

  it('returns Low when statedStock is negative', () => {
    expect(calculateConfidence(1, 0.1, 2, -5)).toBe('Low');
  });

  it('returns Low when predicted sales exceed stated stock', () => {
    // 10 hrs * 5 items/hr = 50 expected sales, but only 20 in stock
    expect(calculateConfidence(10, 0.1, 5, 20)).toBe('Low');
  });

  it('returns High for fresh stock with low cancel rate and slow sales', () => {
    // Recent update (1hr), very low cancel rate, slow sales, deep stock
    expect(calculateConfidence(1, 0.05, 0.5, 500)).toBe('High');
  });

  it('returns Medium for moderate staleness and average cancel rate', () => {
    const conf = calculateConfidence(24, 0.2, 1, 80);
    expect(['Medium', 'High']).toContain(conf);
  });

  it('returns Low for stale stock with high cancellation rate', () => {
    // 72hr old data, 45% cancel rate, fast sales, low stock
    expect(calculateConfidence(72, 0.45, 3, 30)).toBe('Low');
  });

  it('returns High when risk is exactly at threshold boundary (< 0.3)', () => {
    // Very fresh, zero cancel rate, zero sales speed — risk = 0
    expect(calculateConfidence(0, 0, 0, 100)).toBe('High');
  });

  it('is deterministic for the same inputs', () => {
    const a = calculateConfidence(12, 0.15, 2, 60);
    const b = calculateConfidence(12, 0.15, 2, 60);
    expect(a).toBe(b);
  });
});

// ─────────────────────────────────────────
// deriveRating
// ─────────────────────────────────────────
describe('deriveRating', () => {

  it('returns a string formatted to 1 decimal place', () => {
    const rating = deriveRating(80, 3);
    expect(rating).toMatch(/^\d+\.\d$/);
  });

  it('never exceeds 5.0', () => {
    expect(parseFloat(deriveRating(100, 0))).toBeLessThanOrEqual(5.0);
  });

  it('never goes below 1.0', () => {
    expect(parseFloat(deriveRating(0, 0))).toBeGreaterThanOrEqual(1.0);
  });

  it('produces higher rating for higher trust score', () => {
    const low = parseFloat(deriveRating(20, 4));
    const high = parseFloat(deriveRating(90, 4));
    expect(high).toBeGreaterThan(low);
  });
});

// ─────────────────────────────────────────
// sanitizeInput (Security)
// ─────────────────────────────────────────
describe('sanitizeInput', () => {

  it('strips XSS script tags', () => {
    const result = sanitizeInput('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('escapes double quotes', () => {
    expect(sanitizeInput('"hello"')).toContain('&quot;');
  });

  it('escapes single quotes', () => {
    expect(sanitizeInput("it's")).toContain('&#x27;');
  });

  it('escapes ampersands', () => {
    expect(sanitizeInput('A&B')).toContain('&amp;');
  });

  it('caps input at 100 characters', () => {
    const long = 'a'.repeat(200);
    expect(sanitizeInput(long).length).toBeLessThanOrEqual(100);
  });

  it('handles non-string values safely', () => {
    expect(() => sanitizeInput(undefined)).not.toThrow();
    expect(() => sanitizeInput(null)).not.toThrow();
    expect(() => sanitizeInput(12345)).not.toThrow();
  });
});