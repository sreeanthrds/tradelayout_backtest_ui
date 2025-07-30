
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComprehensiveMetricsCards } from "./ComprehensiveMetricsCards";
import { SimpleEquityChart } from "./SimpleEquityChart";
import { DailyPnLChart } from "./DailyPnLChart";

export function OverviewTabContent() {
  return (
    <div className="space-y-6">
      {/* Comprehensive Metrics Cards */}
      <ComprehensiveMetricsCards />
      
      {/* New Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-foreground">
              P&L Overview
            </CardTitle>
            <CardDescription>Cumulative profit and loss over trades</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <SimpleEquityChart />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 shadow-sm border">
          <CardContent className="p-0">
            <DailyPnLChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
