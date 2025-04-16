
import { ChartType, ChartDataPoint } from "./types";
import { EquityChart } from "./EquityChart";
import { MonthlyReturnsChart } from "./MonthlyReturnsChart";
import { DistributionChart } from "./DistributionChart";
import { DrawdownChart } from "./DrawdownChart";
import { DetailedChart } from "./DetailedChart";

interface ChartSelectorProps {
  chartType: ChartType;
  data: ChartDataPoint[];
}

export function ChartSelector({ chartType, data }: ChartSelectorProps) {
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
}
