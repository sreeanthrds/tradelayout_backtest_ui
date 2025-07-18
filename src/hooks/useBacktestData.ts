import { useState, useEffect } from "react";
import { tradeService } from "@/services/TradeDataService";
import { strategyOptions } from "@/components/backtest/settings/options";
import { backtestApiService } from "@/services/BacktestApiService";

export interface BacktestData {
  name: string;
  symbol: string;
  period: string;
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: number;
  apiData?: any; // Store the raw API data
  // New comprehensive metrics
  totalReturnPercent: number;
  totalWins: number;
  totalTrades: number;
  maxDrawdownAmount: number;
  maxDrawdownPercent: number;
  maxProfitSingleTrade: number;
  maxLossSingleTrade: number;
  maxWinStreak: number;
  maxLossStreak: number;
}

function calculateMetricsFromTrades(trades: any[]) {
  console.log("Calculating metrics from trades data structure:", trades.length);
  
  if (!trades || trades.length === 0) {
    return {
      totalReturn: 0,
      winRate: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      trades: 0,
      totalReturnPercent: 0,
      totalWins: 0,
      totalTrades: 0,
      maxDrawdownAmount: 0,
      maxDrawdownPercent: 0,
      maxProfitSingleTrade: 0,
      maxLossSingleTrade: 0,
      maxWinStreak: 0,
      maxLossStreak: 0
    };
  }

  const closedTrades = trades.filter(trade => trade.status === 'Closed' && trade.profitLoss !== null);
  const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0);
  
  const totalPnL = closedTrades.reduce((sum, trade) => sum + (Number(trade.profitLoss) || 0), 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
  
  // Calculate running equity for drawdown
  let runningPnL = 0;
  let peak = 0;
  let maxDrawdownAmount = 0;
  let maxDrawdownPercent = 0;
  
  // Sort trades by date for chronological calculation
  const sortedTrades = [...closedTrades].sort((a, b) => {
    const dateA = new Date(a.entryDate + 'T' + a.entryTime);
    const dateB = new Date(b.entryDate + 'T' + b.entryTime);
    return dateA.getTime() - dateB.getTime();
  });
  
  sortedTrades.forEach(trade => {
    runningPnL += Number(trade.profitLoss) || 0;
    if (runningPnL > peak) {
      peak = runningPnL;
    }
    const drawdownAmount = peak - runningPnL;
    const drawdownPercent = peak > 0 ? (drawdownAmount / peak) * 100 : 0;
    maxDrawdownAmount = Math.max(maxDrawdownAmount, drawdownAmount);
    maxDrawdownPercent = Math.max(maxDrawdownPercent, drawdownPercent);
  });

  // Calculate max profit and loss in single trade
  const pnlValues = closedTrades.map(trade => Number(trade.profitLoss) || 0);
  const maxProfitSingleTrade = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
  const maxLossSingleTrade = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;
  
  // Calculate win/loss streaks
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  
  sortedTrades.forEach(trade => {
    const pnl = Number(trade.profitLoss) || 0;
    if (pnl > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else if (pnl < 0) {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  });

  // Simple Sharpe ratio calculation
  const returns = pnlValues;
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const variance = returns.length > 1 ? 
    returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / (returns.length - 1) : 0;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

  // Calculate total return percentage (assuming initial capital)
  const initialCapital = 100000; // Assume 1 lakh initial capital
  const totalReturnPercent = initialCapital > 0 ? (Number(totalPnL) / initialCapital) * 100 : 0;

  return {
    totalReturn: Math.round(Number(totalPnL) * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    maxDrawdown: Math.round(maxDrawdownPercent * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 1000) / 1000,
    trades: trades.length,
    totalReturnPercent: Math.round(totalReturnPercent * 100) / 100,
    totalWins: winningTrades.length,
    totalTrades: closedTrades.length,
    maxDrawdownAmount: Math.round(maxDrawdownAmount * 100) / 100,
    maxDrawdownPercent: Math.round(maxDrawdownPercent * 100) / 100,
    maxProfitSingleTrade: Math.round(maxProfitSingleTrade * 100) / 100,
    maxLossSingleTrade: Math.round(maxLossSingleTrade * 100) / 100,
    maxWinStreak,
    maxLossStreak
  };
}

function calculateMetrics(apiData: any) {
  console.log("calculateMetrics called with:", apiData);
  
  // Handle both API positions data and trades data
  const positions = apiData?.gps_aggregated?.all_positions || {};
  const positionsArray = Object.values(positions);
  
  console.log("Looking for gps_aggregated.all_positions:", apiData?.gps_aggregated?.all_positions);
  console.log("positionsArray length:", positionsArray.length);
  
  // If we don't have positions data, check for trades data structure
  if (positionsArray.length === 0 && apiData?.trades) {
    console.log("No positions data found, checking trades structure:", apiData.trades.length);
    return calculateMetricsFromTrades(apiData.trades);
  }
  
  if (positionsArray.length === 0) {
    return {
      totalReturn: 0,
      winRate: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      trades: 0,
      totalReturnPercent: 0,
      totalWins: 0,
      totalTrades: 0,
      maxDrawdownAmount: 0,
      maxDrawdownPercent: 0,
      maxProfitSingleTrade: 0,
      maxLossSingleTrade: 0,
      maxWinStreak: 0,
      maxLossStreak: 0
    };
  }

  const closedPositions = positionsArray.filter((pos: any) => pos.status === 'closed' && pos.pnl !== null);
  const winningPositions = closedPositions.filter((pos: any) => pos.pnl > 0);
  
  const totalPnL = closedPositions.reduce((sum: number, pos: any) => sum + (Number(pos.pnl) || 0), 0);
  const winRate = closedPositions.length > 0 ? (winningPositions.length / closedPositions.length) * 100 : 0;
  
  // Calculate running equity for drawdown
  let runningPnL = 0;
  let peak = 0;
  let maxDrawdownAmount = 0;
  let maxDrawdownPercent = 0;
  
  // Sort positions by date for chronological calculation
  const sortedPositions = [...closedPositions].sort((a: any, b: any) => {
    const dateA = new Date(a.entry_time);
    const dateB = new Date(b.entry_time);
    return dateA.getTime() - dateB.getTime();
  });
  
  sortedPositions.forEach((pos: any) => {
    runningPnL += Number(pos.pnl) || 0;
    if (runningPnL > peak) {
      peak = runningPnL;
    }
    const drawdownAmount = peak - runningPnL;
    const drawdownPercent = peak > 0 ? (drawdownAmount / peak) * 100 : 0;
    maxDrawdownAmount = Math.max(maxDrawdownAmount, drawdownAmount);
    maxDrawdownPercent = Math.max(maxDrawdownPercent, drawdownPercent);
  });

  // Calculate max profit and loss in single trade
  const pnlValues = closedPositions.map((pos: any) => Number(pos.pnl) || 0);
  const maxProfitSingleTrade = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
  const maxLossSingleTrade = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;
  
  // Calculate win/loss streaks
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  
  sortedPositions.forEach((pos: any) => {
    const pnl = Number(pos.pnl) || 0;
    if (pnl > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else if (pnl < 0) {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  });

  // Simple Sharpe ratio calculation
  const returns = pnlValues;
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const variance = returns.length > 1 ? 
    returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / (returns.length - 1) : 0;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

  // Calculate total return percentage (assuming initial capital)
  const initialCapital = 100000; // Assume 1 lakh initial capital
  const totalReturnPercent = initialCapital > 0 ? (Number(totalPnL) / initialCapital) * 100 : 0;

  return {
    totalReturn: Math.round(Number(totalPnL) * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    maxDrawdown: Math.round(maxDrawdownPercent * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 1000) / 1000,
    trades: positionsArray.length,
    totalReturnPercent: Math.round(totalReturnPercent * 100) / 100,
    totalWins: winningPositions.length,
    totalTrades: closedPositions.length,
    maxDrawdownAmount: Math.round(maxDrawdownAmount * 100) / 100,
    maxDrawdownPercent: Math.round(maxDrawdownPercent * 100) / 100,
    maxProfitSingleTrade: Math.round(maxProfitSingleTrade * 100) / 100,
    maxLossSingleTrade: Math.round(maxLossSingleTrade * 100) / 100,
    maxWinStreak,
    maxLossStreak
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
    trades: 0,
    totalReturnPercent: 0,
    totalWins: 0,
    totalTrades: 0,
    maxDrawdownAmount: 0,
    maxDrawdownPercent: 0,
    maxProfitSingleTrade: 0,
    maxLossSingleTrade: 0,
    maxWinStreak: 0,
    maxLossStreak: 0
  });

  useEffect(() => {
    const loadData = async () => {
      // Get the actual backtest parameters and API data from the service
      const parameters = tradeService.getBacktestParameters();
      const apiData = tradeService.getData();
      
      console.log("Current API Data Structure:", JSON.stringify(apiData, null, 2));
      
      const metrics = calculateMetrics(apiData);
      
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

        // Try to get strategy name from API strategies first, then fallback to static options
        let strategyName = "Trading Strategy";
        try {
          const apiStrategies = await backtestApiService.getStrategies();
          const apiStrategy = apiStrategies.find(s => s.id === parameters.strategy);
          if (apiStrategy) {
            strategyName = apiStrategy.name;
          } else {
            // Fallback to static options
            const strategyOption = strategyOptions.find(opt => opt.value === parameters.strategy);
            strategyName = strategyOption?.label || "Trading Strategy";
          }
        } catch (error) {
          // If API fails, use static options
          const strategyOption = strategyOptions.find(opt => opt.value === parameters.strategy);
          strategyName = strategyOption?.label || "Trading Strategy";
        }

        setBacktestData({
          name: strategyName,
          symbol: "RELIANCE", // Use RELIANCE as requested
          period: `${startDate} - ${endDate}`,
          apiData, // Include the raw API data
          ...metrics
        });
      } else {
        // If no parameters, just use the calculated metrics with default data
        setBacktestData(prev => ({
          ...prev,
          name: "Trading Strategy",
          symbol: "RELIANCE",
          period: "1 Dec 2024 - 31 Dec 2024",
          apiData, // Include the raw API data
          ...metrics
        }));
      }
    };

    loadData();
  }, []);

  return { backtestData };
}