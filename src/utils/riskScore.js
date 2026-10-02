export function calculateConfidence(lastUpdatedHours, storeCancelRate, salesSpeed, statedStock) {
  if (statedStock <= 0) return 'Low';
  const expectedSales = lastUpdatedHours * salesSpeed;
  const remaining = statedStock - expectedSales;
  if (remaining <= 0) return 'Low';

  const risk = (storeCancelRate / 0.5 * 0.4) + (Math.min(lastUpdatedHours / 72, 1) * 0.4) + (Math.min(expectedSales / statedStock, 1) * 0.2);
  
  if (risk > 0.6) return 'Low';
  if (risk > 0.3) return 'Medium';
  return 'High';
}