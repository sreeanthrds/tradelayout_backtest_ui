
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface CorrelationData {
  name: string;
  strategy: number;
  sp500: number;
  nasdaq: number;
  russell2000: number;
  vix: number;
  bonds: number;
}

interface CorrelationMatrixProps {
  data: CorrelationData[];
}

export function CorrelationMatrix({ data }: CorrelationMatrixProps) {
  const [selectedIndex, setSelectedIndex] = useState<string>("strategy");
  
  // Transform data for the table display
  const indices = ["strategy", "sp500", "nasdaq", "russell2000", "vix", "bonds"];
  const indexNames = {
    strategy: "Strategy",
    sp500: "S&P 500",
    nasdaq: "NASDAQ",
    russell2000: "Russell 2000",
    vix: "VIX",
    bonds: "US Bonds"
  };

  // Format correlation value with color based on strength
  const formatCorrelation = (value: number) => {
    const getColor = (val: number) => {
      const absVal = Math.abs(val);
      if (absVal >= 0.7) return val > 0 ? "text-red-600" : "text-blue-600";
      if (absVal >= 0.4) return val > 0 ? "text-orange-500" : "text-blue-400";
      return "text-gray-600";
    };
    
    return (
      <span className={getColor(value)}>
        {value.toFixed(2)}
      </span>
    );
  };

  // Generate bar chart data for selected index
  const barChartData = indices.filter(idx => idx !== selectedIndex).map(idx => ({
    name: indexNames[idx as keyof typeof indexNames],
    correlation: data.find(item => item.name === selectedIndex)?.[idx as keyof CorrelationData] as number || 0
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-3">Correlation Table</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Asset</TableHead>
                  {indices.map(idx => (
                    <TableHead key={idx} className="text-center">
                      {indexNames[idx as keyof typeof indexNames]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {indices.map(rowIdx => (
                  <TableRow 
                    key={rowIdx}
                    className={rowIdx === selectedIndex ? "bg-muted/50" : ""}
                    onClick={() => setSelectedIndex(rowIdx)}
                  >
                    <TableCell className="font-medium">
                      {indexNames[rowIdx as keyof typeof indexNames]}
                    </TableCell>
                    {indices.map(colIdx => (
                      <TableCell key={colIdx} className="text-center">
                        {rowIdx === colIdx ? (
                          <span className="text-gray-600">1.00</span>
                        ) : (
                          formatCorrelation(
                            data.find(item => item.name === rowIdx)?.[colIdx as keyof CorrelationData] as number || 0
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Click on any row to see the correlation chart. Strong positive correlations (>0.7) are shown in red, strong negative correlations in blue.</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Correlation with {indexNames[selectedIndex as keyof typeof indexNames]}</h3>
            <div className="flex space-x-2">
              {indices.map(idx => (
                <Button 
                  key={idx}
                  size="sm"
                  variant={idx === selectedIndex ? "default" : "outline"}
                  onClick={() => setSelectedIndex(idx)}
                >
                  {indexNames[idx as keyof typeof indexNames].split(" ")[0]}
                </Button>
              ))}
            </div>
          </div>
          
          <ChartContainer 
            className="h-[250px]"
            config={{
              positive: { color: "#ef4444" },
              negative: { color: "#3b82f6" },
              neutral: { color: "#9ca3af" }
            }}
          >
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              layout="vertical"
            >
              <XAxis 
                type="number" 
                domain={[-1, 1]} 
                ticks={[-1, -0.5, 0, 0.5, 1]} 
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100} 
              />
              <Tooltip
                formatter={(value: number) => [value.toFixed(2), "Correlation"]}
              />
              <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.correlation > 0 
                      ? (Math.abs(entry.correlation) > 0.7 ? "#ef4444" : 
                         Math.abs(entry.correlation) > 0.4 ? "#f97316" : "#9ca3af")
                      : (Math.abs(entry.correlation) > 0.7 ? "#3b82f6" : 
                         Math.abs(entry.correlation) > 0.4 ? "#60a5fa" : "#9ca3af")
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-3">Correlation Analysis</h3>
        <p className="text-sm">
          This correlation analysis shows how your strategy returns are related to major market indices. 
          A correlation close to 1 indicates the strategy moves in the same direction as the index, 
          while a correlation close to -1 indicates opposite movements. A correlation near 0 suggests 
          little relationship between the strategy and the index.
        </p>
        <ul className="mt-3 space-y-1 text-sm list-disc pl-5">
          <li><span className="font-medium">S&P 500:</span> {data.find(item => item.name === "strategy")?.sp500.toFixed(2)} correlation indicates {interpretCorrelation(data.find(item => item.name === "strategy")?.sp500 || 0)}.</li>
          <li><span className="font-medium">NASDAQ:</span> {data.find(item => item.name === "strategy")?.nasdaq.toFixed(2)} correlation indicates {interpretCorrelation(data.find(item => item.name === "strategy")?.nasdaq || 0)}.</li>
          <li><span className="font-medium">Russell 2000:</span> {data.find(item => item.name === "strategy")?.russell2000.toFixed(2)} correlation indicates {interpretCorrelation(data.find(item => item.name === "strategy")?.russell2000 || 0)}.</li>
          <li><span className="font-medium">VIX:</span> {data.find(item => item.name === "strategy")?.vix.toFixed(2)} correlation indicates {interpretCorrelation(data.find(item => item.name === "strategy")?.vix || 0)}.</li>
          <li><span className="font-medium">US Bonds:</span> {data.find(item => item.name === "strategy")?.bonds.toFixed(2)} correlation indicates {interpretCorrelation(data.find(item => item.name === "strategy")?.bonds || 0)}.</li>
        </ul>
      </div>
    </div>
  );
}

// Helper function to interpret correlation values
function interpretCorrelation(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 0.7) {
    return value > 0
      ? "strong positive relationship"
      : "strong negative relationship";
  } else if (absValue >= 0.4) {
    return value > 0
      ? "moderate positive relationship"
      : "moderate negative relationship";
  } else if (absValue >= 0.2) {
    return value > 0
      ? "weak positive relationship"
      : "weak negative relationship";
  } else {
    return "very little relationship";
  }
}
