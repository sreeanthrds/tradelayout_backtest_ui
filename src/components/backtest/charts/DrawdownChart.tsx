
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ChartDataPoint } from "./types";

interface DrawdownChartProps {
  data: ChartDataPoint[];
}

export function DrawdownChart({ data }: DrawdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => `${value}%`} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={(value) => [`${value}%`, 'Drawdown']} />
        <Area
          type="monotone"
          dataKey="drawdown"
          stroke="#EF4444"
          fillOpacity={1}
          fill="url(#colorDrawdown)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
