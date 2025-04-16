
import { Button } from "@/components/ui/button";
import { useMonteCarloSimulation } from "./hooks/useMonteCarloSimulation";
import { MonteCarloChart } from "./components/MonteCarloChart";
import { MonteCarloTable } from "./components/MonteCarloTable";
import { MonteCarloSummary } from "./components/MonteCarloSummary";

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
  const { isSimulating, results, runSimulation } = useMonteCarloSimulation({
    initialInvestment,
    annualReturn,
    annualVolatility,
    years: simulationYears,
    paths: simulationPaths,
  });

  if (isSimulating) {
    return <div className="flex justify-center items-center h-60">Running simulation...</div>;
  }

  if (!results) {
    return <div className="flex justify-center items-center h-60">No simulation data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Monte Carlo Simulation</h3>
          <p className="text-sm text-muted-foreground">
            {results.stats.paths.toLocaleString()} paths over {results.stats.years} years
          </p>
        </div>
        <Button size="sm" onClick={runSimulation} disabled={isSimulating}>
          Resimulate
        </Button>
      </div>

      <MonteCarloChart 
        data={results.chartData} 
        initialInvestment={initialInvestment} 
      />

      <MonteCarloTable results={results} />

      <MonteCarloSummary 
        results={results}
        annualReturn={annualReturn}
        annualVolatility={annualVolatility}
      />
    </div>
  );
}
