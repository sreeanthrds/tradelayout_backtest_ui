import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function ComparisonTool() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([
    "Iron Condor",
    "SPY Buy and Hold",
  ]);

  // Mock strategies and comparison data
  const availableStrategies = [
    "Iron Condor",
    "Bull Put Spread",
    "Bear Call Spread",
    "Short Strangle",
    "Long Straddle",
    "SPY Buy and Hold",
    "QQQ Buy and Hold",
  ];

  const comparisonData = Array.from({ length: 24 }, (_, i) => {
    // Create somewhat realistic comparison data
    const date = new Date(2022, i % 12, 1).toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    });
    
    return {
      date,
      "Iron Condor": 10000 * Math.pow(1.008, i) + (Math.random() * 300 - 150),
      "Bull Put Spread": 10000 * Math.pow(1.0095, i) + (Math.random() * 400 - 200),
      "SPY Buy and Hold": 10000 * Math.pow(1.006, i) + (Math.random() * 250 - 125),
    };
  });

  const metricsComparisonData = [
    {
      metric: "Total Return",
      "Iron Condor": "18.7%",
      "Bull Put Spread": "22.3%",
      "SPY Buy and Hold": "15.2%",
    },
    {
      metric: "Max Drawdown",
      "Iron Condor": "-12.5%",
      "Bull Put Spread": "-14.8%",
      "SPY Buy and Hold": "-18.3%",
    },
    {
      metric: "Sharpe Ratio",
      "Iron Condor": "1.42",
      "Bull Put Spread": "1.36",
      "SPY Buy and Hold": "0.98",
    },
    {
      metric: "Win Rate",
      "Iron Condor": "68.2%",
      "Bull Put Spread": "72.5%",
      "SPY Buy and Hold": "58.3%",
    },
    {
      metric: "Volatility",
      "Iron Condor": "15.7%",
      "Bull Put Spread": "18.2%",
      "SPY Buy and Hold": "19.5%",
    },
  ];

  const strategyColors: Record<string, string> = {
    "Iron Condor": "#3B82F6",
    "Bull Put Spread": "#10B981",
    "Bear Call Spread": "#EF4444",
    "Short Strangle": "#8B5CF6",
    "Long Straddle": "#F59E0B",
    "SPY Buy and Hold": "#6B7280",
    "QQQ Buy and Hold": "#EC4899",
  };

  const addStrategy = (strategy: string) => {
    if (!selectedStrategies.includes(strategy)) {
      setSelectedStrategies([...selectedStrategies, strategy]);
    }
  };

  const removeStrategy = (strategy: string) => {
    setSelectedStrategies(
      selectedStrategies.filter((s) => s !== strategy)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <ScrollArea className="max-w-[600px]">
            <div className="flex gap-2">
              {selectedStrategies.map((strategy) => (
                <Badge
                  key={strategy}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-1"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: strategyColors[strategy] }}
                  ></span>
                  {strategy}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-muted"
                    onClick={() => removeStrategy(strategy)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Strategy
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {availableStrategies
                .filter((s) => !selectedStrategies.includes(s))
                .map((strategy) => (
                  <DropdownMenuItem
                    key={strategy}
                    onClick={() => addStrategy(strategy)}
                  >
                    <span
                      className="h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: strategyColors[strategy] }}
                    ></span>
                    {strategy}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Metrics Comparison</CardTitle>
          <CardDescription>
            Side-by-side metrics comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                {selectedStrategies.map((strategy) => (
                  <TableHead key={strategy} className="text-right">
                    {strategy}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metricsComparisonData.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  {selectedStrategies.map((strategy) => {
                    const value = row[strategy as keyof typeof row];
                    let className = "text-right";
                    
                    // Conditionally style certain metrics based on what's better
                    if (row.metric === "Total Return" || row.metric === "Sharpe Ratio" || row.metric === "Win Rate") {
                      const values = selectedStrategies.map(s => {
                        const val = row[s as keyof typeof row];
                        return typeof val === 'string' ? parseFloat(val) : 0;
                      });
                      const maxVal = Math.max(...values);
                      if (value && parseFloat(value as string) === maxVal) {
                        className += " font-bold text-emerald-600";
                      }
                    } else if (row.metric === "Max Drawdown" || row.metric === "Volatility") {
                      const values = selectedStrategies.map(s => {
                        const val = row[s as keyof typeof row];
                        return typeof val === 'string' ? parseFloat(val) : 0;
                      });
                      const minVal = Math.min(...values);
                      if (value && parseFloat(value as string) === minVal) {
                        className += " font-bold text-emerald-600";
                      }
                    }
                    
                    return (
                      <TableCell key={strategy} className={className}>
                        {value || "N/A"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
