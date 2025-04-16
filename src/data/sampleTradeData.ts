
import { BacktestResults } from "@/models/TradeTypes";

export const sampleTradeData: BacktestResults = {
  trades: [
    {
      index: "1",
      positionId: "POS-20240416-1",
      instrumentType: "Options",
      symbol: "NIFTY",
      entryDate: "2024-04-16",
      entryTime: "09:36:00",
      exitDate: "2024-04-16",
      exitTime: "14:56:00",
      vix: 12.55,
      profitLoss: -26025.00,
      status: "Closed",
      tradeDuration: "05:20:00",
      tradePairs: [
        {
          index: "1.1",
          entry: {
            nodeId: "ENTRY-001",
            positionId: "POS-20240416-1-1",
            type: "CE",
            strike: 22200,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 87.10,
            orderType: "Market",
            timestamp: "2024-04-16T10:08:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-001",
            positionId: "POS-20240416-1-1",
            type: "CE",
            strike: 22200,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 82.75,
            orderType: "Market",
            exitReason: "Signal",
            timestamp: "2024-04-16T10:13:00Z",
            profitLoss: -3262.50,
            status: "Executed"
          }
        },
        {
          index: "1.2",
          entry: {
            nodeId: "ENTRY-002",
            positionId: "POS-20240416-1-2",
            type: "PE",
            strike: 22200,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 104.45,
            orderType: "Market",
            timestamp: "2024-04-16T09:46:00Z",
            status: "Executed",
            entryNumber: 2,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-002",
            positionId: "POS-20240416-1-2",
            type: "PE",
            strike: 22200,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 99.25,
            orderType: "Market",
            exitReason: "Signal",
            timestamp: "2024-04-16T09:49:00Z",
            profitLoss: -3900.00,
            status: "Executed"
          }
        },
        {
          index: "1.3",
          entry: {
            nodeId: "ENTRY-003",
            positionId: "POS-20240416-1-3",
            type: "PE",
            strike: 22200,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 104.45,
            orderType: "Market",
            timestamp: "2024-04-16T09:50:00Z",
            status: "Executed",
            entryNumber: 3,
            reEntryNumber: 1
          },
          exit: {
            nodeId: "EXIT-003",
            positionId: "POS-20240416-1-3",
            type: "PE",
            strike: 22200,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 99.25,
            orderType: "Market",
            exitReason: "Signal",
            timestamp: "2024-04-16T09:52:00Z",
            profitLoss: -3900.00,
            status: "Executed"
          }
        },
        {
          index: "1.4",
          entry: {
            nodeId: "ENTRY-004",
            positionId: "POS-20240416-1-4",
            type: "PE",
            strike: 22200,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 104.45,
            orderType: "Market",
            timestamp: "2024-04-16T10:23:00Z",
            status: "Executed",
            entryNumber: 4,
            reEntryNumber: 2
          },
          exit: {
            nodeId: "EXIT-004",
            positionId: "POS-20240416-1-4",
            type: "PE",
            strike: 22200,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 99.25,
            orderType: "Market",
            exitReason: "Signal",
            timestamp: "2024-04-16T10:27:00Z",
            profitLoss: -3900.00,
            status: "Executed"
          }
        },
        {
          index: "1.5",
          entry: {
            nodeId: "ENTRY-005",
            positionId: "POS-20240416-1-5",
            type: "CE",
            strike: 22200,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 87.10,
            orderType: "Market",
            timestamp: "2024-04-16T10:38:00Z",
            status: "Executed",
            entryNumber: 5,
            reEntryNumber: 1
          },
          exit: {
            nodeId: "EXIT-005",
            positionId: "POS-20240416-1-5",
            type: "CE",
            strike: 22200,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 82.75,
            orderType: "Market",
            exitReason: "Signal",
            timestamp: "2024-04-16T10:39:00Z",
            profitLoss: -3262.50,
            status: "Executed"
          }
        },
        {
          index: "1.6",
          entry: {
            nodeId: "ENTRY-006",
            positionId: "POS-20240416-1-6",
            type: "PE",
            strike: 22200,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 104.45,
            orderType: "Market",
            timestamp: "2024-04-16T12:03:00Z",
            status: "Executed",
            entryNumber: 6,
            reEntryNumber: 3
          },
          exit: {
            nodeId: "EXIT-006",
            positionId: "POS-20240416-1-6",
            type: "PE",
            strike: 22200,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 99.25,
            orderType: "Market",
            exitReason: "Signal",
            timestamp: "2024-04-16T12:12:00Z",
            profitLoss: -3900.00,
            status: "Executed"
          }
        },
        {
          index: "1.7",
          entry: {
            nodeId: "ENTRY-007",
            positionId: "POS-20240416-1-7",
            type: "PE",
            strike: 22200,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 104.45,
            orderType: "Market",
            timestamp: "2024-04-16T12:21:00Z",
            status: "Executed",
            entryNumber: 7,
            reEntryNumber: 4
          },
          exit: {
            nodeId: "EXIT-007",
            positionId: "POS-20240416-1-7",
            type: "PE",
            strike: 22200,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 99.25,
            orderType: "Market",
            exitReason: "Signal",
            timestamp: "2024-04-16T12:22:00Z",
            profitLoss: -3900.00,
            status: "Executed"
          }
        }
      ]
    },
    {
      index: "2",
      positionId: "POS-20240418-2",
      instrumentType: "Options",
      symbol: "NIFTY",
      entryDate: "2024-04-18",
      entryTime: "09:36:00",
      exitDate: "2024-04-18",
      exitTime: "13:30:00",
      vix: 12.22,
      profitLoss: -31687.50,
      status: "Closed",
      tradeDuration: "03:54:00",
      tradePairs: [
        {
          index: "2.1",
          entry: {
            nodeId: "ENTRY-008",
            positionId: "POS-20240418-2-1",
            type: "CE",
            strike: 22250,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 42.70,
            orderType: "Market",
            timestamp: "2024-04-18T11:07:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-008",
            positionId: "POS-20240418-2-1",
            type: "CE",
            strike: 22250,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 40.55,
            orderType: "Market",
            exitReason: "SL",
            timestamp: "2024-04-18T11:08:00Z",
            profitLoss: -1612.50,
            status: "Executed"
          }
        },
        {
          index: "2.2",
          entry: {
            nodeId: "ENTRY-009",
            positionId: "POS-20240418-2-2",
            type: "PE",
            strike: 22250,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 100.10,
            orderType: "Market",
            timestamp: "2024-04-18T09:47:00Z",
            status: "Executed",
            entryNumber: 2,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-009",
            positionId: "POS-20240418-2-2",
            type: "PE",
            strike: 22250,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 95.10,
            orderType: "Market",
            exitReason: "SL",
            timestamp: "2024-04-18T09:51:00Z",
            profitLoss: -3750.00,
            status: "Executed"
          }
        }
      ]
    },
    {
      index: "3",
      positionId: "POS-20240419-3",
      instrumentType: "Options",
      symbol: "NIFTY",
      entryDate: "2024-04-19",
      entryTime: "09:36:00",
      exitDate: "2024-04-19",
      exitTime: "14:56:00",
      vix: 13.99,
      profitLoss: 81562.50,
      status: "Closed",
      tradeDuration: "05:20:00",
      tradePairs: [
        {
          index: "3.5",
          entry: {
            nodeId: "ENTRY-022",
            positionId: "POS-20240419-3-5",
            type: "CE",
            strike: 21850,
            buySell: "Buy",
            quantity: 750,
            entryPrice: 199.75,
            orderType: "Market",
            timestamp: "2024-04-19T11:23:00Z",
            status: "Executed",
            entryNumber: 5,
            reEntryNumber: 4
          },
          exit: {
            nodeId: "EXIT-022",
            positionId: "POS-20240419-3-5",
            type: "CE",
            strike: 21850,
            buySell: "Sell",
            quantity: 750,
            exitPrice: 348.50,
            orderType: "Market",
            exitReason: "TSL",
            timestamp: "2024-04-19T14:56:00Z",
            profitLoss: 111562.50,
            status: "Executed"
          }
        }
      ]
    }
  ]
};

// Remove the circular dependency - the service will import this data now, not the other way around
