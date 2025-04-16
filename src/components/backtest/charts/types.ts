
export type ChartType = "equity" | "monthly" | "distribution" | "drawdown" | "detailed";

export interface PerformanceChartProps {
  chartType: ChartType;
}

export interface ChartDataPoint {
  date?: string;
  month?: string;
  name?: string;
  value?: number;
  return?: number;
  drawdown?: number;
  equity?: number;
  volatility?: number;
  baseline?: number;
  color?: string;
}
