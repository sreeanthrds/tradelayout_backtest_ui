import { useState, useEffect } from "react";

export interface SimulationParams {
  initialInvestment: number;
  annualReturn: number;
  annualVolatility: number;
  years: number;
  paths: number;
}

export interface SimulationResults {
  chartData: Array<{
    time: string;
    median: number;
    p5: number;
    p95: number;
  }>;
  stats: {
    mean: number;
    stdDev: number;
    percentiles: Record<string, number>;
    maxDrawdown: number;
    initialInvestment: number;
    years: number;
    paths: number;
  };
}

export function useMonteCarloSimulation({
  initialInvestment,
  annualReturn,
  annualVolatility,
  years,
  paths,
}: SimulationParams) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);

  // Monte Carlo simulation algorithm
  const performMonteCarloSimulation = () => {
    setIsSimulating(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      // Convert annual to daily parameters
      const tradingDaysPerYear = 252;
      const totalTradingDays = years * tradingDaysPerYear;
      const dailyReturn = annualReturn / tradingDaysPerYear;
      const dailyVolatility = annualVolatility / Math.sqrt(tradingDaysPerYear);

      // Store all simulation paths
      const allPaths: number[][] = [];
      let finalValues: number[] = [];
      
      // Create x sampling points to display (we don't need all days for UI)
      const timePoints = 50;
      const samplingInterval = Math.max(1, Math.floor(totalTradingDays / timePoints));
      
      // Generate simulation paths
      for (let path = 0; path < paths; path++) {
        const pathValues: number[] = [initialInvestment];
        let currentValue = initialInvestment;
        
        for (let day = 1; day <= totalTradingDays; day++) {
          // Generate random return using Box-Muller transform for normal distribution
          const u1 = Math.random();
          const u2 = Math.random();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          const dailyReturnWithNoise = dailyReturn + dailyVolatility * z;
          
          // Calculate new value
          currentValue = currentValue * (1 + dailyReturnWithNoise);
          
          // Store only sampling points to keep data manageable
          if (day % samplingInterval === 0 || day === totalTradingDays) {
            pathValues.push(currentValue);
          }
        }
        
        allPaths.push(pathValues);
        finalValues.push(currentValue);
      }
      
      // Calculate statistics for final values
      finalValues.sort((a, b) => a - b);
      
      const percentiles: Record<string, number> = {
        p5: finalValues[Math.floor(paths * 0.05)],
        p10: finalValues[Math.floor(paths * 0.1)],
        p25: finalValues[Math.floor(paths * 0.25)],
        p50: finalValues[Math.floor(paths * 0.5)], // median
        p75: finalValues[Math.floor(paths * 0.75)],
        p90: finalValues[Math.floor(paths * 0.9)],
        p95: finalValues[Math.floor(paths * 0.95)],
      };
      
      // Calculate mean
      const mean = finalValues.reduce((sum, value) => sum + value, 0) / paths;
      
      // Calculate standard deviation
      const variance = finalValues.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / paths;
      const stdDev = Math.sqrt(variance);
      
      // Calculate max drawdown across all paths
      let maxDrawdown = 0;
      for (const path of allPaths) {
        let peak = path[0];
        let pathMaxDrawdown = 0;
        
        for (const value of path) {
          if (value > peak) {
            peak = value;
          }
          
          const drawdown = (peak - value) / peak;
          if (drawdown > pathMaxDrawdown) {
            pathMaxDrawdown = drawdown;
          }
        }
        
        if (pathMaxDrawdown > maxDrawdown) {
          maxDrawdown = pathMaxDrawdown;
        }
      }
      
      // Get reference paths for the chart (median, 5th and 95th percentile)
      const medianIndex = Math.floor(paths * 0.5);
      const p5Index = Math.floor(paths * 0.05);
      const p95Index = Math.floor(paths * 0.95);
      
      // Sort by final value to find those paths
      const pathsWithFinalValue = allPaths.map((path, index) => ({ 
        path, 
        finalValue: path[path.length - 1] 
      }));
      pathsWithFinalValue.sort((a, b) => a.finalValue - b.finalValue);
      
      const p5Path = pathsWithFinalValue[p5Index].path;
      const medianPath = pathsWithFinalValue[medianIndex].path;
      const p95Path = pathsWithFinalValue[p95Index].path;
      
      // Prepare the chart data
      let chartData = [];
      for (let i = 0; i < medianPath.length; i++) {
        const timePointYears = (i * samplingInterval) / tradingDaysPerYear;
        
        chartData.push({
          time: timePointYears.toFixed(2),
          median: medianPath[i],
          p5: p5Path[i],
          p95: p95Path[i],
        });
      }
      
      const simulationResults: SimulationResults = {
        chartData,
        stats: {
          mean,
          stdDev,
          percentiles,
          maxDrawdown,
          initialInvestment,
          years,
          paths,
        },
      };
      
      setResults(simulationResults);
      setIsSimulating(false);
    }, 10);
  };

  // Run simulation when parameters change
  useEffect(() => {
    performMonteCarloSimulation();
  }, [initialInvestment, annualReturn, annualVolatility, years, paths]);

  return {
    isSimulating,
    results,
    runSimulation: performMonteCarloSimulation,
  };
}
