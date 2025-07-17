import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { tradeService } from "@/services/TradeDataService";
import { useMemo } from "react";

export function MonthlyPerformanceChart() {
  const monthlyData = useMemo(() => {
    const trades = tradeService.getData().trades || [];
    const monthlyStats: { [key: string]: { pnl: number, trades: number } } = {};
    
    trades
      .filter(trade => trade.profitLoss !== null)
      .forEach(trade => {
        const date = new Date(trade.entryDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = { pnl: 0, trades: 0 };
        }
        
        monthlyStats[monthKey].pnl += trade.profitLoss || 0;
        monthlyStats[monthKey].trades += 1;
      });
    
    return Object.entries(monthlyStats)
      .map(([month, stats]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        pnl: Math.round(stats.pnl),
        trades: stats.trades,
        isProfit: stats.pnl >= 0
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, []);

  const totalPnL = monthlyData.reduce((sum, month) => sum + month.pnl, 0);
  const winningMonths = monthlyData.filter(month => month.isProfit).length;
  const winRate = monthlyData.length > 0 ? (winningMonths / monthlyData.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Performance Report</CardTitle>
        <CardDescription>
          Monthly aggregated P&L • {monthlyData.length} months • {winRate.toFixed(1)}% winning months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">₹{totalPnL.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total P&L</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{winningMonths}</div>
            <div className="text-sm text-muted-foreground">Winning Months</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{monthlyData.reduce((sum, m) => sum + m.trades, 0)}</div>
            <div className="text-sm text-muted-foreground">Total Trades</div>
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                className="text-xs" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `₹${value.toLocaleString()}`,
                  'P&L'
                ]}
                labelFormatter={(label) => `${label} • ${monthlyData.find(m => m.month === label)?.trades || 0} trades`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isProfit ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}