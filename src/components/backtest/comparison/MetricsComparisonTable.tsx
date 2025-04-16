
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsComparisonTableProps } from "./types";

export function MetricsComparisonTable({
  metricsComparisonData,
  selectedStrategies,
}: MetricsComparisonTableProps) {
  // Helper function to determine styling based on metric values
  const getMetricStyle = (metric: string, value: string | number, allValues: (string | number)[]): string => {
    let className = "text-right";
    
    if (typeof value === 'string') {
      const numericValue = parseFloat(value);
      const numericValues = allValues.map(v => typeof v === 'string' ? parseFloat(v) : v);
      
      if (["Total Return", "Sharpe Ratio", "Win Rate"].includes(metric)) {
        const maxVal = Math.max(...numericValues);
        if (numericValue === maxVal) {
          className += " font-bold text-emerald-600";
        }
      } else if (["Max Drawdown", "Volatility"].includes(metric)) {
        const minVal = Math.min(...numericValues);
        if (numericValue === minVal) {
          className += " font-bold text-emerald-600";
        }
      }
    }
    
    return className;
  };

  return (
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
              <TableRow key={row.metric as string}>
                <TableCell className="font-medium">{row.metric}</TableCell>
                {selectedStrategies.map((strategy) => {
                  const value = row[strategy as keyof typeof row];
                  const allValues = selectedStrategies.map(s => row[s as keyof typeof row]);
                  
                  return (
                    <TableCell 
                      key={strategy} 
                      className={getMetricStyle(row.metric as string, value, allValues)}
                    >
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
  );
}
