
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormValues } from "@/components/backtest/settings/formSchema";
import { backtestApiService } from "@/services/BacktestApiService";
import { tradeService } from "@/services/TradeDataService";

/**
 * Custom hook for handling backtest form submissions
 * Manages loading state, toast notifications, and navigation
 */
export function useBacktestSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitBacktest = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      console.log("Running backtest with parameters:", data);
      
      // Store the backtest parameters
      tradeService.setBacktestParameters(data);
      
      // Format dates to DD-MM-YYYY format as required by API
      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      // Call the API to run backtest
      const result = await backtestApiService.runBacktest({
        strategy_id: data.strategy,
        start_date: formatDate(data.startDate),
        end_date: formatDate(data.endDate),
      });
      
      // Transform API result to match existing trade service format
      const transformedData = {
        trades: result.trades.map((trade, index) => ({
          id: `trade-${index}`,
          symbol: trade.symbol,
          entryDate: trade.entry_date,
          exitDate: trade.exit_date,
          quantity: 1, // Default value
          entryPrice: 100, // Would need to be in API
          exitPrice: 100 + (trade.profit_loss / 1), // Calculated
          profitLoss: trade.profit_loss,
          returnPercentage: trade.return_percentage,
          strategy: result.strategy_name,
          status: trade.profit_loss > 0 ? 'closed-win' : 'closed-loss',
        })),
        summary: {
          totalReturn: result.total_return,
          maxDrawdown: result.max_drawdown,
          sharpeRatio: result.sharpe_ratio,
          winRate: result.win_rate,
          totalTrades: result.trades.length,
        },
        equityCurve: result.equity_curve,
        monthlyReturns: result.monthly_returns,
      };
      
      // Update trade service with API results
      tradeService.setApiData(transformedData);
      
      toast.success("Backtest Completed", {
        description: `Successfully ran ${result.strategy_name} backtest`,
      });

      navigate("/backtest-results");
    } catch (error) {
      console.error("Backtest error:", error);
      toast.error("Backtest Failed", {
        description: "There was an error running your backtest",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitBacktest,
  };
}
