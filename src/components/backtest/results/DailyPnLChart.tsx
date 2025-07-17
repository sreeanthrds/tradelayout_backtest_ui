import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tradeService } from "@/services/TradeDataService";

interface DailyPnLData {
  date: string;
  pnl: number;
  monthYear: string;
}

export function DailyPnLChart() {
  const dailyPnLData = useMemo(() => {
    const tradesData = tradeService.getData();
    const trades = tradesData.trades || [];
    
    if (trades.length === 0) return [];

    // Group trades by date and calculate daily P&L
    const dailyPnL: { [key: string]: number } = {};
    
    trades.forEach(trade => {
      if (trade.exitTime && trade.profitLoss !== null) {
        const date = new Date(trade.exitTime).toDateString();
        dailyPnL[date] = (dailyPnL[date] || 0) + trade.profitLoss;
      }
    });

    // Convert to array and sort by date
    const data: DailyPnLData[] = Object.entries(dailyPnL).map(([date, pnl]) => {
      const dateObj = new Date(date);
      return {
        date: dateObj.toISOString().split('T')[0],
        pnl,
        monthYear: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return data;
  }, []);

  // Group data by month for display
  const monthlyData = useMemo(() => {
    const grouped: { [key: string]: DailyPnLData[] } = {};
    dailyPnLData.forEach(item => {
      if (!grouped[item.monthYear]) {
        grouped[item.monthYear] = [];
      }
      grouped[item.monthYear].push(item);
    });
    return grouped;
  }, [dailyPnLData]);

  const getColorIntensity = (pnl: number, maxAbsPnL: number) => {
    if (maxAbsPnL === 0) return 0.1;
    const intensity = Math.abs(pnl) / maxAbsPnL;
    return Math.max(0.1, Math.min(1, intensity));
  };

  const maxAbsPnL = Math.max(...dailyPnLData.map(d => Math.abs(d.pnl)));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (dailyPnLData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily P&L Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No trading data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily P&L Performance</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Loss</span>
          </div>
          <span>• Intensity based on P&L amount</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(monthlyData).map(([monthYear, data]) => (
            <div key={monthYear} className="space-y-2">
              <h4 className="font-medium text-sm">{monthYear}</h4>
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-xs text-center text-muted-foreground p-1">
                    {day}
                  </div>
                ))}
                
                {/* Fill empty cells for the first week */}
                {data.length > 0 && Array.from({ length: new Date(data[0].date).getDay() }).map((_, i) => (
                  <div key={i} className="w-3 h-3"></div>
                ))}
                
                {/* P&L dots */}
                {data.map(item => {
                  const intensity = getColorIntensity(item.pnl, maxAbsPnL);
                  const isProfit = item.pnl >= 0;
                  
                  return (
                    <div
                      key={item.date}
                      className="group relative"
                      title={`${new Date(item.date).toLocaleDateString()}: ${formatCurrency(item.pnl)}`}
                    >
                      <div
                        className="w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-125"
                        style={{
                          backgroundColor: isProfit 
                            ? `rgba(34, 197, 94, ${intensity})` 
                            : `rgba(239, 68, 68, ${intensity})`,
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div>{new Date(item.date).toLocaleDateString()}</div>
                        <div className={isProfit ? "text-emerald-600" : "text-red-600"}>
                          {formatCurrency(item.pnl)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {dailyPnLData.filter(d => d.pnl > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Profit Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {dailyPnLData.filter(d => d.pnl < 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Loss Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {formatCurrency(dailyPnLData.reduce((sum, d) => sum + d.pnl, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total P&L</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}