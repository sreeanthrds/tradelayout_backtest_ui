
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ChartDataPoint } from "./types";

interface DetailedChartProps {
  data: ChartDataPoint[];
}

export function DetailedChart({ data }: DetailedChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="equity" 
          stroke="#3B82F6" 
          dot={false}
        />
        <Bar 
          yAxisId="right"
          dataKey="volatility" 
          fill="#8884d8" 
          opacity={0.5}
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="drawdown"
          stroke="#EF4444"
          fill="#EF4444"
          opacity={0.3}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
