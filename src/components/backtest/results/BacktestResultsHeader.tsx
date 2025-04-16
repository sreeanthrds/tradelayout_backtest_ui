
import { Button } from "@/components/ui/button";
import { 
  ArrowDownToLine, 
  Share2, 
  Save, 
  ChevronLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BacktestResultsHeaderProps {
  backtestData: {
    name: string;
    symbol: string;
    period: string;
    trades: number;
  };
}

export function BacktestResultsHeader({ backtestData }: BacktestResultsHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
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
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button size="sm">
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
