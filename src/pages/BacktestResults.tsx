
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacktestFilters } from "@/components/backtest/BacktestFilters";
import { BacktestResultsHeader } from "@/components/backtest/results/BacktestResultsHeader";
import { OverviewTabContent } from "@/components/backtest/results/OverviewTabContent";
import { PerformanceTabContent } from "@/components/backtest/results/PerformanceTabContent";
import { TradesTabContent } from "@/components/backtest/results/TradesTabContent";
import { RiskTabContent } from "@/components/backtest/results/RiskTabContent";
import { CompareTabContent } from "@/components/backtest/results/CompareTabContent";
import { useBacktestData } from "@/hooks/useBacktestData";

export default function BacktestResults() {
  const [activeTab, setActiveTab] = useState("overview");
  const { backtestData } = useBacktestData();
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <BacktestResultsHeader backtestData={backtestData} />

      <BacktestFilters />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <OverviewTabContent />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6 bg-background rounded-lg p-6">
          <PerformanceTabContent />
        </TabsContent>
        
        <TabsContent value="trades" className="space-y-6">
          <TradesTabContent />
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-6">
          <RiskTabContent />
        </TabsContent>
        
        <TabsContent value="compare" className="space-y-6">
          <CompareTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
