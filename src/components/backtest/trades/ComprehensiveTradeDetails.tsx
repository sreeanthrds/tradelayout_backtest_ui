import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, ArrowRightLeft, DollarSign, Clock, ChevronDown, ChevronUp, Info } from "lucide-react";

interface ComprehensiveTradeDetailsProps {
  trade: any;
}

export function ComprehensiveTradeDetails({ trade }: ComprehensiveTradeDetailsProps) {
  const [showAllDetails, setShowAllDetails] = useState(false);

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    if (key.includes('price') || key.includes('pnl') || key.includes('profit')) {
      return `₹${Number(value).toFixed(2)}`;
    }
    
    if (key.includes('time') || key.includes('date')) {
      try {
        return new Date(value).toLocaleDateString('en-IN');
      } catch {
        return String(value);
      }
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
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

  // Get key metrics for summary
  const getKeyMetrics = () => {
    const pnl = trade.pnl || trade.profit || trade.profitLoss || 0;
    const entryPrice = trade.entry_price || trade.entryPrice || trade.entry?.entryPrice;
    const exitPrice = trade.exit_price || trade.exitPrice || trade.exit?.exitPrice;
    const quantity = trade.quantity || trade.entry?.quantity;
    const tradeSide = trade.trade_side || trade.side || trade.entry?.buySell;
    
    return {
      pnl: Number(pnl),
      entryPrice: Number(entryPrice || 0),
      exitPrice: Number(exitPrice || 0),
      quantity: Number(quantity || 0),
      tradeSide,
      instrument: trade.instrument || trade.symbol,
      status: trade.status,
      duration: trade.duration
    };
  };

  const getEntryFields = (trade: any) => {
    const entryFields = [];
    if (trade.entry) {
      Object.entries(trade.entry).forEach(([key, value]) => {
        if (key !== 'fill_time' && key !== 'fill_price' && 
            key !== 'position config' && key !== 'positionConfig' && 
            key !== 'position_config') {
          entryFields.push([key, value]);
        }
      });
    }
    return entryFields;
  };

  const getExitFields = (trade: any) => {
    const exitFields = [];
    if (trade.exit) {
      Object.entries(trade.exit).forEach(([key, value]) => {
        exitFields.push([key, value]);
      });
    }
    return exitFields;
  };

  const getSummaryFields = (trade: any) => {
    const summaryFields = [];
    const summaryKeys = [
      'pnl', 'profit', 'loss', 'profitLoss', 'status', 'duration', 'returns', 
      'commission', 'fee', 'strategy', 'instrument', 'symbol', 'quantity',
      'entry_price', 'exit_price', 'entryPrice', 'exitPrice', 'close_reason',
      'trade_side', 'node_id', 'positionId'
    ];
    
    Object.entries(trade).forEach(([key, value]) => {
      if (summaryKeys.includes(key) && key !== 'entry' && key !== 'exit' && key !== 'tradePairs') {
        summaryFields.push([key, value]);
      }
    });
    return summaryFields;
  };

  const keyMetrics = getKeyMetrics();
  const entryData = getEntryFields(trade);
  const exitData = getExitFields(trade);
  const summaryData = getSummaryFields(trade);

  const CompactField = ({ label, value, className = "" }: { label: string; value: any; className?: string }) => (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className={`font-medium text-xs truncate ml-2 ${className}`}>{value}</span>
    </div>
  );

  const DetailSection = ({ data, title }: { data: [string, any][]; title: string }) => (
    <div className="space-y-2">
      <h6 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">{title}</h6>
      <div className="grid grid-cols-1 gap-1">
        {data.map(([key, value]) => (
          <CompactField 
            key={key}
            label={formatLabel(key)}
            value={formatValue(key, value)}
            className={key.includes('pnl') || key.includes('profit') ? 
              (Number(value) >= 0 ? 'text-emerald-600' : 'text-red-600') : ''}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Compact Summary Header */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {keyMetrics.pnl >= 0 ? 
                <TrendingUp className="h-5 w-5 text-emerald-600" /> : 
                <TrendingDown className="h-5 w-5 text-red-600" />
              }
              <div>
                <h4 className="font-semibold">Trade Analysis</h4>
                <p className="text-xs text-muted-foreground">
                  {trade.id || trade.positionId || 'Unknown ID'}
                </p>
              </div>
            </div>
            <Badge variant={keyMetrics.pnl >= 0 ? "default" : "destructive"} className="text-sm px-3 py-1">
              <DollarSign className="h-3 w-3 mr-1" />
              ₹{keyMetrics.pnl.toFixed(2)}
            </Badge>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Entry</div>
              <div className="font-semibold text-sm">₹{keyMetrics.entryPrice.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Exit</div>
              <div className="font-semibold text-sm">₹{keyMetrics.exitPrice.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Quantity</div>
              <div className="font-semibold text-sm">{keyMetrics.quantity}</div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Side</div>
              <div className="font-semibold text-sm">{keyMetrics.tradeSide || 'N/A'}</div>
            </div>
          </div>

          {/* Compact Info Row */}
          <div className="flex flex-wrap gap-4 text-xs">
            <span><strong>Instrument:</strong> {keyMetrics.instrument || 'N/A'}</span>
            <span><strong>Status:</strong> {keyMetrics.status || 'N/A'}</span>
            {keyMetrics.duration && <span><strong>Duration:</strong> {keyMetrics.duration}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Expandable Details */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Detailed Information
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAllDetails(!showAllDetails)}
              className="h-8 px-2"
            >
              {showAllDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showAllDetails ? 'Less' : 'More'}
            </Button>
          </div>
        </CardHeader>
        
        {showAllDetails && (
          <CardContent className="pt-0">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
                <TabsTrigger value="entry" className="text-xs">Entry</TabsTrigger>
                <TabsTrigger value="exit" className="text-xs">Exit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-4">
                <DetailSection data={summaryData} title="Performance Metrics" />
              </TabsContent>
              
              <TabsContent value="entry" className="mt-4">
                <DetailSection data={entryData} title="Entry Details" />
              </TabsContent>
              
              <TabsContent value="exit" className="mt-4">
                <DetailSection data={exitData} title="Exit Details" />
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>

      {/* Compact Trade Pairs */}
      {trade.tradePairs && trade.tradePairs.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Trade Pairs ({trade.tradePairs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {trade.tradePairs.map((pair: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-md text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs px-2 py-0">#{index + 1}</Badge>
                    <span>{pair.entry?.type} {pair.entry?.strike}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{pair.entry?.quantity}</span>
                    {pair.exit?.profitLoss !== undefined && (
                      <Badge variant={pair.exit.profitLoss >= 0 ? "default" : "destructive"} className="text-xs">
                        ₹{pair.exit.profitLoss.toFixed(2)}
                      </Badge>
                    )}
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