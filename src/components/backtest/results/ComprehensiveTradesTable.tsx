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
import { ChevronDown, ChevronRight, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function ComprehensiveTradesTable() {
  const { backtestData } = useBacktestData();
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());

  // Get trades grouped by date
  const tradesByDate = backtestData.tradesByDate || {};
  const sortedDates = Object.keys(tradesByDate).sort((a, b) => 
    new Date(a.split('-').reverse().join('-')).getTime() - 
    new Date(b.split('-').reverse().join('-')).getTime()
  );

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
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

  const formatDate = (dateStr: string) => {
    // Convert DD-MM-YYYY to readable format
    const [day, month, year] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDayPnL = (tradesForDate: any[]) => {
    return tradesForDate.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  };

  if (Object.keys(tradesByDate).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Trade History by Execution Date
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
          <Calendar className="h-5 w-5" />
          Trade History by Execution Date
        </CardTitle>
        <CardDescription>
          {sortedDates.length} trading days • {backtestData.allTrades.length} total trades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDates.map((date) => {
            const tradesForDate = tradesByDate[date];
            const dayPnL = getDayPnL(tradesForDate);
            const isExpanded = expandedDates.has(date);
            
            return (
              <Collapsible key={date} open={isExpanded} onOpenChange={() => toggleDate(date)}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-4 h-auto border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <div className="text-left">
                        <div className="font-medium">{formatDate(date)}</div>
                        <div className="text-sm text-muted-foreground">
                          {tradesForDate.length} trade{tradesForDate.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`font-mono font-semibold ${dayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(dayPnL)}
                      </div>
                      {dayPnL >= 0 ? (
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
                          <TableHead>Position</TableHead>
                          <TableHead>Instrument</TableHead>
                          <TableHead>Side</TableHead>
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
                        {tradesForDate.map((trade, index) => {
                          const tradeId = `${date}-${index}`;
                          const isTradeExpanded = expandedTrades.has(tradeId);
                          const entryDateTime = formatDateTime(trade.entry_time);
                          const exitDateTime = trade.exit_time ? formatDateTime(trade.exit_time) : null;
                          
                          return (
                            <React.Fragment key={tradeId}>
                              <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleTrade(tradeId)}>
                                <TableCell>
                                  {isTradeExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {trade.positionId?.slice(-8) || `POS-${index + 1}`}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {trade.instrument || 'RELIANCE'}
                                </TableCell>
                                <TableCell>
                                  {getPositionTypeBadge(trade)}
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>{entryDateTime.time}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {exitDateTime ? (
                                    <div className="text-sm">
                                      <div>{exitDateTime.time}</div>
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
                                <TableRow>
                                  <TableCell colSpan={11} className="bg-muted/30 p-4">
                                    <div className="flex justify-between items-center mb-4">
                                      <h4 className="font-medium">Comprehensive Trade Details</h4>
                                      <Badge variant="outline" className="text-xs">
                                        {(trade.tradePairs || []).length} Trade Pairs
                                      </Badge>
                                    </div>
                                    
                                    {/* Basic Trade Info */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 pb-4 border-b">
                                      <div>
                                        <span className="font-medium text-muted-foreground">Position ID:</span>
                                        <div className="font-mono text-xs">{trade.positionId || trade.position_id || 'N/A'}</div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">Trade Index:</span>
                                        <div>{trade.index || trade.trade_index || 'N/A'}</div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">VIX Level:</span>
                                        <div>{trade.vix || trade.vix_level || 'N/A'}</div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">Trade Duration:</span>
                                        <div>{trade.tradeDuration || trade.trade_duration || 'N/A'}</div>
                                      </div>
                                    </div>

                                    {/* Trade Pairs Details */}
                                    {trade.tradePairs && trade.tradePairs.length > 0 && (
                                      <div>
                                        <h5 className="font-medium mb-3">Trade Pairs Details</h5>
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                          {trade.tradePairs.map((pair: any, pairIndex: number) => (
                                            <div key={`pair-${pairIndex}-${pair.entry?.nodeId || pairIndex}`} className="border rounded-lg p-3 bg-background">
                                              <div className="flex justify-between items-center mb-2">
                                                <Badge variant="secondary" className="text-xs">
                                                  Pair {pairIndex + 1}
                                                </Badge>
                                                {pair.exit?.profitLoss !== undefined && (
                                                  <span className={`font-medium text-sm ${pair.exit.profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {formatCurrency(pair.exit.profitLoss)}
                                                  </span>
                                                )}
                                              </div>
                                              
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                {/* Entry Details */}
                                                <div className="space-y-1">
                                                  <div className="font-medium text-muted-foreground">Entry:</div>
                                                  <div className="space-y-1 pl-2">
                                                    <div><span className="text-muted-foreground">Type:</span> {pair.entry?.type} {pair.entry?.strike}</div>
                                                    <div><span className="text-muted-foreground">Action:</span> {pair.entry?.buySell} {pair.entry?.quantity}</div>
                                                    <div><span className="text-muted-foreground">Price:</span> ₹{pair.entry?.entryPrice || 'N/A'}</div>
                                                    <div><span className="text-muted-foreground">Order:</span> {pair.entry?.orderType}</div>
                                                    <div><span className="text-muted-foreground">Time:</span> {pair.entry?.timestamp ? new Date(pair.entry.timestamp).toLocaleTimeString() : 'N/A'}</div>
                                                    <div><span className="text-muted-foreground">Node ID:</span> <span className="font-mono">{pair.entry?.nodeId}</span></div>
                                                  </div>
                                                </div>
                                                
                                                {/* Exit Details */}
                                                <div className="space-y-1">
                                                  <div className="font-medium text-muted-foreground">Exit:</div>
                                                  {pair.exit ? (
                                                    <div className="space-y-1 pl-2">
                                                      <div><span className="text-muted-foreground">Action:</span> {pair.exit.buySell} {pair.exit.quantity}</div>
                                                      <div><span className="text-muted-foreground">Price:</span> ₹{pair.exit.exitPrice || 'N/A'}</div>
                                                      <div><span className="text-muted-foreground">Reason:</span> {pair.exit.exitReason || 'N/A'}</div>
                                                      <div><span className="text-muted-foreground">Order:</span> {pair.exit.orderType}</div>
                                                      <div><span className="text-muted-foreground">Time:</span> {pair.exit.timestamp ? new Date(pair.exit.timestamp).toLocaleTimeString() : 'N/A'}</div>
                                                      <div><span className="text-muted-foreground">Node ID:</span> <span className="font-mono">{pair.exit.nodeId}</span></div>
                                                    </div>
                                                  ) : (
                                                    <div className="pl-2 text-muted-foreground">Not exited</div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                               )}
                             </React.Fragment>
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