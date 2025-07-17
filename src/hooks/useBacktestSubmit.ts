
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
      const positions = result.gps_aggregated?.all_positions || {};
      const trades = Object.entries(positions).map(([key, position]: [string, any], index) => ({
        id: `trade-${index}`,
        symbol: position.instrument || 'N/A',
        entryDate: position.entry_time?.split('T')[0] || position.date,
        exitDate: position.exit_time?.split('T')[0] || position.date,
        quantity: position.quantity || 1,
        entryPrice: position.entry_price || 0,
        exitPrice: position.exit_price || 0,
        profitLoss: position.pnl || 0,
        returnPercentage: position.pnl ? (position.pnl / position.entry_price) * 100 : 0,
        strategy: position.strategy || 'Unknown',
        status: position.pnl > 0 ? 'closed-win' : 'closed-loss',
      }));

      const totalPnL = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
      const winningTrades = trades.filter(trade => trade.profitLoss > 0);
      
      const transformedData = {
        trades,
        summary: {
          totalReturn: totalPnL,
          maxDrawdown: 0, // Would need calculation from equity curve
          sharpeRatio: 0, // Would need calculation
          winRate: (winningTrades.length / trades.length) * 100,
          totalTrades: trades.length,
        },
        equityCurve: [], // Would need to be calculated from trades
        monthlyReturns: [], // Would need to be calculated from trades
      };
      
      // Update trade service with API results
      tradeService.setApiData(transformedData);
      
      toast.success("Backtest Completed", {
        description: `Successfully ran backtest`,
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
