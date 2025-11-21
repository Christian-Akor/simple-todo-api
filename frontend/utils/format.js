/**
 * Format currency with amount and currency code
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (e.g., 'NGN', 'USD')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'NGN') {
  return `${amount} ${currency}`;
}
