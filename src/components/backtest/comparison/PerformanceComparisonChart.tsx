
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { strategyColors } from "./comparisonUtils";
import { PerformanceComparisonChartProps } from "./types";

export function PerformanceComparisonChart({
  comparisonData,
  selectedStrategies,
}: PerformanceComparisonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
        <CardDescription>
          Compare equity curves across strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={comparisonData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${typeof value === 'number' ? value.toFixed(2) : value}`, '']} 
              />
              <Legend />
              {selectedStrategies.map((strategy) => (
                <Line
                  key={strategy}
                  type="monotone"
                  dataKey={strategy}
                  name={strategy}
                  stroke={strategyColors[strategy]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
