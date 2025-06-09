
import { BacktestResults, Trade } from "@/models/TradeTypes";
import { FormValues } from "@/components/backtest/settings/formSchema";

// This class will handle trade data operations
export class TradeDataService {
  private static _instance: TradeDataService;
  private _data: BacktestResults = { trades: [] };
  private _backtestParameters: FormValues | null = null;
  private _dataLoaded: boolean = false;

  private constructor() {
    // Initialize with empty data - will be populated when getSampleData is called
  }

  public static getInstance(): TradeDataService {
    if (!TradeDataService._instance) {
      TradeDataService._instance = new TradeDataService();
    }
    return TradeDataService._instance;
  }

  public setData(data: BacktestResults): void {
    this._data = data;
    this._dataLoaded = true;
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

  // Sample data for testing - now loads synchronously
  public getSampleData(): BacktestResults {
    if (!this._dataLoaded) {
      // Load sample data synchronously
      try {
        // Since we can't import the sample data directly due to circular dependencies,
        // let's create comprehensive sample data right here
        const sampleData: BacktestResults = {
          trades: [
            {
              index: "T001",
              positionId: "POS_2024_001",
              instrumentType: "Iron Condor",
              symbol: "NIFTY",
              entryDate: "2024-01-15",
              entryTime: "09:30:00",
              exitDate: "2024-01-16",
              exitTime: "15:30:00",
              vix: 18.5,
              profitLoss: 1250.75,
              status: "Closed",
              tradeDuration: "1 day",
              tradePairs: [
                {
                  index: "TP001_1",
                  entry: {
                    nodeId: "N001_E",
                    positionId: "POS_2024_001",
                    type: "CE",
                    strike: 21500,
                    buySell: "Sell",
                    quantity: 50,
                    entryPrice: 125.50,
                    orderType: "Market",
                    timestamp: "2024-01-15T09:30:00Z",
                    status: "Executed",
                    entryNumber: 1,
                    reEntryNumber: 0
                  },
                  exit: {
                    nodeId: "N001_X",
                    positionId: "POS_2024_001",
                    type: "CE",
                    strike: 21500,
                    buySell: "Buy",
                    quantity: 50,
                    exitPrice: 85.25,
                    orderType: "Market",
                    exitReason: "Target",
                    timestamp: "2024-01-16T15:30:00Z",
                    profitLoss: 2012.50,
                    status: "Executed"
                  }
                },
                {
                  index: "TP001_2",
                  entry: {
                    nodeId: "N002_E",
                    positionId: "POS_2024_001",
                    type: "PE",
                    strike: 21000,
                    buySell: "Sell",
                    quantity: 50,
                    entryPrice: 95.75,
                    orderType: "Market",
                    timestamp: "2024-01-15T09:30:00Z",
                    status: "Executed",
                    entryNumber: 1,
                    reEntryNumber: 0
                  },
                  exit: {
                    nodeId: "N002_X",
                    positionId: "POS_2024_001",
                    type: "PE",
                    strike: 21000,
                    buySell: "Buy",
                    quantity: 50,
                    exitPrice: 110.50,
                    orderType: "Market",
                    exitReason: "Target",
                    timestamp: "2024-01-16T15:30:00Z",
                    profitLoss: -761.75,
                    status: "Executed"
                  }
                }
              ]
            },
            {
              index: "T002",
              positionId: "POS_2024_002",
              instrumentType: "Strangle",
              symbol: "BANKNIFTY",
              entryDate: "2024-02-20",
              entryTime: "10:15:00",
              exitDate: "2024-02-21",
              exitTime: "14:45:00",
              vix: 16.8,
              profitLoss: -892.25,
              status: "Closed",
              tradeDuration: "1 day",
              tradePairs: [
                {
                  index: "TP002_1",
                  entry: {
                    nodeId: "N003_E",
                    positionId: "POS_2024_002",
                    type: "CE",
                    strike: 48000,
                    buySell: "Sell",
                    quantity: 25,
                    entryPrice: 180.25,
                    orderType: "Limit",
                    timestamp: "2024-02-20T10:15:00Z",
                    status: "Executed",
                    entryNumber: 1,
                    reEntryNumber: 0
                  },
                  exit: {
                    nodeId: "N003_X",
                    positionId: "POS_2024_002",
                    type: "CE",
                    strike: 48000,
                    buySell: "Buy",
                    quantity: 25,
                    exitPrice: 255.75,
                    orderType: "Market",
                    exitReason: "SL",
                    timestamp: "2024-02-21T14:45:00Z",
                    profitLoss: -1887.50,
                    status: "Executed"
                  }
                },
                {
                  index: "TP002_2",
                  entry: {
                    nodeId: "N004_E",
                    positionId: "POS_2024_002",
                    type: "PE",
                    strike: 45500,
                    buySell: "Sell",
                    quantity: 25,
                    entryPrice: 160.50,
                    orderType: "Limit",
                    timestamp: "2024-02-20T10:15:00Z",
                    status: "Executed",
                    entryNumber: 1,
                    reEntryNumber: 0
                  },
                  exit: {
                    nodeId: "N004_X",
                    positionId: "POS_2024_002",
                    type: "PE",
                    strike: 45500,
                    buySell: "Buy",
                    quantity: 25,
                    exitPrice: 120.75,
                    orderType: "Market",
                    exitReason: "Target",
                    timestamp: "2024-02-21T14:45:00Z",
                    profitLoss: 995.25,
                    status: "Executed"
                  }
                }
              ]
            },
            {
              index: "T003",
              positionId: "POS_2024_003",
              instrumentType: "Iron Butterfly",
              symbol: "NIFTY",
              entryDate: "2024-03-10",
              entryTime: "09:45:00",
              exitDate: null,
              exitTime: null,
              vix: 19.2,
              profitLoss: null,
              status: "Open",
              tradeDuration: "Active",
              tradePairs: [
                {
                  index: "TP003_1",
                  entry: {
                    nodeId: "N005_E",
                    positionId: "POS_2024_003",
                    type: "CE",
                    strike: 22000,
                    buySell: "Sell",
                    quantity: 50,
                    entryPrice: 145.75,
                    orderType: "Market",
                    timestamp: "2024-03-10T09:45:00Z",
                    status: "Executed",
                    entryNumber: 1,
                    reEntryNumber: 0
                  },
                  exit: null
                },
                {
                  index: "TP003_2",
                  entry: {
                    nodeId: "N006_E",
                    positionId: "POS_2024_003",
                    type: "PE",
                    strike: 21500,
                    buySell: "Sell",
                    quantity: 50,
                    entryPrice: 125.25,
                    orderType: "Market",
                    timestamp: "2024-03-10T09:45:00Z",
                    status: "Executed",
                    entryNumber: 1,
                    reEntryNumber: 0
                  },
                  exit: null
                }
              ]
            }
          ]
        };
        
        this.setData(sampleData);
        console.log("Loaded sample trade data with", sampleData.trades.length, "trades");
      } catch (error) {
        console.error("Error loading sample data:", error);
      }
    }
    return this._data;
  }

  // Remove the async loading method as we're now loading synchronously
  public loadSampleData(): void {
    this.getSampleData();
  }
}

export const tradeService = TradeDataService.getInstance();
// Initialize with sample data synchronously
tradeService.loadSampleData();
