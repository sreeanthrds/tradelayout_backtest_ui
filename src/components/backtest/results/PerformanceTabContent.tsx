
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart } from "@/components/backtest/PerformanceChart";

export function PerformanceTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <PerformanceChart chartType="detailed" />
      </CardContent>
    </Card>
  );
}
