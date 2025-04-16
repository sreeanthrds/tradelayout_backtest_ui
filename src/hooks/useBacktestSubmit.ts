
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormValues } from "@/components/backtest/settings/formSchema";
import { tradeService } from "@/services/TradeDataService";

/**
 * Custom hook for handling backtest form submissions
 * Manages loading state, toast notifications, and navigation
 */
export function useBacktestSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitBacktest = async (data: FormValues) => {
    // Set loading state
    setIsLoading(true);
    
    try {
      // Simulate API call or processing delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Log the submitted data (would be sent to an API in a real app)
      console.log("Running backtest with parameters:", data);
      
      // In a real implementation, we would make an API call here to get the backtest results
      // For now, we're using sample data that's already in the trade service
      
      // Here's where you would put your API call and set the results in the trade service:
      // const backtestResults = await yourBacktestApi.runBacktest(data);
      // tradeService.setData(backtestResults);
      
      // Show success notification - using the correct format for sonner toast
      toast.success("Backtest Completed", {
        description: `Successfully ran ${data.strategy} backtest on ${data.symbol}`,
      });

      // Navigate to results page
      navigate("/backtest-results");
    } catch (error) {
      // Handle any errors
      console.error("Backtest error:", error);
      toast.error("Backtest Failed", {
        description: "There was an error running your backtest",
      });
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitBacktest,
  };
}
