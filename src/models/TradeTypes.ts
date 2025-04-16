
// Trade types for backtest results

export interface Trade {
  index: string;
  positionId: string;
  instrumentType: string;
  symbol: string;
  entryDate: string;
  entryTime: string;
  exitDate: string;
  exitTime: string;
  vix: number;
  profitLoss: number;
  status: string;
  tradeDuration: string;
  tradePairs: TradePair[];
}

export interface TradePair {
  index: string;
  entry: Transaction;
  exit: Transaction;
}

export interface Transaction {
  nodeId: string;
  positionId: string;
  type: string;
  strike: number;
  buySell: string;
  quantity: number;
  entryPrice?: number;
  exitPrice?: number;
  orderType: string;
  exitReason?: string;
  timestamp: string;
  profitLoss?: number;
  status: string;
  entryNumber?: number;
  reEntryNumber?: number;
}

export interface BacktestResults {
  trades: Trade[];
}
