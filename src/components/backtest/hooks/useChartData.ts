
import { useState, useEffect } from "react";
import { ChartType, ChartDataPoint } from "../charts/types";
import { generateChartData } from "../charts/chartDataGenerators";

export function useChartData(chartType: ChartType) {
  const [data, setData] = useState<ChartDataPoint[]>([]);

  // Generate different example data based on chart type
  useEffect(() => {
    console.log('Generating chart data for type:', chartType);
    const generatedData = generateChartData(chartType);
    console.log('Generated Data:', generatedData);
    setData(generatedData);
  }, [chartType]);

  return { data };
}
