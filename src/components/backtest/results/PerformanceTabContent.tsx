
import { MonthlyPerformanceChart } from "./MonthlyPerformanceChart";
import { EquityCurveChart } from "./EquityCurveChart";

export function PerformanceTabContent() {
  return (
    <div className="space-y-6">
      <EquityCurveChart />
      <MonthlyPerformanceChart />
    </div>
  );
}
