
export const mockTrades = [
  {
    id: "TR-7821",
    date: "2023-12-15",
    strategy: "Iron Condor",
    symbol: "SPY",
    type: "Short",
    entryPrice: 468.25,
    exitPrice: 472.50,
    pnl: -542.75,
    pnlPercent: -2.7,
    status: "loss",
    details: {
      legs: 4,
      dte: 45,
      iv: "18.2%"
    }
  },
  {
    id: "TR-7820",
    date: "2023-12-10",
    strategy: "Bull Put Spread",
    symbol: "QQQ",
    type: "Short",
    entryPrice: 382.15,
    exitPrice: 379.80,
    pnl: 312.50,
    pnlPercent: 1.8,
    status: "win",
    details: {
      legs: 2,
      dte: 32,
      iv: "16.5%"
    }
  },
  {
    id: "TR-7819",
    date: "2023-12-05",
    strategy: "Long Call",
    symbol: "AAPL",
    type: "Long",
    entryPrice: 185.75,
    exitPrice: 191.20,
    pnl: 685.00,
    pnlPercent: 8.3,
    status: "win",
    details: {
      legs: 1,
      dte: 60,
      iv: "20.3%"
    }
  },
  {
    id: "TR-7818",
    date: "2023-11-28",
    strategy: "Short Strangle",
    symbol: "MSFT",
    type: "Short",
    entryPrice: 375.50,
    exitPrice: 372.25,
    pnl: 218.50,
    pnlPercent: 1.2,
    status: "win",
    details: {
      legs: 2,
      dte: 28,
      iv: "19.8%"
    }
  },
  {
    id: "TR-7817",
    date: "2023-11-20",
    strategy: "Bear Call Spread",
    symbol: "TSLA",
    type: "Short",
    entryPrice: 234.80,
    exitPrice: 245.30,
    pnl: -789.25,
    pnlPercent: -4.1,
    status: "loss",
    details: {
      legs: 2,
      dte: 35,
      iv: "42.7%"
    }
  },
];
