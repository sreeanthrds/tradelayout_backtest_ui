
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
  const [activeTab, setActiveTab] = useState("performance");
  const { backtestData } = useBacktestData();
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <BacktestResultsHeader backtestData={backtestData} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <ResultsSummary data={backtestData} />
      </div>

      <BacktestFilters />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6 bg-background rounded-lg p-6">
          <PerformanceTabContent />
        </TabsContent>
        
        <TabsContent value="trades">
          <TradesTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
