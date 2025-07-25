
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacktestFilters } from "@/components/backtest/BacktestFilters";
import { BacktestResultsHeader } from "@/components/backtest/results/BacktestResultsHeader";
import { OverviewTabContent } from "@/components/backtest/results/OverviewTabContent";
import { TradesTabContent } from "@/components/backtest/results/TradesTabContent";
import { useBacktestData } from "@/hooks/useBacktestData";
import { tradeService } from "@/services/TradeDataService";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function BacktestResults() {
  const [activeTab, setActiveTab] = useState("overview");
  const { backtestData } = useBacktestData();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there are valid backtest parameters
    // If no parameters exist, it means user accessed this page directly without running a backtest
    const parameters = tradeService.getBacktestParameters();
    
    if (!parameters) {
      // Redirect to home page if no valid backtest was run
      navigate("/", { replace: true });
      return;
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="glass-intense rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Backtest Results
              </h1>
              <p className="text-muted-foreground mt-1">Comprehensive analysis of your trading strategy</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="glass-intense rounded-2xl p-6 mb-6">
          <BacktestResultsHeader backtestData={backtestData} />
        </div>

        <div className="glass rounded-2xl p-4 mb-6">
          <BacktestFilters />
        </div>

        <div className="glass-intense rounded-2xl p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="neomorph grid w-full grid-cols-2 lg:w-auto p-1">
              <TabsTrigger value="overview" className="data-[state=active]:neomorph-inset">Overview</TabsTrigger>
              <TabsTrigger value="trades" className="data-[state=active]:neomorph-inset">Trades</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <OverviewTabContent />
            </TabsContent>
            
            <TabsContent value="trades" className="space-y-6">
              <TradesTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
