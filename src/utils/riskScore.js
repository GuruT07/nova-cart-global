/**
 * Nova Cart Global — Probabilistic Trust Engine
 * Core algorithm for calculating inventory confidence.
 *
 * @param {number} lastUpdatedHours - Hours since last stock update
 * @param {number} storeCancelRate  - Store's historical cancellation rate (0–1)
 * @param {number} salesSpeed       - Items sold per hour
 * @param {number} statedStock      - Quantity in database
 * @returns {'High'|'Medium'|'Low'} - Confidence tier
 */
export function calculateConfidence(lastUpdatedHours, storeCancelRate, salesSpeed, statedStock) {
  // Guard: explicit zero stock
  if (statedStock <= 0) return 'Low';

  const expectedSales = lastUpdatedHours * salesSpeed;
  const remaining = statedStock - expectedSales;

  // Guard: stock exhausted by predicted sales
  if (remaining <= 0) return 'Low';

  const risk =
    (storeCancelRate / 0.5) * 0.4 +
    Math.min(lastUpdatedHours / 72, 1) * 0.4 +
    Math.min(expectedSales / statedStock, 1) * 0.2;

  if (risk > 0.6) return 'Low';
  if (risk > 0.3) return 'Medium';
  return 'High';
}

/**
 * Derive a 0–5 star customer rating from a store's trust score.
 * Adds a small deterministic variance per store to look realistic.
 * @param {number} trustScore - 0–100
 * @param {number} storeId    - Used for deterministic variance
 * @returns {string} e.g. "4.3"
 */
export function deriveRating(trustScore, storeId) {
  const base = (trustScore / 100) * 5;
  const variance = ((storeId % 7) - 3) * 0.05; // ±0.15 max
  return Math.min(5, Math.max(1, base + variance)).toFixed(1);
}

/**
 * Sanitize user-provided search text to prevent XSS.
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
    .slice(0, 100); // cap at 100 chars
}