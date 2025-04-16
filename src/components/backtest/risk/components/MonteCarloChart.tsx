
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { SimulationResults } from "../hooks/useMonteCarloSimulation";

interface MonteCarloChartProps {
  data: SimulationResults["chartData"];
  initialInvestment: number;
}

export function MonteCarloChart({ data, initialInvestment }: MonteCarloChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis 
            label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }} 
            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="p5" 
            stackId="1"
            stroke="#8884d8" 
            fill="#8884d8"
            fillOpacity={0.1}
            name="5th Percentile" 
          />
          <Area 
            type="monotone" 
            dataKey="median" 
            stackId="2"
            stroke="#82ca9d" 
            fill="#82ca9d"
            fillOpacity={0.1}
            name="Median" 
          />
          <Area 
            type="monotone" 
            dataKey="p95" 
            stackId="3"
            stroke="#ffc658" 
            fill="#ffc658"
            fillOpacity={0.1}
            name="95th Percentile" 
          />
          <ReferenceLine 
            y={initialInvestment} 
            stroke="red" 
            strokeDasharray="3 3"
            label="Initial Investment" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
