
import { KeyRiskMetricsCard } from "./risk/KeyRiskMetricsCard";
import { RiskProfileCard } from "./risk/RiskProfileCard";


export function RiskMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KeyRiskMetricsCard riskData={{} as any} />
        <RiskProfileCard radarData={[]} />
      </div>
    </div>
  );
}
