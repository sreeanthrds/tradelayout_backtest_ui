
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
    // Check if there are valid backtest parameters/results
    const parameters = tradeService.getBacktestParameters();
    const data = tradeService.getData();
    
    // If we have either parameters or data, show results
    if (parameters || (data && Object.keys(data).length > 0)) {
      setHasResults(true);
    } else {
      setHasResults(false);
    }
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
            <ThemeToggle />
          </div>
        </div>
        
        {/* Backtest Parameters Section */}
        <div className="glass-intense rounded-3xl p-8 mb-8 border border-white/10 shadow-xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Backtest Parameters
            </h2>
            {hasResults && (
              <Button 
                variant="neomorph" 
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
          <div className="glass rounded-2xl p-6 border border-white/10 shadow-lg backdrop-blur-lg">
            <BacktestForm />
          </div>
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
              <TabsList className="neomorph-button grid w-full grid-cols-2 lg:w-auto p-2 bg-gradient-to-r from-background/80 to-muted/40 border border-white/20 shadow-xl">
                <TabsTrigger value="overview" className="data-[state=active]:neomorph-inset data-[state=active]:shadow-inner transition-all duration-300">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="trades" className="data-[state=active]:neomorph-inset data-[state=active]:shadow-inner transition-all duration-300">
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
