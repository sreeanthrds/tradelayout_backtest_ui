
import { KeyRiskMetricsCard } from "./risk/KeyRiskMetricsCard";
import { RiskProfileCard } from "./risk/RiskProfileCard";
import { mockRiskData, mockRadarData } from "./risk/types";

export function RiskMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KeyRiskMetricsCard riskData={mockRiskData} />
        <RiskProfileCard radarData={mockRadarData} />
      </div>
    </div>
  );
}
