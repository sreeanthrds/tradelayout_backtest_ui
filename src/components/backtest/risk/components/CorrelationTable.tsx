
import React from "react";
import { CorrelationItem } from "../mockCorrelationData";
import { getColorForCorrelation, formatCorrelation } from "../utils/correlationUtils";

interface CorrelationTableProps {
  data: CorrelationItem[];
}

export function CorrelationTable({ data }: CorrelationTableProps) {
  // Extract all available column names (excluding 'name')
  const columns = Object.keys(data[0]).filter(key => key !== 'name');
  
  return (
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
          {data.map((item) => (
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
  );
}
