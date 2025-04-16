
import React from "react";

export function CorrelationInterpretation() {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Interpretation</h4>
      <ul className="text-sm space-y-1">
        <li>
          <span className="text-muted-foreground">Strong Positive (above +0.7):</span> Assets move strongly together
        </li>
        <li>
          <span className="text-muted-foreground">Moderate Positive (+0.3 to +0.7):</span> Assets tend to move together
        </li>
        <li>
          <span className="text-muted-foreground">No Correlation (-0.3 to +0.3):</span> Little to no relationship
        </li>
        <li>
          <span className="text-muted-foreground">Moderate Negative (-0.3 to -0.7):</span> Assets tend to move oppositely
        </li>
        <li>
          <span className="text-muted-foreground">Strong Negative (below -0.7):</span> Assets move strongly opposite
        </li>
      </ul>
    </div>
  );
}
