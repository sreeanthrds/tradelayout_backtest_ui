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
    if (value > 0) return "text-emerald-600";
    if (value < 0) return "text-red-600";
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
      colorClass: "text-blue-600"
    },
    {
      title: "Max Drawdown",
      value: formatCurrency(-Math.abs(backtestData.maxDrawdownAmount)),
      subtitle: `-${backtestData.maxDrawdownPercent.toFixed(2)}%`,
      icon: AlertTriangle,
      colorClass: "text-red-600"
    },
    {
      title: "Max Profit (Single)",
      value: formatCurrency(backtestData.maxProfitSingleTrade),
      subtitle: "Single trade profit",
      icon: Trophy,
      colorClass: "text-emerald-600"
    },
    {
      title: "Max Loss (Single)",
      value: formatCurrency(backtestData.maxLossSingleTrade),
      subtitle: "Single trade loss",
      icon: TrendingDown,
      colorClass: "text-red-600"
    },
    {
      title: "Win Streak",
      value: `${backtestData.maxWinStreak}`,
      subtitle: `Max winning streak`,
      icon: TrendingUp,
      colorClass: "text-emerald-600"
    },
    {
      title: "Loss Streak",
      value: `${backtestData.maxLossStreak}`,
      subtitle: `Max losing streak`,
      icon: TrendingDown,
      colorClass: "text-red-600"
    },
    {
      title: "Sharpe Ratio",
      value: backtestData.sharpeRatio.toFixed(3),
      subtitle: "Risk-adjusted return",
      icon: BarChart,
      colorClass: backtestData.sharpeRatio >= 1 ? "text-emerald-600" : backtestData.sharpeRatio >= 0.5 ? "text-yellow-600" : "text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="bg-background">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-2xl font-bold ${metric.colorClass}`}>
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}