
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsSummary } from "@/components/backtest/ResultsSummary";
import { PerformanceChart } from "@/components/backtest/PerformanceChart";
import { TradesList } from "@/components/backtest/TradesList";
import { RiskMetrics } from "@/components/backtest/RiskMetrics";
import { ComparisonTool } from "@/components/backtest/ComparisonTool";
import { BacktestFilters } from "@/components/backtest/BacktestFilters";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownToLine, 
  Share2, 
  Copy, 
  Save, 
  ChevronLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BacktestResults() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  // This would typically come from your actual backtest results
  const backtestData = {
    name: "Iron Condor Strategy",
    symbol: "SPY",
    period: "Jan 2022 - Dec 2023",
    totalReturn: 18.7,
    winRate: 68.2,
    maxDrawdown: -12.5,
    sharpeRatio: 1.42,
    trades: 47
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{backtestData.name}</h1>
            <p className="text-muted-foreground">
              {backtestData.symbol} • {backtestData.period} • {backtestData.trades} trades
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button size="sm">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <ResultsSummary data={backtestData} />
      </div>

      <BacktestFilters />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart chartType="detailed" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Detailed view of all trades</CardDescription>
            </CardHeader>
            <CardContent>
              <TradesList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
              <CardDescription>Risk metrics and exposure analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <RiskMetrics />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
              <CardDescription>Compare with other strategies or benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonTool />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
