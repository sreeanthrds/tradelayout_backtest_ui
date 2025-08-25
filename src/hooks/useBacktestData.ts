import { useState, useEffect } from "react";
import { tradeService } from "@/services/TradeDataService";
import { strategyOptions } from "@/components/backtest/settings/options";
import { backtestApiService } from "@/services/BacktestApiService";

export interface TradesByDate {
  [date: string]: any[];
}

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
  allTrades: any[]; // Array of all individual trades (flattened)
  tradesByDate: TradesByDate; // Trades grouped by execution date
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
      allTrades: [],
      tradesByDate: {},
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
    allTrades: trades,
    tradesByDate: {}, // Will be populated by calling function if needed
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
  console.log("API Data structure analysis:", {
    hasGpsAggregated: !!apiData?.gps_aggregated,
    hasPositionsByDate: !!apiData?.gps_aggregated?.positions_by_date,
    hasAllPositions: !!apiData?.gps_aggregated?.all_positions,
    hasDirectTrades: !!apiData?.trades,
    topLevelKeys: apiData ? Object.keys(apiData) : []
  });
  
  // Handle multiple possible data structures
  const positionsByDate = apiData?.gps_aggregated?.positions_by_date || {};
  const allPositions = apiData?.gps_aggregated?.all_positions || {};
  const directTrades = apiData?.trades || [];
  
  console.log("Data sources found:", {
    positionsByDateCount: Object.keys(positionsByDate).length,
    allPositionsCount: Object.keys(allPositions).length,
    directTradesCount: directTrades.length
  });
  
  // Group trades by date and also maintain a flattened array
  const tradesByDate: TradesByDate = {};
  const allTrades: any[] = [];
  
  // Priority 1: Process positions_by_date structure (newest format)
  if (Object.keys(positionsByDate).length > 0) {
    console.log("Processing positions_by_date structure");
    Object.keys(positionsByDate).forEach(date => {
      const positions = positionsByDate[date];
      const dateTrades: any[] = [];
      
      Object.keys(positions).forEach(positionId => {
        const position = positions[positionId];
        
        // Check if this position has the new trades array structure
        if (position.trades && Array.isArray(position.trades)) {
          console.log(`Found ${position.trades.length} trades in position ${positionId} for date ${date}`);
          
          // Process each trade in the position
          position.trades.forEach((trade: any) => {
            // Calculate total PnL from all transactions
            let totalPnL = 0;
            let transactionsList: any[] = [];
            
            if (trade.transactions && Array.isArray(trade.transactions)) {
              transactionsList = trade.transactions;
              totalPnL = trade.transactions.reduce((sum: number, transaction: any) => {
                return sum + (Number(transaction.pnl) || 0);
              }, 0);
            }
            
            // Create trade entry with calculated PnL
            const processedTrade = {
              ...trade,
              positionId,
              executionDate: date,
              instrument: position.instrument || trade.instrument,
              strategy: position.strategy || trade.strategy,
              pnl: totalPnL, // Use calculated total PnL instead of null
              profitLoss: totalPnL, // For backward compatibility
              status: trade.status,
              entryDate: trade.entry_time?.split('T')[0] || date,
              entryTime: trade.entry_time?.split('T')[1] || '',
              exitDate: trade.exit_time?.split('T')[0] || null,
              exitTime: trade.exit_time?.split('T')[1] || null,
              transactions: transactionsList, // Preserve transactions array
              // Preserve original structure
              originalTrade: trade
            };
            
            dateTrades.push(processedTrade);
            allTrades.push(processedTrade);
          });
        } else {
          // Fallback to old structure for backwards compatibility
          console.log(`Using old structure for position ${positionId} for date ${date}`);
          const tradeWithDate = {
            ...position,
            positionId,
            executionDate: date
          };
          dateTrades.push(tradeWithDate);
          allTrades.push(tradeWithDate);
        }
      });
      
      if (dateTrades.length > 0) {
        tradesByDate[date] = dateTrades;
      }
    });
  }
  
  // Priority 2: Process all_positions structure (legacy format)
  else if (Object.keys(allPositions).length > 0) {
    console.log("Processing all_positions structure");
    Object.values(allPositions).forEach((position: any) => {
      const tradeWithPosition = {
        ...position,
        positionId: position.id || position.position_id || 'unknown',
        executionDate: position.entry_time?.split('T')[0] || position.date || 'unknown'
      };
      allTrades.push(tradeWithPosition);
      
      const date = tradeWithPosition.executionDate;
      if (!tradesByDate[date]) {
        tradesByDate[date] = [];
      }
      tradesByDate[date].push(tradeWithPosition);
    });
  }
  
  // Priority 3: Process direct trades array (simplest format)
  else if (directTrades.length > 0) {
    console.log("Processing direct trades array");
    directTrades.forEach((trade: any) => {
      const tradeWithDate = {
        ...trade,
        executionDate: trade.entry_time?.split('T')[0] || trade.exit_time?.split('T')[0] || trade.date || 'unknown'
      };
      allTrades.push(tradeWithDate);
      
      const date = tradeWithDate.executionDate;
      if (!tradesByDate[date]) {
        tradesByDate[date] = [];
      }
      tradesByDate[date].push(tradeWithDate);
    });
  }
  
  console.log("Final processing results:", {
    totalTrades: allTrades.length,
    tradesByDateKeys: Object.keys(tradesByDate).length,
    sampleTrade: allTrades[0] || null
  });
  
  // If still no data found, check for any other possible structure
  if (allTrades.length === 0) {
    console.log("No trades found in any expected structure, checking for alternative formats");
    
    // Look for any array-like structures in the API response
    const checkForTradeArrays = (obj: any, path: string = ''): any[] => {
      if (!obj || typeof obj !== 'object') return [];
      
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (Array.isArray(value) && value.length > 0) {
          console.log(`Found array at ${currentPath} with ${value.length} items`);
          // Check if this looks like trade data
          const firstItem = value[0];
          if (firstItem && typeof firstItem === 'object' && 
              (firstItem.pnl !== undefined || firstItem.profit_loss !== undefined || 
               firstItem.entry_time || firstItem.exit_time)) {
            console.log(`Potential trade data found at ${currentPath}`);
            return value;
          }
        } else if (typeof value === 'object' && value !== null) {
          const nestedResult = checkForTradeArrays(value, currentPath);
          if (nestedResult.length > 0) return nestedResult;
        }
      }
      return [];
    };
    
    const foundTrades = checkForTradeArrays(apiData);
    if (foundTrades.length > 0) {
      console.log(`Using discovered trade array with ${foundTrades.length} trades`);
      const processedTrades = foundTrades.map((trade: any) => ({
        ...trade,
        executionDate: trade.entry_time?.split('T')[0] || trade.exit_time?.split('T')[0] || trade.date || 'unknown'
      }));
      
      const tradesByDateFromFound: TradesByDate = {};
      processedTrades.forEach((trade: any) => {
        const date = trade.executionDate;
        if (!tradesByDateFromFound[date]) {
          tradesByDateFromFound[date] = [];
        }
        tradesByDateFromFound[date].push(trade);
      });
      
      const metrics = calculateMetricsFromTrades(processedTrades);
      return {
        ...metrics,
        tradesByDate: tradesByDateFromFound,
        allTrades: processedTrades
      };
    }
  }
  
  if (allTrades.length === 0) {
    return {
      totalReturn: 0,
      winRate: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      trades: 0,
      allTrades: [],
      tradesByDate: {},
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

  const closedTrades = allTrades.filter((trade: any) => trade.status === 'closed' && trade.pnl !== null);
  const winningTrades = closedTrades.filter((trade: any) => trade.pnl > 0);
  
  const totalPnL = closedTrades.reduce((sum: number, trade: any) => sum + (Number(trade.pnl) || 0), 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
  
  // Calculate running equity for drawdown
  let runningPnL = 0;
  let peak = 0;
  let maxDrawdownAmount = 0;
  let maxDrawdownPercent = 0;
  
  // Sort trades by date for chronological calculation
  const sortedTrades = [...closedTrades].sort((a: any, b: any) => {
    const dateA = new Date(a.entry_time);
    const dateB = new Date(b.entry_time);
    return dateA.getTime() - dateB.getTime();
  });
  
  sortedTrades.forEach((trade: any) => {
    runningPnL += Number(trade.pnl) || 0;
    if (runningPnL > peak) {
      peak = runningPnL;
    }
    const drawdownAmount = peak - runningPnL;
    const drawdownPercent = peak > 0 ? (drawdownAmount / peak) * 100 : 0;
    maxDrawdownAmount = Math.max(maxDrawdownAmount, drawdownAmount);
    maxDrawdownPercent = Math.max(maxDrawdownPercent, drawdownPercent);
  });

  // Calculate max profit and loss in single trade
  const pnlValues = closedTrades.map((trade: any) => Number(trade.pnl) || 0);
  const maxProfitSingleTrade = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
  const maxLossSingleTrade = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;
  
  // Calculate win/loss streaks
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  
  sortedTrades.forEach((trade: any) => {
    const pnl = Number(trade.pnl) || 0;
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
    trades: allTrades.length,
    allTrades: allTrades, // Include the trades array
    tradesByDate: tradesByDate, // Include the grouped trades
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

export function useBacktestData() {
  const [backtestData, setBacktestData] = useState<BacktestData>({
    name: "",
    symbol: "",
    period: "",
    totalReturn: 0,
    winRate: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    trades: 0,
    allTrades: [],
    tradesByDate: {},
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
      
      console.log("=== FULL API DATA STRUCTURE ===");
      console.log("Current API Data Structure:", JSON.stringify(apiData, null, 2));
      console.log("=== END API DATA ===");
      
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
        // If no parameters, don't set any data - let the component handle empty state
        setBacktestData(prev => ({
          ...prev,
          name: "",
          symbol: "",
          period: "",
          apiData: null,
          totalTrades: 0,
          totalWins: 0,
          totalLoss: 0,
          winRate: 0,
          totalReturn: 0,
          totalReturnPercent: 0,
          maxDrawdownAmount: 0,
          maxDrawdownPercent: 0,
          maxProfitSingleTrade: 0,
          maxLossSingleTrade: 0,
          maxWinStreak: 0,
          maxLossStreak: 0,
          sharpeRatio: 0,
          tradesByDate: {},
          rawTrades: []
        }));
      }
    };

    loadData();
  }, []);

  return { backtestData };
}