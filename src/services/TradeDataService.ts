
import { BacktestResults, Trade } from "@/models/TradeTypes";

// Sample trade data that would be fetched from the API
const sampleTradeData: BacktestResults = {
  trades: [
    {
      "index": "1",
      "positionId": "POS-20240416-1",
      "instrumentType": "Options",
      "symbol": "NIFTY",
      "entryDate": "2024-04-16",
      "entryTime": "09:36:00",
      "exitDate": "2024-04-16",
      "exitTime": "14:56:00",
      "vix": 12.55,
      "profitLoss": -26025.00,
      "status": "Closed",
      "tradeDuration": "05:20:00",
      "tradePairs": [
        {
          "index": "1.1",
          "entry": {
            "nodeId": "ENTRY-001",
            "positionId": "POS-20240416-1-1",
            "type": "CE",
            "strike": 22200,
            "buySell": "Buy",
            "quantity": 750,
            "entryPrice": 87.10,
            "orderType": "Market",
            "timestamp": "2024-04-16T10:08:00Z",
            "status": "Executed",
            "entryNumber": 1,
            "reEntryNumber": 0
          },
          "exit": {
            "nodeId": "EXIT-001",
            "positionId": "POS-20240416-1-1",
            "type": "CE",
            "strike": 22200,
            "buySell": "Sell",
            "quantity": 750,
            "exitPrice": 82.75,
            "orderType": "Market",
            "exitReason": "Signal",
            "timestamp": "2024-04-16T10:13:00Z",
            "profitLoss": -3262.50,
            "status": "Executed"
          }
        },
        {
          "index": "1.2",
          "entry": {
            "nodeId": "ENTRY-002",
            "positionId": "POS-20240416-1-2",
            "type": "PE",
            "strike": 22200,
            "buySell": "Buy",
            "quantity": 750,
            "entryPrice": 104.45,
            "orderType": "Market",
            "timestamp": "2024-04-16T09:46:00Z",
            "status": "Executed",
            "entryNumber": 2,
            "reEntryNumber": 0
          },
          "exit": {
            "nodeId": "EXIT-002",
            "positionId": "POS-20240416-1-2",
            "type": "PE",
            "strike": 22200,
            "buySell": "Sell",
            "quantity": 750,
            "exitPrice": 99.25,
            "orderType": "Market",
            "exitReason": "Signal",
            "timestamp": "2024-04-16T09:49:00Z",
            "profitLoss": -3900.00,
            "status": "Executed"
          }
        }
      ]
    },
    {
      "index": "2",
      "positionId": "POS-20240418-2",
      "instrumentType": "Options",
      "symbol": "NIFTY",
      "entryDate": "2024-04-18",
      "entryTime": "09:36:00",
      "exitDate": "2024-04-18",
      "exitTime": "13:30:00",
      "vix": 12.22,
      "profitLoss": -31687.50,
      "status": "Closed",
      "tradeDuration": "03:54:00",
      "tradePairs": [
        {
          "index": "2.1",
          "entry": {
            "nodeId": "ENTRY-008",
            "positionId": "POS-20240418-2-1",
            "type": "CE",
            "strike": 22250,
            "buySell": "Buy",
            "quantity": 750,
            "entryPrice": 42.70,
            "orderType": "Market",
            "timestamp": "2024-04-18T11:07:00Z",
            "status": "Executed",
            "entryNumber": 1,
            "reEntryNumber": 0
          },
          "exit": {
            "nodeId": "EXIT-008",
            "positionId": "POS-20240418-2-1",
            "type": "CE",
            "strike": 22250,
            "buySell": "Sell",
            "quantity": 750,
            "exitPrice": 40.55,
            "orderType": "Market",
            "exitReason": "Signal",
            "timestamp": "2024-04-18T11:08:00Z",
            "profitLoss": -1612.50,
            "status": "Executed"
          }
        },
        {
          "index": "2.2",
          "entry": {
            "nodeId": "ENTRY-009",
            "positionId": "POS-20240418-2-2",
            "type": "PE",
            "strike": 22250,
            "buySell": "Buy",
            "quantity": 750,
            "entryPrice": 100.10,
            "orderType": "Market",
            "timestamp": "2024-04-18T09:47:00Z",
            "status": "Executed",
            "entryNumber": 2,
            "reEntryNumber": 0
          },
          "exit": {
            "nodeId": "EXIT-009",
            "positionId": "POS-20240418-2-2",
            "type": "PE",
            "strike": 22250,
            "buySell": "Sell",
            "quantity": 750,
            "exitPrice": 95.10,
            "orderType": "Market",
            "exitReason": "Signal",
            "timestamp": "2024-04-18T09:51:00Z",
            "profitLoss": -3750.00,
            "status": "Executed"
          }
        }
      ]
    }
  ]
};

// This class will handle trade data operations
export class TradeDataService {
  private static _instance: TradeDataService;
  private _data: BacktestResults;

  private constructor() {
    // Initialize with sample data
    this._data = sampleTradeData;
  }

  public static getInstance(): TradeDataService {
    if (!TradeDataService._instance) {
      TradeDataService._instance = new TradeDataService();
    }
    return TradeDataService._instance;
  }

  public setData(data: BacktestResults): void {
    this._data = data;
  }

  public getData(): BacktestResults {
    return this._data;
  }

  public getTrades(): Trade[] {
    return this._data.trades || [];
  }

  // Sample data for testing
  public getSampleData(): BacktestResults {
    return this._data;
  }
}

export const tradeService = TradeDataService.getInstance();
