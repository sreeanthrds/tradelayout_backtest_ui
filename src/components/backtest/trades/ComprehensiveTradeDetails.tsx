import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComprehensiveTradeDetailsProps {
  trade: any;
}

export function ComprehensiveTradeDetails({ trade }: ComprehensiveTradeDetailsProps) {

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (typeof value === 'object') {
      return (
        <div className="space-y-1">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="text-xs">
              <span className="text-muted-foreground">{formatLabel(subKey)}:</span>{' '}
              <span className="font-medium">{String(subValue || 'N/A')}</span>
            </div>
          ))}
        </div>
      );
    }
    
    if (key.includes('price') || key.includes('pnl') || key.includes('profit')) {
      return `₹${Number(value).toFixed(2)}`;
    }
    
    if (key.includes('time') || key.includes('date')) {
      try {
        return new Date(value).toLocaleString('en-IN');
      } catch {
        return String(value);
      }
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Special handling for trade side
    if (key === 'side' || key === 'trade_side') {
      if (value === 'buy' || value === 'Long') {
        return 'Long';
      } else if (value === 'sell' || value === 'Short') {
        return 'Short';
      }
    }
    
    return String(value);
  };

  const formatLabel = (key: string) => {
    const labelMap: { [key: string]: string } = {
      'positionId': 'Position ID',
      'entry_time': 'Entry Time',
      'exit_time': 'Exit Time',
      'entry_price': 'Entry Price',
      'exit_price': 'Exit Price',
      'pnl': 'P&L',
      'trade_side': 'Trade Side',
      'instrument': 'Instrument',
      'quantity': 'Quantity',
      'strategy': 'Strategy',
      'status': 'Status',
      'commission': 'Commission',
      'fees': 'Fees'
    };
    
    return labelMap[key] || key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Entry Details: Only fields from trade.entry object
  const getEntryFields = (trade: any) => {
    const entryFields = [];
    
    if (trade.entry) {
      Object.entries(trade.entry).forEach(([key, value]) => {
        // Skip redundant fill_time, fill_price, and position config variations
        if (key !== 'fill_time' && key !== 'fill_price' && 
            key !== 'position config' && key !== 'positionConfig' && 
            key !== 'position_config') {
          entryFields.push([key, value]);
        }
      });
    }
    
    return entryFields;
  };

  // Exit Details: Only fields from trade.exit object
  const getExitFields = (trade: any) => {
    const exitFields = [];
    
    if (trade.exit) {
      Object.entries(trade.exit).forEach(([key, value]) => {
        exitFields.push([key, value]);
      });
    }
    
    return exitFields;
  };

  // Summary: Key trade information and performance metrics
  const getSummaryFields = (trade: any) => {
    const summaryFields = [];
    const summaryKeys = [
      'pnl', 'profit', 'loss', 'profitLoss', 'status', 'duration', 'returns', 
      'commission', 'fee', 'strategy', 'instrument', 'symbol', 'quantity',
      'entry_price', 'exit_price', 'entryPrice', 'exitPrice', 'close_reason',
      'trade_side', 'node_id', 'positionId'
    ];
    
    Object.entries(trade).forEach(([key, value]) => {
      // Include summary fields, exclude entry/exit objects and tradePairs
      if (summaryKeys.includes(key) && key !== 'entry' && key !== 'exit' && key !== 'tradePairs') {
        summaryFields.push([key, value]);
      }
    });
    
    return summaryFields;
  };

  const entryData = getEntryFields(trade);
  const exitData = getExitFields(trade);
  const summaryData = getSummaryFields(trade);

  const renderDataSection = (data: [string, any][], title: string) => (
    <div className="space-y-2">
      <h5 className="font-medium text-sm text-muted-foreground border-b pb-1">{title}</h5>
      <div className="space-y-1.5">
        {data.length > 0 ? data.map(([key, value]) => (
          <div key={key} className="flex justify-between items-start text-xs">
            <span className="text-muted-foreground min-w-0 flex-1 pr-2">
              {formatLabel(key)}:
            </span>
            <span className={`font-medium text-right min-w-0 flex-1 ${
              key.includes('pnl') || key.includes('profit') ? 
              (Number(value) >= 0 ? 'text-green-600' : 'text-red-600') : ''
            }`}>
              {formatValue(key, value)}
            </span>
          </div>
        )) : (
          <div className="text-xs text-muted-foreground italic">No data available</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Comprehensive Trade Details</h4>
        <Badge variant="outline" className="text-xs">
          Trade ID: {trade.id || trade.positionId || 'N/A'}
        </Badge>
      </div>

      {/* 3 Column Layout - Equal Height Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Entry Column */}
        <Card className="min-h-[300px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Entry Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {renderDataSection(entryData, "Entry Information")}
          </CardContent>
        </Card>

        {/* Exit Column */}
        <Card className="min-h-[300px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Exit Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {renderDataSection(exitData, "Exit Information")}
          </CardContent>
        </Card>

        {/* Summary Column */}
        <Card className="min-h-[300px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {renderDataSection(summaryData, "Performance Summary")}
          </CardContent>
        </Card>
      </div>

      {/* Trade Pairs if available */}
      {trade.tradePairs && trade.tradePairs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Trade Pairs ({trade.tradePairs.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {trade.tradePairs.map((pair: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Pair {index + 1}
                    </Badge>
                    {pair.exit?.profitLoss !== undefined && (
                      <span className={`font-medium text-xs ${
                        pair.exit.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{pair.exit.profitLoss.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="font-medium mb-1">Entry:</div>
                      <div className="space-y-0.5 text-muted-foreground">
                        <div>{pair.entry?.type} {pair.entry?.strike}</div>
                        <div>{pair.entry?.buySell} {pair.entry?.quantity}</div>
                        <div>₹{pair.entry?.entryPrice || 'N/A'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Exit:</div>
                      {pair.exit ? (
                        <div className="space-y-0.5 text-muted-foreground">
                          <div>{pair.exit.buySell} {pair.exit.quantity}</div>
                          <div>₹{pair.exit.exitPrice || 'N/A'}</div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground italic">Open</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}