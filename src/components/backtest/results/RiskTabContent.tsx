
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskMetrics } from "@/components/backtest/RiskMetrics";

export function RiskTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Analysis</CardTitle>
        <CardDescription>Risk metrics and exposure analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <RiskMetrics />
      </CardContent>
    </Card>
  );
}
