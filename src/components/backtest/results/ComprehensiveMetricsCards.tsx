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

  const getCardBackground = (metric: any) => {
    if (metric.title.includes('P&L') || metric.title.includes('Total')) {
      return metric.value.includes('₹') && parseFloat(metric.value.replace(/[₹,\s]/g, '')) >= 0 
        ? 'from-emerald-200 via-green-100 to-teal-50 dark:from-emerald-900/40 dark:via-green-800/30 dark:to-teal-900/20' 
        : 'from-rose-200 via-red-100 to-pink-50 dark:from-rose-900/40 dark:via-red-800/30 dark:to-pink-900/20';
    }
    if (metric.title.includes('Win')) return 'from-blue-200 via-cyan-100 to-sky-50 dark:from-blue-900/40 dark:via-cyan-800/30 dark:to-sky-900/20';
    if (metric.title.includes('Drawdown') || metric.title.includes('Loss')) return 'from-orange-200 via-amber-100 to-yellow-50 dark:from-orange-900/40 dark:via-amber-800/30 dark:to-yellow-900/20';
    if (metric.title.includes('Profit') || metric.title.includes('Streak')) return 'from-purple-200 via-violet-100 to-indigo-50 dark:from-purple-900/40 dark:via-violet-800/30 dark:to-indigo-900/20';
    if (metric.title.includes('Sharpe')) return 'from-indigo-200 via-blue-100 to-cyan-50 dark:from-indigo-900/40 dark:via-blue-800/30 dark:to-cyan-900/20';
    return 'from-slate-200 via-gray-100 to-zinc-50 dark:from-slate-900/40 dark:via-gray-800/30 dark:to-zinc-900/20';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index} 
            variant="glass-intense" 
            className={`hover:shadow-2xl hover:scale-105 transition-all duration-500 group border-2 border-white/30 dark:border-white/10 bg-gradient-to-br ${getCardBackground(metric)} backdrop-blur-xl shadow-xl hover:shadow-2xl`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
                  {metric.title}
                </CardTitle>
                <div className="p-3 rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-sm shadow-lg border border-white/30">
                  <Icon className="h-5 w-5 text-foreground/90 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-2xl font-bold ${metric.colorClass} group-hover:scale-110 transition-all duration-300 drop-shadow-sm break-words`}>
                {metric.value}
              </div>
              <p className="text-xs text-foreground/80 mt-2 group-hover:text-foreground transition-colors font-medium break-words">
                {metric.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}