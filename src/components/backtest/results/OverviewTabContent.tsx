
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
        <Card variant="glass-intense" className="shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              P&L Overview
            </CardTitle>
            <CardDescription>Cumulative profit and loss over trades</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <SimpleEquityChart />
          </CardContent>
        </Card>
        
        <Card variant="glass-intense" className="lg:col-span-2 shadow-xl backdrop-blur-xl">
          <CardContent className="p-0">
            <DailyPnLChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
