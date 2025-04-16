import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface MonteCarloTabProps {
  initialInvestment?: number;
  annualReturn?: number;
  annualVolatility?: number;
  simulationYears?: number;
  simulationPaths?: number;
}

export function MonteCarloTab({
  initialInvestment = 10000,
  annualReturn = 0.10,
  annualVolatility = 0.15,
  simulationYears = 3,
  simulationPaths = 1000,
}: MonteCarloTabProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Run simulation when component mounts
  useState(() => {
    runSimulation();
  });

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      const results = performMonteCarloSimulation(
        initialInvestment,
        annualReturn,
        annualVolatility,
        simulationYears,
        simulationPaths
      );
      setSimulationResults(results);
      setIsSimulating(false);
    }, 10);
  };

  // Monte Carlo simulation algorithm
  const performMonteCarloSimulation = (
    initialInvestment: number,
    annualReturn: number,
    annualVolatility: number,
    years: number,
    paths: number
  ) => {
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
    
    // Format chart data for median, 5th, and 95th percentile lines
    let chartData = [];
    
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
    for (let i = 0; i < medianPath.length; i++) {
      const timePointYears = (i * samplingInterval) / tradingDaysPerYear;
      
      chartData.push({
        time: timePointYears.toFixed(2),
        median: medianPath[i],
        p5: p5Path[i],
        p95: p95Path[i],
      });
    }
    
    return {
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
  };

  if (isSimulating) {
    return <div className="flex justify-center items-center h-60">Running simulation...</div>;
  }

  if (!simulationResults) {
    return <div className="flex justify-center items-center h-60">No simulation data available</div>;
  }

  // Calculate growth rates for the table
  const calculateGrowthRate = (finalValue: number) => {
    const years = simulationResults.stats.years;
    return (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Monte Carlo Simulation</h3>
          <p className="text-sm text-muted-foreground">
            {simulationResults.stats.paths.toLocaleString()} paths over {simulationResults.stats.years} years
          </p>
        </div>
        <Button size="sm" onClick={runSimulation} disabled={isSimulating}>
          Resimulate
        </Button>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={simulationResults.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
            />
            <YAxis 
              label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }} 
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="p5" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8"
              fillOpacity={0.1}
              name="5th Percentile" 
            />
            <Area 
              type="monotone" 
              dataKey="median" 
              stackId="2"
              stroke="#82ca9d" 
              fill="#82ca9d"
              fillOpacity={0.1}
              name="Median" 
            />
            <Area 
              type="monotone" 
              dataKey="p95" 
              stackId="3"
              stroke="#ffc658" 
              fill="#ffc658"
              fillOpacity={0.1}
              name="95th Percentile" 
            />
            <ReferenceLine 
              y={initialInvestment} 
              stroke="red" 
              strokeDasharray="3 3"
              label="Initial Investment" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Percentile</TableHead>
              <TableHead className="text-right">Final Value</TableHead>
              <TableHead className="text-right">Annualized Return</TableHead>
              <TableHead className="text-right">Total Return</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">5th (Worst)</TableCell>
              <TableCell className="text-right">${simulationResults.stats.percentiles.p5.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
              <TableCell className="text-right">{calculateGrowthRate(simulationResults.stats.percentiles.p5).toFixed(2)}%</TableCell>
              <TableCell className="text-right">{((simulationResults.stats.percentiles.p5 / initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">25th</TableCell>
              <TableCell className="text-right">${simulationResults.stats.percentiles.p25.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
              <TableCell className="text-right">{calculateGrowthRate(simulationResults.stats.percentiles.p25).toFixed(2)}%</TableCell>
              <TableCell className="text-right">{((simulationResults.stats.percentiles.p25 / initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">50th (Median)</TableCell>
              <TableCell className="text-right">${simulationResults.stats.percentiles.p50.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
              <TableCell className="text-right">{calculateGrowthRate(simulationResults.stats.percentiles.p50).toFixed(2)}%</TableCell>
              <TableCell className="text-right">{((simulationResults.stats.percentiles.p50 / initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">75th</TableCell>
              <TableCell className="text-right">${simulationResults.stats.percentiles.p75.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
              <TableCell className="text-right">{calculateGrowthRate(simulationResults.stats.percentiles.p75).toFixed(2)}%</TableCell>
              <TableCell className="text-right">{((simulationResults.stats.percentiles.p75 / initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">95th (Best)</TableCell>
              <TableCell className="text-right">${simulationResults.stats.percentiles.p95.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
              <TableCell className="text-right">{calculateGrowthRate(simulationResults.stats.percentiles.p95).toFixed(2)}%</TableCell>
              <TableCell className="text-right">{((simulationResults.stats.percentiles.p95 / initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Simulation Summary</h4>
          <ul className="text-sm space-y-1">
            <li><span className="text-muted-foreground">Mean Final Value:</span> ${simulationResults.stats.mean.toLocaleString(undefined, {maximumFractionDigits: 0})}</li>
            <li><span className="text-muted-foreground">Standard Deviation:</span> ${simulationResults.stats.stdDev.toLocaleString(undefined, {maximumFractionDigits: 0})}</li>
            <li><span className="text-muted-foreground">Maximum Drawdown:</span> {(simulationResults.stats.maxDrawdown * 100).toFixed(2)}%</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Simulation Parameters</h4>
          <ul className="text-sm space-y-1">
            <li><span className="text-muted-foreground">Initial Investment:</span> ${initialInvestment.toLocaleString()}</li>
            <li><span className="text-muted-foreground">Expected Annual Return:</span> {(annualReturn * 100).toFixed(2)}%</li>
            <li><span className="text-muted-foreground">Annual Volatility:</span> {(annualVolatility * 100).toFixed(2)}%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
