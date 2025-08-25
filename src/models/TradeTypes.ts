
// Trade types for backtest results

export interface Trade {
  index: string;
  positionId: string;
  instrumentType: string;
  symbol: string;
  entryDate: string;
  entryTime: string;
  exitDate: string | null;
  exitTime: string | null;
  vix: number;
  profitLoss: number | null;
  status: string;
  tradeDuration: string;
  tradePairs: TradePair[];
  
  // Extended fields from backend data
  pnl?: number;
  entry_time?: string;
  exit_time?: string;
  close_reason?: string;
  quantity?: number;
  entry_price?: number;
  exit_price?: number;
  instrument?: string;
  strategy?: string;
  node_id?: string;
  trade_side?: string;
  
  // Raw backend trade data structure
  trades?: BackendTrade[];
  // New transactions array for multiple transactions per trade
  transactions?: TransactionDetail[];
}

export interface BackendTrade {
  entry: {
    node_id: string;
    instrument: string;
    quantity: number;
    price: number;
    side: string;
    strategy: string;
    order_id: string;
    order_type: string;
    product_type: string;
    entry_time: string;
    fill_time: string;
    fill_price: number;
    position_config: {
      id: string;
      vpi: string;
      vpt: string;
      priority: number;
      quantity: number;
      orderType: string;
      multiplier: number;
      productType: string;
      _lastUpdated: number;
      positionType: string;
    };
  };
  exit: {
    node_id: string;
    price: number;
    reason: string;
    order_id: string;
    order_type: string;
    exit_time: string;
    fill_time: string;
    fill_price: number;
  };
  status: string;
  entry_time: string;
  exit_time: string;
  close_reason: string;
  pnl: number;
  quantity: number;
  entry_price: number;
  exit_price: number;
  instrument: string;
  strategy: string;
  node_id: string;
  trade_side: string;
  // New transactions array for multiple transactions per trade
  transactions?: TransactionDetail[];
}

// New interface for individual transaction details in the transactions array
export interface TransactionDetail {
  reEntryNum: number;
  entry: {
    node_id: string;
    instrument: string;
    quantity: number;
    price: number;
    side: string;
    strategy: string;
    order_id: string;
    order_type: string;
    product_type: string;
    entry_time: string;
    fill_time: string;
    fill_price: number;
    reEntryNum: number;
    position_config: {
      id: string;
      vpi: string;
      vpt: string;
      priority: number;
      quantity: number;
      orderType: string;
      multiplier: number;
      productType: string;
      _lastUpdated: number;
      positionType: string;
      sourceNodeId?: string;
    };
  };
  exit: {
    node_id: string;
    price: number;
    reason: string;
    order_id?: string;
    order_type?: string;
    exit_time?: string;
    fill_time?: string;
    fill_price?: number;
    reEntryNum: number;
  };
  status: string;
  entry_time: string;
  exit_time: string;
  pnl: number;
}

export interface TradePair {
  index: string;
  entry: Transaction;
  exit: Transaction | null;
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
