
import { BacktestResults, Trade } from "@/models/TradeTypes";
import { FormValues } from "@/components/backtest/settings/formSchema";

// This class will handle trade data operations
export class TradeDataService {
  private static _instance: TradeDataService;
  private _data: BacktestResults = { trades: [] };
  private _backtestParameters: FormValues | null = null;

  private constructor() {
    // Initialize with empty data - will be populated later
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

  public setBacktestParameters(parameters: FormValues): void {
    this._backtestParameters = parameters;
  }

  public getBacktestParameters(): FormValues | null {
    return this._backtestParameters;
  }

  // Sample data for testing
  public getSampleData(): BacktestResults {
    return this._data;
  }

  // Method to load sample data
  public loadSampleData(): void {
    // This will be called after the service is initialized
    // to avoid circular dependencies
    import("@/data/sampleTradeData").then(module => {
      this.setData(module.sampleTradeData);
    });
  }
}

export const tradeService = TradeDataService.getInstance();
// Initialize with sample data
tradeService.loadSampleData();
