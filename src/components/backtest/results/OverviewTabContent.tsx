
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComprehensiveMetricsCards } from "./ComprehensiveMetricsCards";
import { SimpleEquityChart } from "./SimpleEquityChart";
import { DailyPnLChart } from "./DailyPnLChart";

export function OverviewTabContent() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Comprehensive Metrics Cards */}
      <ComprehensiveMetricsCards />
      
      {/* New Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <Card className="shadow-sm border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-foreground text-base sm:text-lg">
              P&L Overview
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Cumulative profit and loss over trades</CardDescription>
          </CardHeader>
          <CardContent className="h-48 sm:h-64">
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
