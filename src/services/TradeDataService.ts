import { BacktestResults, Trade } from "@/models/TradeTypes";

import { FormValues } from "@/components/backtest/settings/formSchema";

class TradeDataService {
  private static instance: TradeDataService;
  private data: BacktestResults | null = null;
  private _backtestParameters: FormValues | null = null;

  private constructor() {
    // Initialize with empty data - no sample data
  }

  public static getInstance(): TradeDataService {
    if (!TradeDataService.instance) {
      TradeDataService.instance = new TradeDataService();
    }
    return TradeDataService.instance;
  }

  public getData(): BacktestResults | null {
    return this.data;
  }

  public setApiData(data: any): void {
    this.data = data;
  }

  public setData(data: BacktestResults): void {
    this.data = data;
  }

  public getTrades(): Trade[] {
    return this.data?.trades || [];
  }

  public clearData(): void {
    this.data = null;
    this._backtestParameters = null;
  }

  public setBacktestParameters(parameters: FormValues | null): void {
    this._backtestParameters = parameters;
  }

  public getBacktestParameters(): FormValues | null {
    return this._backtestParameters;
  }

  // Remove sample data generation - only work with real API data
  public getSampleData(): BacktestResults {
    return { trades: [] };
  }

  public loadSampleData(): void {
    // No-op - don't load any sample data
  }
}

export const tradeService = TradeDataService.getInstance();