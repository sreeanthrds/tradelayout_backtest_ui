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
    },
    {
      index: "4",
      positionId: "POS-20240420-4",
      instrumentType: "Futures",
      symbol: "BANKNIFTY",
      entryDate: "2024-04-20",
      entryTime: "09:30:00",
      exitDate: "2024-04-20",
      exitTime: "15:30:00",
      vix: 14.85,
      profitLoss: 45750.00,
      status: "Closed",
      tradeDuration: "06:00:00",
      tradePairs: [
        {
          index: "4.1",
          entry: {
            nodeId: "ENTRY-023",
            positionId: "POS-20240420-4-1",
            type: "FUT",
            strike: 48250,
            buySell: "Buy",
            quantity: 15,
            entryPrice: 48250.00,
            orderType: "Limit",
            timestamp: "2024-04-20T09:30:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-023",
            positionId: "POS-20240420-4-1",
            type: "FUT",
            strike: 48250,
            buySell: "Sell",
            quantity: 15,
            exitPrice: 49300.00,
            orderType: "Market",
            exitReason: "Target",
            timestamp: "2024-04-20T15:30:00Z",
            profitLoss: 15750.00,
            status: "Executed"
          }
        },
        {
          index: "4.2",
          entry: {
            nodeId: "ENTRY-024",
            positionId: "POS-20240420-4-2",
            type: "FUT",
            strike: 48300,
            buySell: "Buy",
            quantity: 15,
            entryPrice: 48300.00,
            orderType: "SL-M",
            timestamp: "2024-04-20T11:45:00Z",
            status: "Executed",
            entryNumber: 2,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-024",
            positionId: "POS-20240420-4-2",
            type: "FUT",
            strike: 48300,
            buySell: "Sell",
            quantity: 15,
            exitPrice: 50300.00,
            orderType: "Target",
            exitReason: "Target",
            timestamp: "2024-04-20T14:15:00Z",
            profitLoss: 30000.00,
            status: "Executed"
          }
        }
      ]
    },
    {
      index: "5",
      positionId: "POS-20240421-5",
      instrumentType: "Options",
      symbol: "INFY",
      entryDate: "2024-04-21",
      entryTime: "09:32:00",
      exitDate: null,
      exitTime: null,
      vix: 16.75,
      profitLoss: 0,
      status: "Pending",
      tradeDuration: "",
      tradePairs: [
        {
          index: "5.1",
          entry: {
            nodeId: "ENTRY-025",
            positionId: "POS-20240421-5-1",
            type: "PE",
            strike: 1620,
            buySell: "Buy",
            quantity: 300,
            entryPrice: 18.50,
            orderType: "Limit",
            timestamp: "2024-04-21T09:32:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: null
        }
      ]
    },
    {
      index: "6",
      positionId: "POS-20240422-6",
      instrumentType: "Options",
      symbol: "RELIANCE",
      entryDate: "2024-04-22",
      entryTime: "09:18:00",
      exitDate: "2024-04-22",
      exitTime: "09:19:00",
      vix: 15.32,
      profitLoss: 0,
      status: "Cancelled",
      tradeDuration: "00:01:00",
      tradePairs: [
        {
          index: "6.1",
          entry: {
            nodeId: "ENTRY-026",
            positionId: "POS-20240422-6-1",
            type: "CE",
            strike: 2950,
            buySell: "Buy",
            quantity: 250,
            entryPrice: 35.25,
            orderType: "Limit",
            timestamp: "2024-04-22T09:18:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-026",
            positionId: "POS-20240422-6-1",
            type: "CE",
            strike: 2950,
            buySell: "Sell",
            quantity: 250,
            exitPrice: 35.25,
            orderType: "Market",
            exitReason: "Cancelled",
            timestamp: "2024-04-22T09:19:00Z",
            profitLoss: 0,
            status: "Cancelled"
          }
        }
      ]
    },
    {
      index: "7",
      positionId: "POS-20240423-7",
      instrumentType: "Options",
      symbol: "HDFCBANK",
      entryDate: "2024-04-23",
      entryTime: "10:05:00",
      exitDate: "2024-04-23",
      exitTime: "15:25:00",
      vix: 13.25,
      profitLoss: -12850.00,
      status: "Closed",
      tradeDuration: "05:20:00",
      tradePairs: [
        {
          index: "7.1",
          entry: {
            nodeId: "ENTRY-027",
            positionId: "POS-20240423-7-1",
            type: "CE",
            strike: 1680,
            buySell: "Sell", // Short position
            quantity: 500,
            entryPrice: 25.70,
            orderType: "Market",
            timestamp: "2024-04-23T10:05:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-027",
            positionId: "POS-20240423-7-1",
            type: "CE",
            strike: 1680,
            buySell: "Buy", // Covering short
            quantity: 500,
            exitPrice: 51.40,
            orderType: "SL-M",
            exitReason: "SL",
            timestamp: "2024-04-23T12:15:00Z",
            profitLoss: -12850.00,
            status: "Executed"
          }
        }
      ]
    },
    {
      index: "8",
      positionId: "POS-20240424-8",
      instrumentType: "Options",
      symbol: "SBIN",
      entryDate: "2024-04-24",
      entryTime: "09:36:00",
      exitDate: null,
      exitTime: null,
      vix: 14.18,
      profitLoss: null,
      status: "Open",
      tradeDuration: "",
      tradePairs: [
        {
          index: "8.1",
          entry: {
            nodeId: "ENTRY-028",
            positionId: "POS-20240424-8-1",
            type: "Straddle",
            strike: 725,
            buySell: "Buy",
            quantity: 400,
            entryPrice: 18.75,
            orderType: "Market",
            timestamp: "2024-04-24T09:36:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: null
        },
        {
          index: "8.2",
          entry: {
            nodeId: "ENTRY-029",
            positionId: "POS-20240424-8-2",
            type: "PE",
            strike: 725,
            buySell: "Buy",
            quantity: 400,
            entryPrice: 17.85,
            orderType: "Market",
            timestamp: "2024-04-24T09:36:00Z",
            status: "Executed",
            entryNumber: 2,
            reEntryNumber: 0
          },
          exit: null
        }
      ]
    },
    {
      index: "9",
      positionId: "POS-20240425-9",
      instrumentType: "Options",
      symbol: "TCS",
      entryDate: "2024-04-25",
      entryTime: "09:18:00",
      exitDate: "2024-04-25",
      exitTime: "15:29:00",
      vix: 15.10,
      profitLoss: 28750.00,
      status: "Closed",
      tradeDuration: "06:11:00",
      tradePairs: [
        {
          index: "9.1",
          entry: {
            nodeId: "ENTRY-030",
            positionId: "POS-20240425-9-1",
            type: "Iron Condor",
            strike: 3850,
            buySell: "Sell",
            quantity: 250,
            entryPrice: 45.80,
            orderType: "Limit",
            timestamp: "2024-04-25T09:18:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-030",
            positionId: "POS-20240425-9-1",
            type: "Iron Condor",
            strike: 3850,
            buySell: "Buy",
            quantity: 250,
            exitPrice: 34.30,
            orderType: "Market",
            exitReason: "Time Decay",
            timestamp: "2024-04-25T15:29:00Z",
            profitLoss: 28750.00,
            status: "Executed"
          }
        }
      ]
    },
    {
      index: "10",
      positionId: "POS-20240426-10",
      instrumentType: "Options",
      symbol: "TATAMOTORS",
      entryDate: "2024-04-26",
      entryTime: "10:22:00",
      exitDate: "2024-04-26", 
      exitTime: "11:05:00",
      vix: 16.85,
      profitLoss: -5625.00,
      status: "Error",
      tradeDuration: "00:43:00",
      tradePairs: [
        {
          index: "10.1",
          entry: {
            nodeId: "ENTRY-031",
            positionId: "POS-20240426-10-1",
            type: "CE",
            strike: 950,
            buySell: "Buy",
            quantity: 450,
            entryPrice: 15.25,
            orderType: "Market",
            timestamp: "2024-04-26T10:22:00Z",
            status: "Executed",
            entryNumber: 1,
            reEntryNumber: 0
          },
          exit: {
            nodeId: "EXIT-031",
            positionId: "POS-20240426-10-1",
            type: "CE",
            strike: 950,
            buySell: "Sell",
            quantity: 450,
            exitPrice: 12.75,
            orderType: "Market",
            exitReason: "Error",
            timestamp: "2024-04-26T11:05:00Z",
            profitLoss: -5625.00,
            status: "Error"
          }
        }
      ]
    }
  ]
};

// Remove the circular dependency - the service will import this data now, not the other way around
