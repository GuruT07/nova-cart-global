/**
 * constants.test.js
 * Validates that all exported constants satisfy business-logic constraints.
 */
import { describe, it, expect } from 'vitest';
import {
  RISK_LOW_THRESHOLD,
  RISK_MEDIUM_THRESHOLD,
  WEIGHT_CANCEL_RATE,
  WEIGHT_STALENESS,
  WEIGHT_VELOCITY,
  AVG_ORDER_VALUE,
  MONTHLY_ORDERS,
  CANCELLATION_RATE,
  RESCUE_SUCCESS_RATE,
  MAX_SEARCH_LENGTH,
  MAX_PRODUCTS_SHOWN,
  MAX_RATING,
  MIN_RATING,
} from './constants';

describe('constants — business-logic invariants', () => {

  it('risk thresholds are ordered: Medium < Low', () => {
    expect(RISK_MEDIUM_THRESHOLD).toBeLessThan(RISK_LOW_THRESHOLD);
  });

  it('risk weights sum to exactly 1.0', () => {
    const sum = WEIGHT_CANCEL_RATE + WEIGHT_STALENESS + WEIGHT_VELOCITY;
    expect(sum).toBeCloseTo(1.0, 5);
  });

  it('AVG_ORDER_VALUE matches Promptwars case-study figure (₹486)', () => {
    expect(AVG_ORDER_VALUE).toBe(486);
  });

  it('MONTHLY_ORDERS matches case-study figure (38,500)', () => {
    expect(MONTHLY_ORDERS).toBe(38500);
  });

  it('CANCELLATION_RATE is between 0 and 1', () => {
    expect(CANCELLATION_RATE).toBeGreaterThan(0);
    expect(CANCELLATION_RATE).toBeLessThanOrEqual(1);
  });

  it('RESCUE_SUCCESS_RATE is between 0 and 1', () => {
    expect(RESCUE_SUCCESS_RATE).toBeGreaterThan(0);
    expect(RESCUE_SUCCESS_RATE).toBeLessThanOrEqual(1);
  });

  it('MAX_SEARCH_LENGTH is a positive integer', () => {
    expect(MAX_SEARCH_LENGTH).toBeGreaterThan(0);
    expect(Number.isInteger(MAX_SEARCH_LENGTH)).toBe(true);
  });

  it('MAX_PRODUCTS_SHOWN is a positive integer', () => {
    expect(MAX_PRODUCTS_SHOWN).toBeGreaterThan(0);
    expect(Number.isInteger(MAX_PRODUCTS_SHOWN)).toBe(true);
  });

  it('MIN_RATING < MAX_RATING', () => {
    expect(MIN_RATING).toBeLessThan(MAX_RATING);
  });
});
