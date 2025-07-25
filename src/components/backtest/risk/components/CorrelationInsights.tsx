
import React from "react";


interface CorrelationInsightsProps {
  data: any[];
}

export function CorrelationInsights({ data }: CorrelationInsightsProps) {
  if (!data || data.length === 0) {
    return (
      <div>
        <h4 className="text-sm font-medium mb-2">Key Insights</h4>
        <p className="text-sm text-muted-foreground">No correlation data available</p>
      </div>
    );
  }
  
  // Using first item (strategy) for insights
  const strategyData = data[0];
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Key Insights</h4>
      <p className="text-sm text-muted-foreground">Correlation analysis will be available after running a backtest</p>
    </div>
  );
}
