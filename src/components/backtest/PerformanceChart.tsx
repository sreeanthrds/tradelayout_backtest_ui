
import { PerformanceChartProps } from "./charts/types";
import { useChartData } from "./hooks/useChartData";
import { ChartSelector } from "./charts/ChartSelector";
import { ChartErrorBoundary } from "./charts/ChartErrorBoundary";
import { useState, useEffect } from "react";

export function PerformanceChart({ chartType }: PerformanceChartProps) {
  const { data, isLoading, error } = useChartData(chartType);
  const [noDataError, setNoDataError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Performance Chart Data:', data);
    if (!isLoading && (!data || data.length === 0)) {
      setNoDataError('No chart data available');
    } else {
      setNoDataError(null);
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full bg-gray-50 rounded animate-pulse">
        <p className="text-gray-400">Loading chart data...</p>
      </div>
    );
  }

  if (error || noDataError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="font-medium">{error ? 'Error loading chart data' : noDataError}</p>
          {error && <p className="text-sm mt-2">{error.message}</p>}
        </div>
      </div>
    );
  }

  // Render the appropriate chart based on type, wrapped in error boundary
  return (
    <div className="h-[400px] w-full">
      <ChartErrorBoundary>
        <ChartSelector chartType={chartType} data={data} />
      </ChartErrorBoundary>
    </div>
  );
}
