
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormValues } from "@/components/backtest/settings/formSchema";

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
