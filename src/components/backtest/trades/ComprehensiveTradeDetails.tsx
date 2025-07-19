import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRightLeft, DollarSign } from "lucide-react";

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
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <h5 className="font-semibold text-sm text-foreground">{title}</h5>
        <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full"></div>
      </div>
      <div className="space-y-2.5">
        {data.length > 0 ? data.map(([key, value]) => (
          <div key={key} className="group flex flex-col gap-1 text-xs p-2 rounded-md hover:bg-muted/50 transition-colors">
            <span className="text-muted-foreground font-medium">
              {formatLabel(key)}
            </span>
            <span className={`font-semibold break-all ${
              key.includes('pnl') || key.includes('profit') ? 
              (Number(value) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400') : 
              'text-foreground'
            }`}>
              {formatValue(key, value)}
            </span>
          </div>
        )) : (
          <div className="text-xs text-muted-foreground italic text-center py-4">No data available</div>
        )}
      </div>
    </div>
  );

  const getTradeIcon = () => {
    const pnl = trade.pnl || trade.profit || trade.profitLoss;
    if (pnl !== undefined) {
      return pnl >= 0 ? 
        <TrendingUp className="h-4 w-4 text-emerald-600" /> : 
        <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />;
  };

  const getPnLBadgeVariant = () => {
    const pnl = trade.pnl || trade.profit || trade.profitLoss;
    if (pnl !== undefined) {
      return pnl >= 0 ? "default" : "destructive";
    }
    return "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-card to-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-3">
          {getTradeIcon()}
          <div>
            <h4 className="font-semibold text-lg text-foreground">Trade Details</h4>
            <p className="text-sm text-muted-foreground">Comprehensive analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1">
            ID: {trade.id || trade.positionId || 'N/A'}
          </Badge>
          {(trade.pnl || trade.profit || trade.profitLoss) !== undefined && (
            <Badge variant={getPnLBadgeVariant()} className="text-xs px-3 py-1 font-semibold">
              <DollarSign className="h-3 w-3 mr-1" />
              ₹{Number(trade.pnl || trade.profit || trade.profitLoss).toFixed(2)}
            </Badge>
          )}
        </div>
      </div>

      {/* Enhanced 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Column */}
        <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-emerald-50/30 dark:from-emerald-950/30 dark:to-emerald-950/10">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="h-4 w-4" />
              Entry Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {renderDataSection(entryData, "Entry Information")}
          </CardContent>
        </Card>

        {/* Exit Column */}
        <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="pb-4 bg-gradient-to-r from-red-50 to-red-50/30 dark:from-red-950/30 dark:to-red-950/10">
            <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-300">
              <TrendingDown className="h-4 w-4" />
              Exit Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {renderDataSection(exitData, "Exit Information")}
          </CardContent>
        </Card>

        {/* Summary Column */}
        <Card className="border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-base flex items-center gap-2 text-primary">
              <DollarSign className="h-4 w-4" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {renderDataSection(summaryData, "Key Metrics")}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Trade Pairs Section */}
      {trade.tradePairs && trade.tradePairs.length > 0 && (
        <Card className="shadow-lg border-border/50">
          <CardHeader className="pb-4 bg-gradient-to-r from-accent/10 to-accent/5">
            <CardTitle className="text-base flex items-center gap-2 text-accent">
              <ArrowRightLeft className="h-4 w-4" />
              Trade Pairs ({trade.tradePairs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
              {trade.tradePairs.map((pair: any, index: number) => (
                <div key={index} className="border border-border/50 rounded-lg p-4 bg-gradient-to-r from-card to-muted/20 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="secondary" className="text-xs px-3 py-1 font-medium">
                      Pair {index + 1}
                    </Badge>
                    {pair.exit?.profitLoss !== undefined && (
                      <Badge variant={pair.exit.profitLoss >= 0 ? "default" : "destructive"} className="text-xs px-3 py-1 font-semibold">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ₹{pair.exit.profitLoss.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Entry
                      </div>
                      <div className="space-y-1 pl-4 border-l-2 border-emerald-200 dark:border-emerald-800">
                        <div className="text-muted-foreground">{pair.entry?.type} {pair.entry?.strike}</div>
                        <div className="text-muted-foreground">{pair.entry?.buySell} {pair.entry?.quantity}</div>
                        <div className="font-medium">₹{pair.entry?.entryPrice || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-red-700 dark:text-red-300 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        Exit
                      </div>
                      {pair.exit ? (
                        <div className="space-y-1 pl-4 border-l-2 border-red-200 dark:border-red-800">
                          <div className="text-muted-foreground">{pair.exit.buySell} {pair.exit.quantity}</div>
                          <div className="font-medium">₹{pair.exit.exitPrice || 'N/A'}</div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground italic pl-4">Position Open</div>
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