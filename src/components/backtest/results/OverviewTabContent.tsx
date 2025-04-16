
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart } from "@/components/backtest/PerformanceChart";

export function OverviewTabContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
            <CardDescription>Cumulative returns over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PerformanceChart chartType="equity" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Returns (%)</CardTitle>
            <CardDescription>Performance breakdown by month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PerformanceChart chartType="monthly" />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Distribution</CardTitle>
            <CardDescription>Trade outcome analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PerformanceChart chartType="distribution" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Drawdown Periods</CardTitle>
            <CardDescription>Maximum drawdown analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PerformanceChart chartType="drawdown" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
