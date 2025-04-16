
/**
 * Utility functions for correlation matrix visualization
 */

/**
 * Get background color based on correlation value
 * Positive correlations are green, negative are red
 */
export const getColorForCorrelation = (value: number): string => {
  // For positive correlations: green shades
  if (value > 0) {
    const intensity = Math.min(Math.abs(value) * 100, 100);
    return `rgba(0, 128, 0, ${intensity / 100})`;
  }
  // For negative correlations: red shades
  else {
    const intensity = Math.min(Math.abs(value) * 100, 100);
    return `rgba(220, 20, 60, ${intensity / 100})`;
  }
};

/**
 * Format correlation values with sign and fixed decimal places
 */
export const formatCorrelation = (value: number): string => {
  if (value === 1) return "1.00";
  const formatted = value.toFixed(2);
  return value > 0 ? `+${formatted}` : formatted;
};
