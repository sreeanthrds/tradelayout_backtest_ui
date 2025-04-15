
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ChartType = "equity" | "monthly" | "distribution" | "drawdown" | "detailed";

interface PerformanceChartProps {
  chartType: ChartType;
}

export function PerformanceChart({ chartType }: PerformanceChartProps) {
  // This is mock data - in a real application, you would fetch this from your API
  const [data, setData] = useState<any[]>([]);

  // Generate different example data based on chart type
  useEffect(() => {
    const generateMockData = () => {
      switch (chartType) {
        case "equity":
          return Array.from({ length: 24 }, (_, i) => {
            // Create a somewhat realistic equity curve
            const baseValue = 10000;
            const trend = Math.pow(1.01, i); // slight upward trend
            const volatility = Math.random() * 500 - 250; // add some noise
            const value = baseValue * trend + volatility;
            
            return {
              date: new Date(2022, i % 12, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
              value: Math.round(value),
              baseline: baseValue
            };
          });
          
        case "monthly":
          return Array.from({ length: 12 }, (_, i) => {
            const returns = Math.random() * 10 - 3; // returns between -3% and 7%
            return {
              month: new Date(2023, i, 1).toLocaleDateString('en-US', { month: 'short' }),
              return: parseFloat(returns.toFixed(2))
            };
          });
          
        case "distribution":
          const winCount = 32;
          const lossCount = 15;
          return [
            { name: "Wins", value: winCount, color: "#10B981" },
            { name: "Losses", value: lossCount, color: "#EF4444" }
          ];
          
        case "drawdown":
          return Array.from({ length: 24 }, (_, i) => {
            // Create drawdown periods
            let drawdown = 0;
            if (i > 5 && i < 10) drawdown = -1 - Math.random() * 8; // first drawdown period
            if (i > 15 && i < 19) drawdown = -2 - Math.random() * 10; // second drawdown period
            
            return {
              date: new Date(2022, i % 12, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
              drawdown: parseFloat(drawdown.toFixed(2))
            };
          });
          
        case "detailed":
          // This would be a more complex chart, just using a placeholder here
          return Array.from({ length: 24 }, (_, i) => {
            return {
              date: new Date(2022, i % 12, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
              equity: 10000 * Math.pow(1.01, i) + (Math.random() * 500 - 250),
              drawdown: i > 15 && i < 19 ? -2 - Math.random() * 10 : 0,
              volatility: 5 + Math.random() * 3
            };
          });
          
        default:
          return [];
      }
    };
    
    setData(generateMockData());
  }, [chartType]);

  const renderChart = () => {
    switch (chartType) {
      case "equity":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => [`$${value}`, 'Portfolio Value']} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#9CA3AF"
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "monthly":
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
                      fill={entry.return >= 0 ? '#10B981' : '#EF4444'} 
                    />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "distribution":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip />
              <Bar dataKey="value" barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "drawdown":
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
        
      case "detailed":
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
        
      default:
        return <div>No chart data available</div>;
    }
  };

  return renderChart();
}
