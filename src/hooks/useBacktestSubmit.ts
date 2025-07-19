
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormValues } from "@/components/backtest/settings/formSchema";
import { backtestApiService } from "@/services/BacktestApiService";
import { tradeService } from "@/services/TradeDataService";
import { useUrlParams } from "@/hooks/useUrlParams";

/**
 * Custom hook for handling backtest form submissions
 * Manages loading state, toast notifications, and navigation
 */
export function useBacktestSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useUrlParams();

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

      // Call the API to run backtest with userId from URL params
      const result = await backtestApiService.runBacktest({
        strategy_id: data.strategy,
        start_date: formatDate(data.startDate),
        end_date: formatDate(data.endDate),
      }, userId);
      
      // Store the raw API result directly for the new data structure
      console.log("Raw API result:", result);
      
      // Store the complete API response - the useBacktestData hook will process it
      tradeService.setApiData(result);
      
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
