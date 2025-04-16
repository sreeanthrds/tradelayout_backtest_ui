
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsSummary } from "@/components/backtest/ResultsSummary";
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
          <OverviewTabContent />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceTabContent />
        </TabsContent>
        
        <TabsContent value="trades">
          <TradesTabContent />
        </TabsContent>
        
        <TabsContent value="risk">
          <RiskTabContent />
        </TabsContent>
        
        <TabsContent value="compare">
          <CompareTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
