
export interface RiskData {
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  maxDrawdownDuration: number;
  volatility: number;
  beta: number;
  alpha: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  recoveryFactor: number;
  payoffRatio: number;
  expectedValue: number;
}

export interface RadarDataItem {
  subject: string;
  A: number;
  fullMark: number;
}

// Mock risk data - in a real application, this would come from your backtest results
export const mockRiskData: RiskData = {
  sharpeRatio: 1.42,
  sortinoRatio: 1.98,
  calmarRatio: 1.12,
  maxDrawdown: -12.5,
  maxDrawdownDuration: 45,
  volatility: 15.7,
  beta: 0.82,
  alpha: 3.2,
  winRate: 68.2,
  avgWin: 4.8,
  avgLoss: -3.2,
  largestWin: 12.5,
  largestLoss: -8.3,
  profitFactor: 2.1,
  recoveryFactor: 1.5,
  payoffRatio: 1.5,
  expectedValue: 1.89,
};

export const mockRadarData: RadarDataItem[] = [
  { subject: 'Return', A: 87, fullMark: 100 },
  { subject: 'Risk', A: 65, fullMark: 100 },
  { subject: 'Consistency', A: 78, fullMark: 100 },
  { subject: 'Drawdown', A: 73, fullMark: 100 },
  { subject: 'Win Rate', A: 85, fullMark: 100 },
  { subject: 'Profitability', A: 82, fullMark: 100 },
];
