import {
  RISK_LOW_THRESHOLD,
  RISK_MEDIUM_THRESHOLD,
  WEIGHT_CANCEL_RATE,
  WEIGHT_STALENESS,
  WEIGHT_VELOCITY,
  MAX_STALENESS_HOURS,
  CANCEL_RATE_NORMALISE,
  MAX_RATING,
  MIN_RATING,
  RATING_VARIANCE_MODULO,
  RATING_VARIANCE_SCALE,
  MAX_SEARCH_LENGTH,
} from './constants';

/**
 * Calculate inventory confidence for a single SKU at a given store.
 * @param {number} lastUpdatedHours
 * @param {number} storeCancelRate  (0–1)
 * @param {number} salesSpeed       items/hour
 * @param {number} statedStock
 * @returns {'High'|'Medium'|'Low'}
 */
export function calculateConfidence(lastUpdatedHours, storeCancelRate, salesSpeed, statedStock) {
  if (statedStock <= 0) return 'Low';

  const expectedSales = lastUpdatedHours * salesSpeed;
  const remaining     = statedStock - expectedSales;
  if (remaining <= 0) return 'Low';

  const risk =
    (storeCancelRate / CANCEL_RATE_NORMALISE) * WEIGHT_CANCEL_RATE +
    Math.min(lastUpdatedHours / MAX_STALENESS_HOURS, 1) * WEIGHT_STALENESS +
    Math.min(expectedSales / statedStock, 1) * WEIGHT_VELOCITY;

  if (risk > RISK_LOW_THRESHOLD)    return 'Low';
  if (risk > RISK_MEDIUM_THRESHOLD) return 'Medium';
  return 'High';
}

/**
 * Derive a 0–5 star customer rating from a store's trust score.
 * @param {number} trustScore  0–100
 * @param {number} storeId     used for deterministic variance
 * @returns {string} e.g. "4.3"
 */
export function deriveRating(trustScore, storeId) {
  const base     = (trustScore / 100) * MAX_RATING;
  const variance = ((storeId % RATING_VARIANCE_MODULO) - 3) * RATING_VARIANCE_SCALE;
  return Math.min(MAX_RATING, Math.max(MIN_RATING, base + variance)).toFixed(1);
}

/**
 * Sanitize user-provided text to prevent XSS.
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, MAX_SEARCH_LENGTH);
}