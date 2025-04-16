
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";
import { ChartDataPoint } from "./types";

interface MonthlyReturnsChartProps {
  data: ChartDataPoint[];
}

export function MonthlyReturnsChart({ data }: MonthlyReturnsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `${value}%`} />
        <Tooltip formatter={(value) => [`${value}%`, 'Return']} />
        <Bar dataKey="return">
          {
            data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.return && entry.return >= 0 ? '#10B981' : '#EF4444'} 
              />
            ))
          }
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
