
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparisonTool } from "@/components/backtest/ComparisonTool";

export function CompareTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Comparison</CardTitle>
        <CardDescription>Compare with other strategies or benchmarks</CardDescription>
      </CardHeader>
      <CardContent>
        <ComparisonTool />
      </CardContent>
    </Card>
  );
}
