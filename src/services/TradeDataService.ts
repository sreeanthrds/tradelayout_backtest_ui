
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

  // Generate comprehensive sample data with daily trades - NIFTY only
  public getSampleData(): BacktestResults {
    if (!this._dataLoaded) {
      try {
        const trades: Trade[] = [];
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');
        
        let tradeIndex = 1;
        let positionIndex = 1;
        
        // Generate trades for every trading day (Mon-Fri)
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          // Skip weekends
          if (date.getDay() === 0 || date.getDay() === 6) continue;
          
          // Generate 3-5 trades per day
          const tradesPerDay = Math.floor(Math.random() * 3) + 3;
          
          for (let dayTrade = 0; dayTrade < tradesPerDay; dayTrade++) {
            const entryHour = 9 + Math.floor(Math.random() * 6); // 9 AM to 3 PM
            const entryMinute = Math.floor(Math.random() * 60);
            const entryTime = `${entryHour.toString().padStart(2, '0')}:${entryMinute.toString().padStart(2, '0')}:00`;
            
            // Exit 1-8 hours later
            const exitHours = Math.floor(Math.random() * 8) + 1;
            const exitDate = new Date(date);
            exitDate.setHours(exitDate.getHours() + exitHours);
            
            // Sometimes trades extend to next day
            if (exitDate.getHours() > 15) {
              exitDate.setDate(exitDate.getDate() + 1);
              exitDate.setHours(9 + Math.floor(Math.random() * 6));
            }
            
            const exitTime = `${exitDate.getHours().toString().padStart(2, '0')}:${exitDate.getMinutes().toString().padStart(2, '0')}:00`;
            
            const instruments = ['Iron Condor', 'Iron Butterfly', 'Strangle', 'Straddle', 'Bull Call Spread', 'Bear Put Spread', 'Collar', 'Butterfly'];
            const exitReasons = ['Target', 'SL', 'Time Decay', 'Manual', 'Adjustment', 'Market Close'];
            
            const instrumentType = instruments[Math.floor(Math.random() * instruments.length)];
            const symbol = 'NIFTY'; // Only NIFTY
            const baseStrike = 21000; // NIFTY base strike
            
            // Generate 10-15 transaction pairs per trade
            const pairCount = Math.floor(Math.random() * 6) + 10;
            const tradePairs = [];
            let totalPnL = 0;
            
            for (let pairIndex = 0; pairIndex < pairCount; pairIndex++) {
              const strikeOffset = (Math.floor(Math.random() * 20) - 10) * 50; // -500 to +500 strike variation
              const strike = baseStrike + strikeOffset;
              const optionType = Math.random() > 0.5 ? 'CE' : 'PE';
              const buySell = Math.random() > 0.3 ? 'Sell' : 'Buy'; // 70% sell, 30% buy
              const quantity = [25, 50, 75, 100][Math.floor(Math.random() * 4)];
              
              const entryPrice = Math.random() * 200 + 50; // 50-250
              const priceMovement = (Math.random() - 0.5) * 100; // -50 to +50
              const exitPrice = Math.max(5, entryPrice + priceMovement);
              
              const pairPnL = buySell === 'Sell' ? 
                (entryPrice - exitPrice) * quantity : 
                (exitPrice - entryPrice) * quantity;
              
              totalPnL += pairPnL;
              
              const entryTimestamp = new Date(date);
              entryTimestamp.setHours(entryHour, entryMinute + pairIndex * 2, 0, 0);
              
              const exitTimestamp = new Date(exitDate);
              exitTimestamp.setMinutes(exitTimestamp.getMinutes() + pairIndex * 2);
              
              const nodeId = `NODE_${symbol}_${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}_${date.getDate().toString().padStart(2, '0')}_${pairIndex + 1}`;
              const positionId = `POS_${positionIndex}_${tradeIndex}`;
              
              tradePairs.push({
                index: `TP${tradeIndex}_${pairIndex + 1}`,
                entry: {
                  nodeId: `${nodeId}_E`,
                  positionId,
                  type: optionType,
                  strike,
                  buySell,
                  quantity,
                  entryPrice,
                  orderType: Math.random() > 0.7 ? 'Limit' : 'Market',
                  timestamp: entryTimestamp.toISOString(),
                  status: 'Executed',
                  entryNumber: pairIndex + 1,
                  reEntryNumber: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0
                },
                exit: Math.random() > 0.05 ? { // 95% trades are closed
                  nodeId: `${nodeId}_X`,
                  positionId,
                  type: optionType,
                  strike,
                  buySell: buySell === 'Buy' ? 'Sell' : 'Buy',
                  quantity,
                  exitPrice,
                  orderType: Math.random() > 0.8 ? 'Limit' : 'Market',
                  exitReason: exitReasons[Math.floor(Math.random() * exitReasons.length)],
                  timestamp: exitTimestamp.toISOString(),
                  profitLoss: pairPnL,
                  status: 'Executed'
                } : null // 5% open positions
              });
            }
            
            const isOpen = tradePairs.some(pair => pair.exit === null);
            const tradeDurationHours = Math.floor((exitDate.getTime() - date.getTime()) / (1000 * 60 * 60));
            const tradeDuration = isOpen ? 'Active' : tradeDurationHours < 24 ? `${tradeDurationHours}h ${Math.floor(Math.random() * 60)}m` : `${Math.floor(tradeDurationHours / 24)}d ${tradeDurationHours % 24}h`;
            
            trades.push({
              index: `T${tradeIndex.toString().padStart(4, '0')}`,
              positionId: `POS_${positionIndex}_${tradeIndex}`,
              instrumentType,
              symbol,
              entryDate: date.toISOString().split('T')[0],
              entryTime,
              exitDate: isOpen ? null : exitDate.toISOString().split('T')[0],
              exitTime: isOpen ? null : exitTime,
              vix: Math.random() * 15 + 12, // VIX between 12-27
              profitLoss: isOpen ? null : totalPnL,
              status: isOpen ? 'Open' : (totalPnL >= 0 ? 'Closed' : 'Closed'),
              tradeDuration,
              tradePairs
            });
            
            tradeIndex++;
            if (tradeIndex % 5 === 0) positionIndex++;
          }
        }
        
        const sampleData: BacktestResults = { trades };
        this.setData(sampleData);
        console.log(`Generated comprehensive NIFTY-only sample data with ${sampleData.trades.length} trades across 2024`);
        console.log(`Total transaction pairs: ${sampleData.trades.reduce((sum, trade) => sum + trade.tradePairs.length, 0)}`);
      } catch (error) {
        console.error("Error generating comprehensive sample data:", error);
      }
    }
    return this._data;
  }

  public loadSampleData(): void {
    this.getSampleData();
  }
}

export const tradeService = TradeDataService.getInstance();
// Initialize with comprehensive sample data
tradeService.loadSampleData();
