
import { useState, useEffect } from "react";
import { ChartType, PerformanceChartProps } from "./charts/types";
import { generateChartData } from "./charts/chartDataGenerators";
import { EquityChart } from "./charts/EquityChart";
import { MonthlyReturnsChart } from "./charts/MonthlyReturnsChart";
import { DistributionChart } from "./charts/DistributionChart";
import { DrawdownChart } from "./charts/DrawdownChart";
import { DetailedChart } from "./charts/DetailedChart";

export function PerformanceChart({ chartType }: PerformanceChartProps) {
  // This is mock data - in a real application, you would fetch this from your API
  const [data, setData] = useState<any[]>([]);

  // Generate different example data based on chart type
  useEffect(() => {
    setData(generateChartData(chartType));
  }, [chartType]);

  const renderChart = () => {
    switch (chartType) {
      case "equity":
        return <EquityChart data={data} />;
        
      case "monthly":
        return <MonthlyReturnsChart data={data} />;
        
      case "distribution":
        return <DistributionChart data={data} />;
        
      case "drawdown":
        return <DrawdownChart data={data} />;
        
      case "detailed":
        return <DetailedChart data={data} />;
        
      default:
        return <div>No chart data available</div>;
    }
  };

  return renderChart();
}
