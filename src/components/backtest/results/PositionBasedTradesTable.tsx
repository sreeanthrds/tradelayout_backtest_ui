import React, { useState } from "react";
import { useBacktestData } from "@/hooks/useBacktestData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Target, TrendingUp, TrendingDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ComprehensiveTradeDetails } from "@/components/backtest/trades/ComprehensiveTradeDetails";

export function PositionBasedTradesTable() {
  const { backtestData } = useBacktestData();
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());
  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());

  // Get trades grouped by position
  const tradesByPosition = backtestData.tradesByPosition || {};
  const sortedPositions = Object.keys(tradesByPosition).sort();

  const togglePosition = (positionId: string) => {
    const newExpanded = new Set(expandedPositions);
    if (newExpanded.has(positionId)) {
      newExpanded.delete(positionId);
    } else {
      newExpanded.add(positionId);
    }
    setExpandedPositions(newExpanded);
  };

  const toggleTrade = (tradeId: string) => {
    const newExpanded = new Set(expandedTrades);
    if (newExpanded.has(tradeId)) {
      newExpanded.delete(tradeId);
    } else {
      newExpanded.add(tradeId);
    }
    setExpandedTrades(newExpanded);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    };
  };

  const getPositionTypeBadge = (trade: any) => {
    const side = trade.entry?.side || trade.trade_side;
    if (side === 'buy' || side === 'Long') {
      return <Badge variant="default" className="bg-green-100 text-green-800">Long</Badge>;
    } else if (side === 'sell' || side === 'Short') {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Short</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getStatusBadge = (trade: any) => {
    const pnl = trade.pnl || 0;
    if (trade.status === 'open') {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Open</Badge>;
    } else if (pnl > 0) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Profit</Badge>;
    } else if (pnl < 0) {
      return <Badge variant="destructive">Loss</Badge>;
    } else {
      return <Badge variant="secondary">Breakeven</Badge>;
    }
  };

  const getPositionPnL = (tradesForPosition: any[]) => {
    return tradesForPosition.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  };

  const getPositionSummary = (tradesForPosition: any[]) => {
    const totalTrades = tradesForPosition.length;
    const profitableTrades = tradesForPosition.filter(t => (t.pnl || 0) > 0).length;
    const totalPnL = getPositionPnL(tradesForPosition);
    const instrument = tradesForPosition[0]?.instrument || 'RELIANCE';
    
    return {
      totalTrades,
      profitableTrades,
      totalPnL,
      instrument,
      winRate: totalTrades > 0 ? Math.round((profitableTrades / totalTrades) * 100) : 0
    };
  };

  if (Object.keys(tradesByPosition).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Trades by Position
          </CardTitle>
          <CardDescription>No trading data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Trades by Position
        </CardTitle>
        <CardDescription>
          {sortedPositions.length} positions • {backtestData.allTrades.length} total trades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPositions.map((positionId) => {
            const tradesForPosition = tradesByPosition[positionId];
            const summary = getPositionSummary(tradesForPosition);
            const isExpanded = expandedPositions.has(positionId);
            
            return (
              <Collapsible key={positionId} open={isExpanded} onOpenChange={() => togglePosition(positionId)}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-4 h-auto border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <div className="text-left">
                        <div className="font-medium flex items-center gap-2">
                          {tradesForPosition[0]?.vpi || positionId}
                          <Badge variant="outline" className="text-xs">
                            {summary.instrument}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {summary.totalTrades} trades • {summary.winRate}% win rate
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`font-mono font-semibold ${summary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(summary.totalPnL)}
                      </div>
                      {summary.totalPnL >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead>Re-entry #</TableHead>
                          <TableHead>Entry Time</TableHead>
                          <TableHead>Exit Time</TableHead>
                          <TableHead>Entry Price</TableHead>
                          <TableHead>Exit Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>P&L</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tradesForPosition.map((trade, index) => {
                          const tradeId = `${positionId}-${index}`;
                          const isTradeExpanded = expandedTrades.has(tradeId);
                          const entryDateTime = formatDateTime(trade.entry_time);
                          const exitDateTime = trade.exit_time ? formatDateTime(trade.exit_time) : null;
                          
                          return (
                            <>
                              <TableRow key={tradeId} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleTrade(tradeId)}>
                                <TableCell>
                                  {isTradeExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  <Badge variant="secondary">#{trade.reEntryNum !== undefined ? trade.reEntryNum : index}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="font-medium">{entryDateTime.date}</div>
                                    <div className="text-muted-foreground">{entryDateTime.time}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {exitDateTime ? (
                                    <div className="text-sm">
                                      <div className="font-medium">{exitDateTime.date}</div>
                                      <div className="text-muted-foreground">{exitDateTime.time}</div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="font-mono">
                                  ₹{trade.entry_price?.toFixed(2) || '0.00'}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {trade.exit_price ? `₹${trade.exit_price.toFixed(2)}` : '-'}
                                </TableCell>
                                <TableCell>{trade.quantity || 1}</TableCell>
                                <TableCell className={`font-mono font-semibold ${
                                  (trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {formatCurrency(trade.pnl || 0)}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(trade)}
                                </TableCell>
                              </TableRow>
                              
                              {isTradeExpanded && (
                                <TableRow key={`${tradeId}-details`}>
                                  <TableCell colSpan={9} className="bg-muted/30 p-4">
                                     <ComprehensiveTradeDetails trade={trade} />
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                           );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}