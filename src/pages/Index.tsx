import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChartBar, LineChart, CandlestickChart, Percent, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center max-w-3xl px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Options Backtesting Analytics</h1>
        <p className="text-xl text-gray-600 mb-8">Visualize and analyze your options trading strategies with comprehensive backtest results and performance metrics.</p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link to="/backtest-results">
            <Button size="lg" className="gap-2">
              View Backtest Results <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
              <LineChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Performance Analysis</h3>
            <p className="text-gray-600">Track key metrics like total return, Sharpe ratio, and max drawdown.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-green-100 p-3 rounded-full w-fit mb-4">
              <CandlestickChart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trade History</h3>
            <p className="text-gray-600">Detailed breakdown of all trades with entry/exit points and P&L.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
              <ChartBar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Strategy Comparison</h3>
            <p className="text-gray-600">Compare multiple strategies side by side to find the best approach.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
