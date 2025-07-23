
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChartBar, LineChart, CandlestickChart, ArrowRight, Play, RotateCcw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { tradeService } from "@/services/TradeDataService";

const Index = () => {
  const hasBacktestHistory = tradeService.getBacktestParameters() !== null;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center max-w-3xl px-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img 
            src="/lovable-uploads/f3ce26b4-45b8-4260-9e93-cd5ef27b2713.png" 
            alt="TradeLayout Logo" 
            className="w-12 h-12"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">TradeLayout</h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">Options Backtesting Analytics</h2>
        <p className="text-xl text-muted-foreground mb-8">Visualize and analyze your options trading strategies with comprehensive backtest results and performance metrics.</p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link to="/backtest-settings">
            <Button size="lg" className="gap-2">
              Run New Backtest <Play className="h-4 w-4" />
            </Button>
          </Link>
          {hasBacktestHistory && (
            <Link to="/backtest-settings">
              <Button size="lg" variant="secondary" className="gap-2">
                Rerun Last Backtest <RotateCcw className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <Link to="/backtest-results">
            <Button size="lg" variant="outline" className="gap-2">
              View Backtest Results <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-fit mb-4">
              <LineChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Performance Analysis</h3>
            <p className="text-muted-foreground">Track key metrics like total return, Sharpe ratio, and max drawdown.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-fit mb-4">
              <CandlestickChart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Trade History</h3>
            <p className="text-muted-foreground">Detailed breakdown of all trades with entry/exit points and P&L.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-fit mb-4">
              <ChartBar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Strategy Comparison</h3>
            <p className="text-muted-foreground">Compare multiple strategies side by side to find the best approach.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
