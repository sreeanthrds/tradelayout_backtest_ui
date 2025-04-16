
import { BacktestResults } from "@/models/TradeTypes";
import { sampleTradeData } from "@/data/sampleTradeData";

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

  public getTrades() {
    return this._data.trades;
  }

  // Sample data for testing
  public getSampleData(): BacktestResults {
    return this._data;
  }
}

export const tradeService = TradeDataService.getInstance();
