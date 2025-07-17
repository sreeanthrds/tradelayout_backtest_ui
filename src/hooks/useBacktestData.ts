
import { useState, useEffect } from "react";
import { tradeService } from "@/services/TradeDataService";
import { strategyOptions } from "@/components/backtest/settings/options";

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

function calculateMetrics(trades: any[]) {
  if (!trades || trades.length === 0) {
    return {
      totalReturn: 0,
      winRate: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      trades: 0
    };
  }

  const closedTrades = trades.filter(trade => trade.profitLoss !== null);
  const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0);
  
  const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
  
  // Calculate running equity for drawdown
  let runningPnL = 0;
  let peak = 0;
  let maxDrawdown = 0;
  
  closedTrades.forEach(trade => {
    runningPnL += trade.profitLoss || 0;
    if (runningPnL > peak) {
      peak = runningPnL;
    }
    const drawdown = ((peak - runningPnL) / Math.max(peak, 1)) * 100;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });

  // Simple Sharpe ratio calculation (assuming returns, no risk-free rate)
  const returns = closedTrades.map(t => t.profitLoss || 0);
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const variance = returns.length > 1 ? 
    returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / (returns.length - 1) : 0;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

  return {
    totalReturn: totalPnL,
    winRate: Math.round(winRate * 100) / 100,
    maxDrawdown: Math.round(-maxDrawdown * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    trades: trades.length
  };
}

export function useBacktestData() {
  const [backtestData, setBacktestData] = useState<BacktestData>({
    name: "Iron Condor Strategy",
    symbol: "NIFTY",
    period: "Jan 2024 - Dec 2024",
    totalReturn: 0,
    winRate: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    trades: 0
  });

  useEffect(() => {
    // Get the actual backtest parameters and data from the service
    const parameters = tradeService.getBacktestParameters();
    const tradesData = tradeService.getData();
    
    const metrics = calculateMetrics(tradesData.trades || []);
    
    if (parameters) {
      // Format the date range from the parameters with full dates
      const startDate = parameters.startDate?.toLocaleDateString('en-GB', { 
        day: 'numeric',
        month: 'short', 
        year: 'numeric' 
      }) || '1 Dec 2024';
      
      const endDate = parameters.endDate?.toLocaleDateString('en-GB', { 
        day: 'numeric',
        month: 'short', 
        year: 'numeric' 
      }) || '31 Dec 2024';

      // Find strategy name from options, fallback to a default meaningful name
      const strategyOption = strategyOptions.find(opt => opt.value === parameters.strategy);
      const strategyName = strategyOption?.label || "Iron Condor Strategy";

      setBacktestData({
        name: strategyName,
        symbol: "RELIANCE", // Use RELIANCE as requested
        period: `${startDate} - ${endDate}`,
        ...metrics
      });
    } else {
      // If no parameters, just use the calculated metrics with default data
      setBacktestData(prev => ({
        ...prev,
        name: "Iron Condor Strategy",
        symbol: "RELIANCE",
        period: "1 Dec 2024 - 31 Dec 2024",
        ...metrics
      }));
    }
  }, []);

  return { backtestData };
}
