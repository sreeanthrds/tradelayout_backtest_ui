
import { useState, useEffect } from "react";
import { ChartType, ChartDataPoint } from "../charts/types";
import { generateChartData } from "../charts/chartDataGenerators";

export function useChartData(chartType: ChartType) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Generate different example data based on chart type
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Generating chart data for type:', chartType);
      const generatedData = generateChartData(chartType);
      
      if (!generatedData || generatedData.length === 0) {
        throw new Error(`No data generated for chart type: ${chartType}`);
      }
      
      console.log('Generated Data:', generatedData);
      setData(generatedData);
    } catch (err) {
      console.error(`Error in useChartData for ${chartType}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [chartType]);

  return { data, isLoading, error };
}
