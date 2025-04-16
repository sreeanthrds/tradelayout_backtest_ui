
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsComparisonTableProps {
  metricsComparisonData: Array<Record<string, string | number>>;
  selectedStrategies: string[];
}

export function MetricsComparisonTable({
  metricsComparisonData,
  selectedStrategies,
}: MetricsComparisonTableProps) {
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
  );
}
