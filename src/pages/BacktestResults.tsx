
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacktestFilters } from "@/components/backtest/BacktestFilters";
import { OverviewTabContent } from "@/components/backtest/results/OverviewTabContent";
import { TradesTabContent } from "@/components/backtest/results/TradesTabContent";
import { BacktestForm } from "@/components/backtest/settings/BacktestForm";
import { useBacktestData } from "@/hooks/useBacktestData";
import { tradeService } from "@/services/TradeDataService";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function BacktestResults() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hasResults, setHasResults] = useState(false);
  
  useEffect(() => {
    // Check if there are valid backtest parameters/results with actual data
    const parameters = tradeService.getBacktestParameters();
    const data = tradeService.getData();
    
    console.log("Checking for results:", { parameters, dataKeys: data ? Object.keys(data) : 'null' });
    
    // Only show results if we have actual API data with trades/positions
    const hasApiData = data && (
      (data as any)?.gps_aggregated?.positions_by_date && Object.keys((data as any).gps_aggregated.positions_by_date).length > 0 ||
      (data as any)?.gps_aggregated?.all_positions && Object.keys((data as any).gps_aggregated.all_positions).length > 0 ||
      (data as any)?.trades && (data as any).trades.length > 0
    );
    
    setHasResults(!!hasApiData);
  }, []);

  const handleReset = () => {
    // Reset data by creating new empty instance
    tradeService.setData({ trades: [] });
    tradeService.setBacktestParameters(null);
    setHasResults(false);
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container mx-auto py-6 max-w-7xl">
        {/* Header */}
        <div className="glass-intense rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Backtest Analysis
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure parameters and analyze your trading strategy performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              {hasResults && (
                <Button 
                  variant="soft" 
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        {/* Backtest Parameters - Collapsible Section */}
        <div className="glass-intense rounded-3xl p-8 mb-8 border border-white/10 shadow-xl backdrop-blur-xl">
          <BacktestForm />
        </div>

        {/* Filters Section */}
        {hasResults && (
          <div className="glass rounded-3xl p-6 mb-8 border border-white/10 shadow-lg backdrop-blur-lg">
            <BacktestFilters />
          </div>
        )}

        {/* Results Section */}
        {hasResults && (
          <div className="glass-intense rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto p-1 glass rounded-xl border border-white/20">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-foreground transition-all duration-300 hover:bg-white/10"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="trades" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-foreground transition-all duration-300 hover:bg-white/10"
                >
                  Trades
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <OverviewTabContent />
              </TabsContent>
              
              <TabsContent value="trades" className="space-y-6">
                <TradesTabContent />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
