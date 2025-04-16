
import React from "react";
import { SimulationResults } from "../hooks/useMonteCarloSimulation";

interface MonteCarloSummaryProps {
  results: SimulationResults;
  annualReturn: number;
  annualVolatility: number;
}

export function MonteCarloSummary({ 
  results, 
  annualReturn, 
  annualVolatility 
}: MonteCarloSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Simulation Summary</h4>
        <ul className="text-sm space-y-1">
          <li><span className="text-muted-foreground">Mean Final Value:</span> ${results.stats.mean.toLocaleString(undefined, {maximumFractionDigits: 0})}</li>
          <li><span className="text-muted-foreground">Standard Deviation:</span> ${results.stats.stdDev.toLocaleString(undefined, {maximumFractionDigits: 0})}</li>
          <li><span className="text-muted-foreground">Maximum Drawdown:</span> {(results.stats.maxDrawdown * 100).toFixed(2)}%</li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Simulation Parameters</h4>
        <ul className="text-sm space-y-1">
          <li><span className="text-muted-foreground">Initial Investment:</span> ${results.stats.initialInvestment.toLocaleString()}</li>
          <li><span className="text-muted-foreground">Expected Annual Return:</span> {(annualReturn * 100).toFixed(2)}%</li>
          <li><span className="text-muted-foreground">Annual Volatility:</span> {(annualVolatility * 100).toFixed(2)}%</li>
        </ul>
      </div>
    </div>
  );
}
