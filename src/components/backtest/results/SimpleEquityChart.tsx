import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useBacktestData } from "@/hooks/useBacktestData";

export function SimpleEquityChart() {
  const { backtestData } = useBacktestData();
  
  const equityData = useMemo(() => {
    if (!backtestData?.allTrades || backtestData.allTrades.length === 0) {
      return [];
    }

    const closedTrades = backtestData.allTrades
      .filter(trade => trade.status === 'closed' && trade.pnl !== null)
      .sort((a, b) => new Date(a.exit_time!).getTime() - new Date(b.exit_time!).getTime());

    let cumulativePnL = 0;
    return closedTrades.map((trade, index) => {
      cumulativePnL += trade.pnl!;
      return {
        trade: index + 1,
        equity: cumulativePnL,
        date: trade.exit_time
      };
    });
  }, [backtestData?.allTrades]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (equityData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No trade data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={equityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="trade" 
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), 'Equity']}
          labelFormatter={(label) => `Trade #${label}`}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="equity" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}