
import { ChartType, ChartDataPoint } from "./types";

// Helper to generate date strings in a consistent format
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

// Helper to generate a realistic equity curve with proper market behavior
const generateEquityCurve = (length: number, startValue: number, volatility: number, annualGrowth: number): number[] => {
  const monthlyGrowth = Math.pow(1 + annualGrowth, 1/12) - 1;
  const values = [startValue];
  
  for (let i = 1; i < length; i++) {
    // Add randomness with some mean reversion
    const randomFactor = (Math.random() - 0.5) * volatility;
    // If previous movement was strongly up, higher chance of down move and vice versa
    const meanReversion = (values[i-1] / values[i-2] - 1) * -0.3 || 0;
    // Monthly growth + random factor + mean reversion
    const growth = monthlyGrowth + randomFactor + (i > 1 ? meanReversion : 0);
    values.push(values[i-1] * (1 + growth));
  }
  
  return values;
};

export function generateChartData(chartType: ChartType): ChartDataPoint[] {
  // Generate dates for the past 24 months
  const dates = Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (24 - i - 1));
    return formatDate(date);
  });
  
  // Base parameters for simulation
  const startValue = 10000;
  const volatility = 0.04; // 4% standard deviation
  const annualGrowth = 0.12; // 12% annual growth
  
  try {
    console.log(`Generating ${chartType} chart data...`);
    
    switch (chartType) {
      case "equity": {
        // Generate equity curve values
        const equityValues = generateEquityCurve(dates.length, startValue, volatility, annualGrowth);
        
        return dates.map((date, i) => ({
          date,
          value: Math.round(equityValues[i]),
          baseline: startValue * Math.pow(1.02, i / 12) // Benchmark grows at 2% annually
        }));
      }
        
      case "monthly": {
        // Calculate monthly returns from equity curve
        const equityValues = generateEquityCurve(dates.length, startValue, volatility, annualGrowth);
        
        return dates.map((date, i) => {
          // Calculate month-over-month return
          const prevValue = i > 0 ? equityValues[i-1] : equityValues[0];
          const monthlyReturn = ((equityValues[i] / prevValue) - 1) * 100;
          
          return {
            month: date,
            return: parseFloat(monthlyReturn.toFixed(2))
          };
        });
      }
        
      case "distribution": {
        // More realistic win/loss ratio
        const winRate = 0.68; // 68% win rate
        const totalTrades = 100;
        const winCount = Math.round(totalTrades * winRate);
        const lossCount = totalTrades - winCount;
        
        return [
          { name: "Wins", value: winCount, color: "#10B981" },
          { name: "Losses", value: lossCount, color: "#EF4444" }
        ];
      }
        
      case "drawdown": {
        // Calculate drawdowns from equity curve
        const equityValues = generateEquityCurve(dates.length, startValue, volatility, annualGrowth);
        let peak = equityValues[0];
        
        return dates.map((date, i) => {
          peak = Math.max(peak, equityValues[i]);
          const drawdown = ((equityValues[i] / peak) - 1) * 100;
          
          return {
            date,
            drawdown: parseFloat(drawdown.toFixed(2))
          };
        });
      }
        
      case "detailed": {
        // Generate all metrics for detailed chart
        const equityValues = generateEquityCurve(dates.length, startValue, volatility * 1.2, annualGrowth);
        let peak = equityValues[0];
        
        return dates.map((date, i) => {
          // Update peak and calculate drawdown
          peak = Math.max(peak, equityValues[i]);
          const drawdown = ((equityValues[i] / peak) - 1) * 100;
          
          // Calculate rolling volatility
          const lookback = 6; // 6-month rolling window
          const volatilityValue = i >= lookback 
            ? calculateVolatility(equityValues.slice(Math.max(0, i-lookback), i+1))
            : 5 + Math.random() * 2;
          
          return {
            date,
            equity: equityValues[i],
            drawdown: drawdown < -0.1 ? drawdown : 0, // Only show meaningful drawdowns
            volatility: parseFloat(volatilityValue.toFixed(2))
          };
        });
      }
        
      default:
        console.error(`Unknown chart type: ${chartType}`);
        return [];
    }
  } catch (error) {
    console.error(`Error generating chart data for ${chartType}:`, error);
    return [];
  }
}

// Helper to calculate volatility from a series of values
function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0;
  
  // Convert absolute values to returns
  const returns = values.slice(1).map((val, i) => (val / values[i]) - 1);
  
  // Calculate standard deviation of returns
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const squaredDiffs = returns.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / returns.length;
  
  // Annualize monthly volatility
  return Math.sqrt(variance) * 100 * Math.sqrt(12);
}
