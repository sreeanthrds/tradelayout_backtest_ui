
import { useState, useEffect } from "react";
import { tradeService } from "@/services/TradeDataService";

export interface BacktestData {
  name: string;
  symbol: string;
  period: string;
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: number;
}

export function useBacktestData() {
  const [backtestData, setBacktestData] = useState<BacktestData>({
    name: "Iron Condor Strategy",
    symbol: "SPY",
    period: "Jan 2022 - Dec 2023",
    totalReturn: 18.7,
    winRate: 68.2,
    maxDrawdown: -12.5,
    sharpeRatio: 1.42,
    trades: 47
  });

  useEffect(() => {
    // Get the actual backtest parameters from the service
    const parameters = tradeService.getBacktestParameters();
    
    if (parameters) {
      // Format the date range from the parameters
      const startDate = parameters.startDate?.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }) || 'Jan 2022';
      
      const endDate = parameters.endDate?.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }) || 'Dec 2023';

      setBacktestData(prev => ({
        ...prev,
        name: parameters.strategy,
        period: `${startDate} - ${endDate}`
      }));
    }
  }, []);

  return { backtestData };
}
