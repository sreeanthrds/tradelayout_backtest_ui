
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Calculator } from "lucide-react";

interface ResultsSummaryProps {
  data: {
    totalReturn: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
    trades: number;
  }
}

export function ResultsSummary({ data }: ResultsSummaryProps) {
  const metrics = [
    {
      title: "Total Return",
      value: `${data.totalReturn.toFixed(2)}%`,
      icon: <TrendingUp className={`h-5 w-5 ${data.totalReturn >= 0 ? "text-emerald-500" : "text-red-500"}`} />,
      color: data.totalReturn >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
      bgColor: data.totalReturn >= 0 ? "bg-emerald-50 dark:bg-emerald-950/50" : "bg-red-50 dark:bg-red-950/50",
    },
    {
      title: "Win Rate",
      value: `${data.winRate.toFixed(1)}%`,
      icon: <Target className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Max Drawdown",
      value: `${data.maxDrawdown.toFixed(2)}%`,
      icon: <TrendingDown className="h-5 w-5 text-red-500 dark:text-red-400" />,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/50",
    },
    {
      title: "Sharpe Ratio",
      value: data.sharpeRatio.toFixed(2),
      icon: <Calculator className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
    },
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <Card key={index} className="overflow-hidden border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
              <div className={`p-3 rounded-full ${metric.bgColor}`}>
                {metric.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
