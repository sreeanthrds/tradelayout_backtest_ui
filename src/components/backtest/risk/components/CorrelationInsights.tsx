
import React from "react";
import { CorrelationItem } from "../mockCorrelationData";

interface CorrelationInsightsProps {
  data: CorrelationItem[];
}

export function CorrelationInsights({ data }: CorrelationInsightsProps) {
  // Using first item (strategy) for insights
  const strategyData = data[0];
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Key Insights</h4>
      <ul className="text-sm space-y-1">
        <li>
          <span className="text-muted-foreground">Strategy and VIX:</span> {strategyData.vix < -0.5 ? "Negative correlation suggests the strategy performs well in low-volatility environments" : "Limited correlation with market volatility"}
        </li>
        <li>
          <span className="text-muted-foreground">Strategy and Indices:</span> {strategyData.sp500 > 0.7 || strategyData.nasdaq > 0.7 ? "High correlation with market indices indicates limited diversification benefit" : "Moderate correlation provides some diversification"}
        </li>
        <li>
          <span className="text-muted-foreground">Bonds Relationship:</span> {Math.abs(strategyData.bonds) < 0.3 ? "Low correlation with bonds offers diversification benefits" : "Notable correlation with bonds may impact portfolio construction"}
        </li>
      </ul>
    </div>
  );
}
