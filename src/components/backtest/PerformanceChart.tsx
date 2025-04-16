
import { PerformanceChartProps } from "./charts/types";
import { useChartData } from "./hooks/useChartData";
import { ChartSelector } from "./charts/ChartSelector";

export function PerformanceChart({ chartType }: PerformanceChartProps) {
  // Use our custom hook to fetch and manage chart data
  const { data } = useChartData(chartType);

  // Render the appropriate chart based on type
  return <ChartSelector chartType={chartType} data={data} />;
}
