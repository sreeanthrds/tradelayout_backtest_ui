
import { useState } from "react";
import { ComparisonStrategySelector } from "./comparison/ComparisonStrategySelector";
import { PerformanceComparisonChart } from "./comparison/PerformanceComparisonChart";
import { MetricsComparisonTable } from "./comparison/MetricsComparisonTable";
import { 
  availableStrategies, 
  generateComparisonData, 
  generateMetricsComparisonData 
} from "./comparison/comparisonUtils";

export function ComparisonTool() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([
    "Iron Condor",
    "SPY Buy and Hold",
  ]);

  // Use the utility functions to generate data
  const comparisonData = generateComparisonData();
  const metricsComparisonData = generateMetricsComparisonData();

  const addStrategy = (strategy: string) => {
    if (!selectedStrategies.includes(strategy)) {
      setSelectedStrategies([...selectedStrategies, strategy]);
    }
  };

  const removeStrategy = (strategy: string) => {
    setSelectedStrategies(
      selectedStrategies.filter((s) => s !== strategy)
    );
  };

  return (
    <div className="space-y-6">
      <ComparisonStrategySelector
        selectedStrategies={selectedStrategies}
        availableStrategies={availableStrategies}
        onAddStrategy={addStrategy}
        onRemoveStrategy={removeStrategy}
      />

      <PerformanceComparisonChart
        comparisonData={comparisonData}
        selectedStrategies={selectedStrategies}
      />

      <MetricsComparisonTable
        metricsComparisonData={metricsComparisonData}
        selectedStrategies={selectedStrategies}
      />
    </div>
  );
}
