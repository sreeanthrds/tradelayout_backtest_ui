
import { Button } from "@/components/ui/button";
import { 
  ArrowDownToLine, 
  ChevronLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { tradeService } from "@/services/TradeDataService";

interface BacktestResultsHeaderProps {
  backtestData: {
    name: string;
    symbol: string;
    period: string;
    trades: number;
    totalReturn?: number;
    winRate?: number;
    maxDrawdown?: number;
    sharpeRatio?: number;
  };
}

export function BacktestResultsHeader({ backtestData }: BacktestResultsHeaderProps) {
  const navigate = useNavigate();
  
  const handleExport = () => {
    try {
      const tradesData = tradeService.getData();
      const exportData = {
        strategy: backtestData.name,
        period: backtestData.period,
        summary: {
          symbol: backtestData.symbol,
          totalTrades: backtestData.trades,
          totalReturn: backtestData.totalReturn || 0,
          winRate: backtestData.winRate || 0,
          maxDrawdown: backtestData.maxDrawdown || 0,
          sharpeRatio: backtestData.sharpeRatio || 0
        },
        trades: tradesData,
        exportedAt: new Date().toISOString()
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backtest-results-${backtestData.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting backtest results:', error);
    }
  };
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{backtestData.name}</h1>
          <p className="text-muted-foreground">
            {backtestData.symbol} • {backtestData.period} • {backtestData.trades} trades
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleExport}>
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>
    </div>
  );
}
