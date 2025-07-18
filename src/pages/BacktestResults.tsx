
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacktestFilters } from "@/components/backtest/BacktestFilters";
import { BacktestResultsHeader } from "@/components/backtest/results/BacktestResultsHeader";
import { OverviewTabContent } from "@/components/backtest/results/OverviewTabContent";
import { TradesTabContent } from "@/components/backtest/results/TradesTabContent";
import { useBacktestData } from "@/hooks/useBacktestData";

export default function BacktestResults() {
  const [activeTab, setActiveTab] = useState("overview");
  const { backtestData } = useBacktestData();
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <BacktestResultsHeader backtestData={backtestData} />

      <BacktestFilters />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <OverviewTabContent />
        </TabsContent>
        
        <TabsContent value="trades" className="space-y-6">
          <TradesTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
