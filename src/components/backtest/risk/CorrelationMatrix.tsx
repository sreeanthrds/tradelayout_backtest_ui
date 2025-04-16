
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CorrelationItem } from "./mockCorrelationData";
import { CorrelationTable } from "./components/CorrelationTable";
import { CorrelationInterpretation } from "./components/CorrelationInterpretation";
import { CorrelationInsights } from "./components/CorrelationInsights";

export function CorrelationMatrix({ data }: { data: CorrelationItem[] }) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Correlation Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Strategy correlation with market indices
        </p>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <CorrelationTable data={data} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CorrelationInterpretation />
        <CorrelationInsights data={data} />
      </div>
    </div>
  );
}
