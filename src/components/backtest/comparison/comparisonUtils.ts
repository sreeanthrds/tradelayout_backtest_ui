
// Utility functions and constants for comparison components

export const strategyColors: Record<string, string> = {
  "Iron Condor": "#3B82F6",
  "Bull Put Spread": "#10B981",
  "Bear Call Spread": "#EF4444",
  "Short Strangle": "#8B5CF6",
  "Long Straddle": "#F59E0B",
  "SPY Buy and Hold": "#6B7280",
  "QQQ Buy and Hold": "#EC4899",
};

// Sample data generator functions
export function generateComparisonData() {
  return Array.from({ length: 24 }, (_, i) => {
    // Create somewhat realistic comparison data
    const date = new Date(2022, i % 12, 1).toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    });
    
    return {
      date,
      "Iron Condor": 10000 * Math.pow(1.008, i) + (Math.random() * 300 - 150),
      "Bull Put Spread": 10000 * Math.pow(1.0095, i) + (Math.random() * 400 - 200),
      "SPY Buy and Hold": 10000 * Math.pow(1.006, i) + (Math.random() * 250 - 125),
    };
  });
}

export function generateMetricsComparisonData() {
  return [
    {
      metric: "Total Return",
      "Iron Condor": "18.7%",
      "Bull Put Spread": "22.3%",
      "SPY Buy and Hold": "15.2%",
    },
    {
      metric: "Max Drawdown",
      "Iron Condor": "-12.5%",
      "Bull Put Spread": "-14.8%",
      "SPY Buy and Hold": "-18.3%",
    },
    {
      metric: "Sharpe Ratio",
      "Iron Condor": "1.42",
      "Bull Put Spread": "1.36",
      "SPY Buy and Hold": "0.98",
    },
    {
      metric: "Win Rate",
      "Iron Condor": "68.2%",
      "Bull Put Spread": "72.5%",
      "SPY Buy and Hold": "58.3%",
    },
    {
      metric: "Volatility",
      "Iron Condor": "15.7%",
      "Bull Put Spread": "18.2%",
      "SPY Buy and Hold": "19.5%",
    },
  ];
}

export const availableStrategies = [
  "Iron Condor",
  "Bull Put Spread",
  "Bear Call Spread",
  "Short Strangle",
  "Long Straddle",
  "SPY Buy and Hold",
  "QQQ Buy and Hold",
];
