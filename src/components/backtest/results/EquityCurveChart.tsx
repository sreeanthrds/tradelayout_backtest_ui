import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { tradeService } from "@/services/TradeDataService";
import { useMemo } from "react";

export function EquityCurveChart() {
  const equityData = useMemo(() => {
    const trades = tradeService.getData().trades || [];
    const closedTrades = trades
      .filter(trade => trade.profitLoss !== null)
      .sort((a, b) => new Date(a.entryDate + 'T' + a.entryTime).getTime() - new Date(b.entryDate + 'T' + b.entryTime).getTime());
    
    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    
    const equityCurve = closedTrades.map((trade, index) => {
      runningPnL += trade.profitLoss || 0;
      
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      
      const currentDrawdown = peak - runningPnL;
      const drawdownPercent = peak > 0 ? (currentDrawdown / peak) * 100 : 0;
      
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }
      
      const date = new Date(trade.entryDate);
      
      return {
        tradeNumber: index + 1,
        date: date.toLocaleDateString('en-IN'),
        equity: Math.round(runningPnL),
        drawdown: Math.round(currentDrawdown),
        drawdownPercent: Math.round(drawdownPercent * 100) / 100,
        tradePnL: trade.profitLoss || 0
      };
    });
    
    return { equityCurve, maxDrawdown: Math.round(maxDrawdown), finalEquity: Math.round(runningPnL) };
  }, []);

  const winningTrades = equityData.equityCurve.filter(point => point.tradePnL > 0).length;
  const totalTrades = equityData.equityCurve.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equity Curve & P&L Analysis</CardTitle>
        <CardDescription>
          Cumulative P&L progression • {totalTrades} trades • {winRate.toFixed(1)}% win rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-2xl font-bold ${equityData.finalEquity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{equityData.finalEquity.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Final P&L</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-red-600">₹{equityData.maxDrawdown.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Max Drawdown</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">{winningTrades}</div>
            <div className="text-sm text-muted-foreground">Winning Trades</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-red-600">{totalTrades - winningTrades}</div>
            <div className="text-sm text-muted-foreground">Losing Trades</div>
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityData.equityCurve} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="tradeNumber" 
                className="text-xs" 
                tick={{ fontSize: 12 }}
                label={{ value: 'Trade Number', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                className="text-xs" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                label={{ value: 'Cumulative P&L', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  name === 'equity' ? `₹${value.toLocaleString()}` : `₹${value.toLocaleString()}`,
                  name === 'equity' ? 'Cumulative P&L' : 'Trade P&L'
                ]}
                labelFormatter={(label) => {
                  const point = equityData.equityCurve[label - 1];
                  return `Trade #${label} • ${point?.date || ''}`;
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
              <Line 
                type="monotone" 
                dataKey="equity" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}