/**
 * Nova Cart Global — Application-wide Constants
 * Centralising all "magic numbers" for maintainability and readability.
 */

// ── Confidence Risk Thresholds ────────────────────────────────────────────────
export const RISK_LOW_THRESHOLD    = 0.6;
export const RISK_MEDIUM_THRESHOLD = 0.3;

// ── Risk Weight Factors ───────────────────────────────────────────────────────
export const WEIGHT_CANCEL_RATE    = 0.4;
export const WEIGHT_STALENESS      = 0.4;
export const WEIGHT_VELOCITY       = 0.2;
export const MAX_STALENESS_HOURS   = 72;
export const CANCEL_RATE_NORMALISE = 0.5;

// ── Business Impact Figures ───────────────────────────────────────────────────
export const AVG_ORDER_VALUE       = 486;
export const MONTHLY_ORDERS        = 38500;
export const CANCELLATION_RATE     = 0.11;
export const STOCK_CANCEL_SHARE    = 0.35;
export const RESCUE_SUCCESS_RATE   = 0.75;
export const TICKET_RATE           = 0.15;

// ── Simulation Parameters ─────────────────────────────────────────────────────
export const SIMULATION_ORDERS     = 500;

// ── UI / Input Constraints ────────────────────────────────────────────────────
export const MAX_SEARCH_LENGTH     = 100;
export const MAX_PRODUCTS_SHOWN    = 12;

// ── Rating ────────────────────────────────────────────────────────────────────
export const MAX_RATING             = 5.0;
export const MIN_RATING             = 1.0;
export const RATING_VARIANCE_MODULO = 7;
export const RATING_VARIANCE_SCALE  = 0.05;
