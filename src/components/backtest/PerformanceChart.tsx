
import { PerformanceChartProps } from "./charts/types";
import { useChartData } from "./hooks/useChartData";
import { ChartSelector } from "./charts/ChartSelector";
import { useState, useEffect } from "react";

export function PerformanceChart({ chartType }: PerformanceChartProps) {
  const { data } = useChartData(chartType);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Performance Chart Data:', data);
    if (!data || data.length === 0) {
      setError('No chart data available');
    }
  }, [data]);

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded">
        {error}
      </div>
    );
  }

  // Render the appropriate chart based on type
  return (
    <div className="h-[400px] w-full">
      <ChartSelector chartType={chartType} data={data} />
    </div>
  );
}
