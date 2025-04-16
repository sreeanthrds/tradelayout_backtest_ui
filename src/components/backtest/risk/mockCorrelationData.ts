
export interface CorrelationItem {
  name: string;
  strategy: number;
  sp500: number;
  nasdaq: number;
  russell2000: number;
  vix: number;
  bonds: number;
}

export const mockCorrelationData: CorrelationItem[] = [
  {
    name: "strategy",
    strategy: 1,
    sp500: 0.32,
    nasdaq: 0.47,
    russell2000: 0.26,
    vix: -0.58,
    bonds: 0.15
  },
  {
    name: "sp500",
    strategy: 0.32,
    sp500: 1,
    nasdaq: 0.85,
    russell2000: 0.74,
    vix: -0.76,
    bonds: -0.22
  },
  {
    name: "nasdaq",
    strategy: 0.47,
    sp500: 0.85,
    nasdaq: 1,
    russell2000: 0.68,
    vix: -0.65,
    bonds: -0.18
  },
  {
    name: "russell2000",
    strategy: 0.26,
    sp500: 0.74,
    nasdaq: 0.68,
    russell2000: 1,
    vix: -0.63,
    bonds: -0.15
  },
  {
    name: "vix",
    strategy: -0.58,
    sp500: -0.76,
    nasdaq: -0.65,
    russell2000: -0.63,
    vix: 1,
    bonds: 0.21
  },
  {
    name: "bonds",
    strategy: 0.15,
    sp500: -0.22,
    nasdaq: -0.18,
    russell2000: -0.15,
    vix: 0.21,
    bonds: 1
  }
];
