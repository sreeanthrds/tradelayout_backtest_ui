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
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-rose-400";
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
      colorClass: "text-blue-500"
    },
    {
      title: "Max Drawdown",
      value: formatCurrency(-Math.abs(backtestData.maxDrawdownAmount)),
      subtitle: `-${backtestData.maxDrawdownPercent.toFixed(2)}%`,
      icon: AlertTriangle,
      colorClass: "text-rose-400"
    },
    {
      title: "Max Profit (Single)",
      value: formatCurrency(backtestData.maxProfitSingleTrade),
      subtitle: "Single trade profit",
      icon: Trophy,
      colorClass: "text-green-500"
    },
    {
      title: "Max Loss (Single)",
      value: formatCurrency(backtestData.maxLossSingleTrade),
      subtitle: "Single trade loss",
      icon: TrendingDown,
      colorClass: "text-rose-400"
    },
    {
      title: "Win Streak",
      value: `${backtestData.maxWinStreak}`,
      subtitle: `Max winning streak`,
      icon: TrendingUp,
      colorClass: "text-green-500"
    },
    {
      title: "Loss Streak",
      value: `${backtestData.maxLossStreak}`,
      subtitle: `Max losing streak`,
      icon: TrendingDown,
      colorClass: "text-rose-400"
    },
    {
      title: "Sharpe Ratio",
      value: backtestData.sharpeRatio.toFixed(3),
      subtitle: "Risk-adjusted return",
      icon: BarChart,
      colorClass: backtestData.sharpeRatio >= 1 ? "text-green-500" : backtestData.sharpeRatio >= 0.5 ? "text-yellow-500" : "text-rose-400"
    }
  ];

  const getCardBackground = (metric: any) => {
    if (metric.title.includes('P&L') || metric.title.includes('Total')) {
      return metric.value.includes('₹') && parseFloat(metric.value.replace(/[₹,\s]/g, '')) >= 0 
        ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30' 
        : 'bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-950/30 dark:to-red-900/30';
    }
    if (metric.title.includes('Win')) return 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-900/30';
    if (metric.title.includes('Drawdown') || metric.title.includes('Loss')) return 'bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-900/30';
    if (metric.title.includes('Profit') || metric.title.includes('Streak')) return 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-900/30';
    return 'bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950/30 dark:to-gray-900/30';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index} 
            variant="glass-intense" 
            className={`hover:shadow-2xl transition-all duration-500 group border-0 ${getCardBackground(metric)} backdrop-blur-xl`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                  {metric.title}
                </CardTitle>
                <div className="p-2 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                  <Icon className="h-4 w-4 text-foreground/80 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-2xl font-bold ${metric.colorClass} group-hover:scale-105 transition-all duration-300`}>
                {metric.value}
              </div>
              <p className="text-xs text-foreground/60 mt-1 group-hover:text-foreground/80 transition-colors font-medium">
                {metric.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}