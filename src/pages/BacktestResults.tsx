
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacktestFilters } from "@/components/backtest/BacktestFilters";
import { BacktestResultsHeader } from "@/components/backtest/results/BacktestResultsHeader";
import { OverviewTabContent } from "@/components/backtest/results/OverviewTabContent";
import { TradesTabContent } from "@/components/backtest/results/TradesTabContent";
import { BacktestForm } from "@/components/backtest/settings/BacktestForm";
import { useBacktestData } from "@/hooks/useBacktestData";
import { tradeService } from "@/services/TradeDataService";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BacktestResults() {
  const [activeTab, setActiveTab] = useState("settings");
  const { backtestData } = useBacktestData();
  const navigate = useNavigate();
  const [hasResults, setHasResults] = useState(false);
  
  useEffect(() => {
    // Check if there are valid backtest parameters/results
    const parameters = tradeService.getBacktestParameters();
    const data = tradeService.getData();
    
    // If we have either parameters or data, show results
    if (parameters || (data && Object.keys(data).length > 0)) {
      setHasResults(true);
      setActiveTab("overview"); // Switch to overview if we have results
    } else {
      setHasResults(false);
      setActiveTab("settings"); // Stay on settings if no results
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="glass-intense rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="neomorph" 
                size="icon"
                onClick={() => navigate("/")}
                className="mr-6 shadow-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {hasResults ? "Backtest Analysis" : "Backtest Settings"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {hasResults ? "Comprehensive analysis of your trading strategy" : "Configure parameters for your options trading backtest"}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        {hasResults && (
          <>
            <div className="glass-intense rounded-3xl p-8 mb-8 border border-white/10 shadow-xl backdrop-blur-xl">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Backtest Parameters
              </h2>
              <BacktestResultsHeader backtestData={backtestData} />
            </div>

            <div className="glass rounded-3xl p-6 mb-8 border border-white/10 shadow-lg backdrop-blur-lg">
              <BacktestFilters />
            </div>
          </>
        )}

        <div className="glass-intense rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="neomorph-button grid w-full grid-cols-3 lg:w-auto p-2 bg-gradient-to-r from-background/80 to-muted/40 border border-white/20 shadow-xl">
              <TabsTrigger value="settings" className="data-[state=active]:neomorph-inset data-[state=active]:shadow-inner transition-all duration-300">
                Settings
              </TabsTrigger>
              {hasResults && (
                <>
                  <TabsTrigger value="overview" className="data-[state=active]:neomorph-inset data-[state=active]:shadow-inner transition-all duration-300">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="trades" className="data-[state=active]:neomorph-inset data-[state=active]:shadow-inner transition-all duration-300">
                    Trades
                  </TabsTrigger>
                </>
              )}
            </TabsList>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="glass rounded-2xl p-6 border border-white/10 shadow-lg backdrop-blur-lg">
                <BacktestForm />
              </div>
            </TabsContent>
            
            {hasResults && (
              <>
                <TabsContent value="overview" className="space-y-6">
                  <OverviewTabContent />
                </TabsContent>
                
                <TabsContent value="trades" className="space-y-6">
                  <TradesTabContent />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
