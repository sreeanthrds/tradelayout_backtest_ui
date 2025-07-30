
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

export default function BacktestResults() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hasResults, setHasResults] = useState(false);
  
  useEffect(() => {
    // Check if there are valid backtest parameters/results with actual data
    const checkForResults = () => {
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
      <div className="container mx-auto py-6 max-w-7xl">
        {/* Header Section */}
        <div className="bg-card rounded-lg border shadow-sm p-8 mb-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Backtest Analysis
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure parameters and analyze your trading strategy performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              {hasResults && (
                <Button 
                  variant="outline" 
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
          
          {/* Strategy Configuration */}
          <div className="bg-muted/50 rounded-lg p-6 border">
            <BacktestForm />
          </div>
        </div>

        {/* Results Section */}
        {hasResults && (
          <div className="bg-card rounded-lg border shadow-sm p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
        )}
      </div>
    </div>
  );
}
