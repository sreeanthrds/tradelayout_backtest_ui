
import { ChartType, ChartDataPoint } from "./types";

export function generateChartData(chartType: ChartType): ChartDataPoint[] {
  switch (chartType) {
    case "equity":
      return Array.from({ length: 24 }, (_, i) => {
        // Create a somewhat realistic equity curve
        const baseValue = 10000;
        const trend = Math.pow(1.01, i); // slight upward trend
        const volatility = Math.random() * 500 - 250; // add some noise
        const value = baseValue * trend + volatility;
        
        return {
          date: new Date(2022, i % 12, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          value: Math.round(value),
          baseline: baseValue
        };
      });
      
    case "monthly":
      return Array.from({ length: 12 }, (_, i) => {
        const returns = Math.random() * 10 - 3; // returns between -3% and 7%
        return {
          month: new Date(2023, i, 1).toLocaleDateString('en-US', { month: 'short' }),
          return: parseFloat(returns.toFixed(2))
        };
      });
      
    case "distribution":
      const winCount = 32;
      const lossCount = 15;
      return [
        { name: "Wins", value: winCount, color: "#10B981" },
        { name: "Losses", value: lossCount, color: "#EF4444" }
      ];
      
    case "drawdown":
      return Array.from({ length: 24 }, (_, i) => {
        // Create drawdown periods
        let drawdown = 0;
        if (i > 5 && i < 10) drawdown = -1 - Math.random() * 8; // first drawdown period
        if (i > 15 && i < 19) drawdown = -2 - Math.random() * 10; // second drawdown period
        
        return {
          date: new Date(2022, i % 12, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          drawdown: parseFloat(drawdown.toFixed(2))
        };
      });
      
    case "detailed":
      // This would be a more complex chart, just using a placeholder here
      return Array.from({ length: 24 }, (_, i) => {
        return {
          date: new Date(2022, i % 12, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          equity: 10000 * Math.pow(1.01, i) + (Math.random() * 500 - 250),
          drawdown: i > 15 && i < 19 ? -2 - Math.random() * 10 : 0,
          volatility: 5 + Math.random() * 3
        };
      });
      
    default:
      return [];
  }
}
