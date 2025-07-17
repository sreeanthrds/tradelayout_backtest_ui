
import { MonthlyPerformanceChart } from "./MonthlyPerformanceChart";
import { EquityCurveChart } from "./EquityCurveChart";
import { DailyPnLChart } from "./DailyPnLChart";

export function PerformanceTabContent() {
  return (
    <div className="space-y-6">
      <DailyPnLChart />
      <EquityCurveChart />
      <MonthlyPerformanceChart />
    </div>
  );
}
