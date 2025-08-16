import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBacktestData } from "@/hooks/useBacktestData";
import { TrendingUp, TrendingDown, Target, AlertTriangle, Trophy, BarChart } from "lucide-react";

export function ComprehensiveMetricsCards() {
  const { backtestData } = useBacktestData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getColorClass = (value: number) => {
    if (value > 0) return "text-success";
    if (value < 0) return "text-danger";
    return "text-muted-foreground";
  };

  const metrics = [
    {
      title: "Total P&L",
      value: formatCurrency(backtestData.totalReturn),
      subtitle: formatPercent(backtestData.totalReturnPercent),
      icon: backtestData.totalReturn >= 0 ? TrendingUp : TrendingDown,
      colorClass: getColorClass(backtestData.totalReturn)
    },
    {
      title: "Win Rate",
      value: formatPercent(backtestData.winRate),
      subtitle: `${backtestData.totalWins} / ${backtestData.totalTrades} trades`,
      icon: Target,
      colorClass: "text-info"
    },
    {
      title: "Max Drawdown",
      value: formatCurrency(-Math.abs(backtestData.maxDrawdownAmount)),
      subtitle: `-${backtestData.maxDrawdownPercent.toFixed(2)}%`,
      icon: AlertTriangle,
      colorClass: "text-danger"
    },
    {
      title: "Max Profit (Single)",
      value: formatCurrency(backtestData.maxProfitSingleTrade),
      subtitle: "Single trade profit",
      icon: Trophy,
      colorClass: "text-success"
    },
    {
      title: "Max Loss (Single)",
      value: formatCurrency(backtestData.maxLossSingleTrade),
      subtitle: "Single trade loss",
      icon: TrendingDown,
      colorClass: "text-danger"
    },
    {
      title: "Win Streak",
      value: `${backtestData.maxWinStreak}`,
      subtitle: `Max winning streak`,
      icon: TrendingUp,
      colorClass: "text-success"
    },
    {
      title: "Loss Streak",
      value: `${backtestData.maxLossStreak}`,
      subtitle: `Max losing streak`,
      icon: TrendingDown,
      colorClass: "text-danger"
    },
    {
      title: "Sharpe Ratio",
      value: backtestData.sharpeRatio.toFixed(3),
      subtitle: "Risk-adjusted return",
      icon: BarChart,
      colorClass: backtestData.sharpeRatio >= 1 ? "text-success" : backtestData.sharpeRatio >= 0.5 ? "text-warning" : "text-danger"
    }
  ];

  const getCardClass = (metric: any) => {
    if (metric.title.includes('P&L') || metric.title.includes('Total')) {
      return metric.value.includes('₹') && parseFloat(metric.value.replace(/[₹,\s]/g, '')) >= 0 
        ? 'border-success/20 bg-success-muted' 
        : 'border-danger/20 bg-danger-muted';
    }
    if (metric.title.includes('Win')) return 'border-info/20 bg-info-muted';
    if (metric.title.includes('Drawdown') || metric.title.includes('Loss')) return 'border-warning/20 bg-warning-muted';
    if (metric.title.includes('Profit') || metric.title.includes('Streak')) return 'border-primary/20 bg-primary/5';
    if (metric.title.includes('Sharpe')) return 'border-info/20 bg-info-muted';
    return 'border-border bg-muted/5';
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index} 
            className={`hover:shadow-lg hover:scale-105 transition-all duration-300 group border-2 ${getCardClass(metric)} shadow-sm hover:shadow-md`}
          >
            <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-foreground group-hover:text-foreground transition-colors sm:text-sm">
                  {metric.title}
                </CardTitle>
                <div className="p-1.5 rounded-lg bg-muted border sm:p-2">
                  <Icon className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors sm:h-4 sm:w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 p-3 sm:p-4">
              <div className={`text-lg font-bold ${metric.colorClass} group-hover:scale-105 transition-all duration-300 sm:text-xl lg:text-2xl`}>
                {metric.value}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 group-hover:text-foreground transition-colors sm:text-xs sm:mt-2">
                {metric.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}