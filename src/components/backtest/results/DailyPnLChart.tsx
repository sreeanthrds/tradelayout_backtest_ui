import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tradeService } from "@/services/TradeDataService";

interface DailyPnLData {
  date: string;
  pnl: number;
  monthYear: string;
  month: string;
  year: string;
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
        const date = new Date(trade.exitDate || trade.entryDate).toISOString().split('T')[0];
        dailyPnL[date] = (dailyPnL[date] || 0) + trade.profitLoss;
      }
    });

    // Convert to array and sort by date
    const data: DailyPnLData[] = Object.entries(dailyPnL).map(([date, pnl]) => {
      const dateObj = new Date(date);
      return {
        date,
        pnl,
        monthYear: dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        month: dateObj.toLocaleDateString('en-US', { month: 'short' }),
        year: dateObj.getFullYear().toString()
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return data;
  }, []);

  // Group data by month for display
  const monthlyData = useMemo(() => {
    const grouped: { [key: string]: { data: DailyPnLData[], total: number } } = {};
    
    dailyPnLData.forEach(item => {
      const key = item.monthYear;
      if (!grouped[key]) {
        grouped[key] = { data: [], total: 0 };
      }
      grouped[key].data.push(item);
      grouped[key].total += item.pnl;
    });
    
    return grouped;
  }, [dailyPnLData]);

  const getColorIntensity = (pnl: number, maxAbsPnL: number) => {
    if (maxAbsPnL === 0) return 0.3;
    const intensity = Math.abs(pnl) / maxAbsPnL;
    return Math.max(0.3, Math.min(1, intensity * 0.8 + 0.2));
  };

  const maxAbsPnL = Math.max(...dailyPnLData.map(d => Math.abs(d.pnl)));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

  // Create calendar grid for each month
  const createCalendarGrid = (monthData: DailyPnLData[]) => {
    if (monthData.length === 0) return [];
    
    const firstDate = new Date(monthData[0].date);
    const year = firstDate.getFullYear();
    const month = firstDate.getMonth();
    
    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const calendar = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toISOString().split('T')[0];
      const dayData = monthData.find(d => d.date === dateStr);
      calendar.push(dayData || { date: dateStr, pnl: 0, monthYear: '', month: '', year: '' });
    }
    
    return calendar;
  };

  return (
    <Card className="bg-background">
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
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-max">
              {Object.entries(monthlyData).map(([monthYear, { data, total }]) => (
                <div key={monthYear} className="space-y-3">
                  <div className="text-center">
                    <h4 className="font-medium text-sm">{monthYear}</h4>
                  </div>
                  
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div key={`${day}-${index}`} className="w-8 h-4 flex items-center justify-center">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {createCalendarGrid(data).map((item, index) => {
                      if (!item) {
                        return <div key={index} className="w-8 h-8"></div>;
                      }
                      
                      const intensity = getColorIntensity(item.pnl, maxAbsPnL);
                      const isProfit = item.pnl > 0;
                      const isLoss = item.pnl < 0;
                      
                      return (
                        <div
                          key={item.date}
                          className="group relative w-8 h-8 flex items-center justify-center"
                          title={`${new Date(item.date).toLocaleDateString()}: ${formatCurrency(item.pnl)}`}
                        >
                          {item.pnl !== 0 ? (
                            <div
                              className="w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-125"
                              style={{
                                backgroundColor: isProfit 
                                  ? `rgba(16, 185, 129, ${intensity})` 
                                  : isLoss 
                                  ? `rgba(239, 68, 68, ${intensity})`
                                  : 'transparent',
                              }}
                            />
                          ) : (
                            <div className="w-3 h-3"></div>
                          )}
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            <div>{new Date(item.date).toLocaleDateString()}</div>
                            <div className={isProfit ? "text-emerald-600" : isLoss ? "text-red-600" : ""}>
                              {formatCurrency(item.pnl)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Monthly total */}
                  <div className="text-center text-sm">
                    <div className={`font-medium ${total >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Overall Summary */}
        <div className="mt-8 pt-6 border-t">
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
              <div className="text-sm text-muted-foreground">Net P&L</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}