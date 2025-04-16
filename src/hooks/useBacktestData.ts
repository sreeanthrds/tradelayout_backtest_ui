
import { useState } from "react";

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
  // This would typically fetch data from an API
  // For now, we're using mock data
  const [backtestData] = useState<BacktestData>({
    name: "Iron Condor Strategy",
    symbol: "SPY",
    period: "Jan 2022 - Dec 2023",
    totalReturn: 18.7,
    winRate: 68.2,
    maxDrawdown: -12.5,
    sharpeRatio: 1.42,
    trades: 47
  });

  return { backtestData };
}
