
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CorrelationItem } from "./mockCorrelationData";

export function CorrelationMatrix({ data }: { data: CorrelationItem[] }) {
  // Extract all available column names (excluding 'name')
  const columns = Object.keys(data[0]).filter(key => key !== 'name');
  
  // Function to get color intensity based on correlation value
  const getColorForCorrelation = (value: number) => {
    // For positive correlations: green shades
    if (value > 0) {
      const intensity = Math.min(Math.abs(value) * 100, 100);
      return `rgba(0, 128, 0, ${intensity / 100})`;
    }
    // For negative correlations: red shades
    else {
      const intensity = Math.min(Math.abs(value) * 100, 100);
      return `rgba(220, 20, 60, ${intensity / 100})`;
    }
  };
  
  // Function to format correlation values
  const formatCorrelation = (value: number) => {
    if (value === 1) return "1.00";
    const formatted = value.toFixed(2);
    return value > 0 ? `+${formatted}` : formatted;
  };

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left whitespace-nowrap p-2 font-medium border-b"></th>
                  {columns.map(col => (
                    <th key={col} className="text-center whitespace-nowrap p-2 font-medium border-b">
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, rowIndex) => (
                  <tr key={item.name}>
                    <td className="text-left whitespace-nowrap p-2 font-medium border-b">
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </td>
                    {columns.map(col => {
                      const value = item[col as keyof typeof item] as number;
                      return (
                        <td 
                          key={`${item.name}-${col}`} 
                          className="text-center whitespace-nowrap p-2 border-b"
                          style={{
                            backgroundColor: getColorForCorrelation(value),
                            color: Math.abs(value) > 0.6 ? 'white' : 'inherit'
                          }}
                        >
                          {formatCorrelation(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
          <h4 className="text-sm font-medium mb-2">Key Insights</h4>
          <ul className="text-sm space-y-1">
            <li>
              <span className="text-muted-foreground">Strategy and VIX:</span> {data[0].vix < -0.5 ? "Negative correlation suggests the strategy performs well in low-volatility environments" : "Limited correlation with market volatility"}
            </li>
            <li>
              <span className="text-muted-foreground">Strategy and Indices:</span> {data[0].sp500 > 0.7 || data[0].nasdaq > 0.7 ? "High correlation with market indices indicates limited diversification benefit" : "Moderate correlation provides some diversification"}
            </li>
            <li>
              <span className="text-muted-foreground">Bonds Relationship:</span> {Math.abs(data[0].bonds) < 0.3 ? "Low correlation with bonds offers diversification benefits" : "Notable correlation with bonds may impact portfolio construction"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
