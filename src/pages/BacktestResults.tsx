
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OverviewTabContent } from "@/components/backtest/results/OverviewTabContent";
import { TradesTabContent } from "@/components/backtest/results/TradesTabContent";
import { BacktestForm } from "@/components/backtest/settings/BacktestForm";
import { useBacktestData } from "@/hooks/useBacktestData";
import { tradeService } from "@/services/TradeDataService";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useApplyApiUrlFromParams } from "@/hooks/useUrlParams";

export default function BacktestResults() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hasResults, setHasResults] = useState(false);
  useApplyApiUrlFromParams();

  useEffect(() => {
    // Check if there are valid backtest parameters/results with actual data
    const checkForResults = () => {
      const parameters = tradeService.getBacktestParameters();
      const data = tradeService.getData();
      
      console.log("Checking for results:", { parameters, dataKeys: data ? Object.keys(data) : 'null' });
      
      // Check for any possible data structure that contains trades
      const hasApiData = data && (
        // Check nested positions_by_date structure
        (data as any)?.gps_aggregated?.positions_by_date && Object.keys((data as any).gps_aggregated.positions_by_date).length > 0 ||
        // Check legacy all_positions structure  
        (data as any)?.gps_aggregated?.all_positions && Object.keys((data as any).gps_aggregated.all_positions).length > 0 ||
        // Check direct trades array
        (data as any)?.trades && Array.isArray((data as any).trades) && (data as any).trades.length > 0 ||
        // Check for any array with trade-like objects
        Object.values(data).some(value => 
          Array.isArray(value) && value.length > 0 && 
          value.some(item => item && typeof item === 'object' && 
            (item.pnl !== undefined || item.profit_loss !== undefined || item.entry_time || item.exit_time))
        )
      );
      
      setHasResults(!!hasApiData);
    };

    // Check immediately
    checkForResults();
    
    // Also check periodically to catch new data
    const interval = setInterval(checkForResults, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    // Reset data by creating new empty instance
    tradeService.setData({ trades: [] });
    tradeService.setBacktestParameters(null);
    setHasResults(false);
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-3 px-4 max-w-7xl sm:py-6">
        {/* Header Section */}
        <div className="bg-card rounded-lg border shadow-sm p-4 mb-4 sm:p-6 md:p-8 sm:mb-6">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center sm:mb-8">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Backtest Analysis
              </h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                Configure parameters and analyze your trading strategy performance
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {hasResults && (
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="gap-1 text-xs sm:text-sm sm:gap-2"
                  size="sm"
                >
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
          
          {/* Strategy Configuration */}
          <div className="bg-muted/50 rounded-lg p-3 border sm:p-4 md:p-6">
            <BacktestForm />
          </div>
        </div>

        {/* Results Section */}
        {hasResults && (
          <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6 md:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
              <TabsList className="grid w-full grid-cols-2 h-8 sm:h-10 lg:w-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="trades" className="text-xs sm:text-sm">Trades</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                <OverviewTabContent />
              </TabsContent>
              
              <TabsContent value="trades" className="space-y-4 sm:space-y-6">
                <TradesTabContent />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
