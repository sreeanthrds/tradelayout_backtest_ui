import { useState } from "react";
import { useBacktestData } from "@/hooks/useBacktestData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

export function ComprehensiveTradesTable() {
  const { backtestData } = useBacktestData();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Extract trades from the new nested structure
  const getAllTrades = () => {
    const apiData = backtestData.apiData;
    if (!apiData?.gps_aggregated?.positions_by_date) {
      // Fallback to old structure
      const positions = apiData?.gps_aggregated?.all_positions || {};
      return Object.entries(positions).map(([key, position]) => ({
        id: key,
        ...(position as any),
        tradeIndex: 1,
        reentryNumber: 0
      }));
    }
    
    const allTrades: any[] = [];
    const positionsByDate = apiData.gps_aggregated.positions_by_date;
    
    Object.keys(positionsByDate).forEach(date => {
      const positions = positionsByDate[date];
      Object.keys(positions).forEach(positionId => {
        const position = positions[positionId];
        
        // Check if this position has the new trades array structure
        if (position.trades && Array.isArray(position.trades)) {
          position.trades.forEach((trade: any, index: number) => {
            allTrades.push({
              ...trade,
              id: `${positionId}_${index}`,
              positionId,
              date,
              tradeIndex: index + 1,
              reentryNumber: trade.entry?.reentry_number || 0
            });
          });
        } else {
          // Fallback to old structure for backwards compatibility
          allTrades.push({
            ...position,
            id: positionId,
            positionId,
            date,
            tradeIndex: 1,
            reentryNumber: 0
          });
        }
      });
    });
    
    return allTrades.sort((a, b) => {
      const dateA = new Date(a.entry_time || a.entry?.entry_time);
      const dateB = new Date(b.entry_time || b.entry?.entry_time);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const trades = getAllTrades();

  const toggleRow = (tradeId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [tradeId]: !prev[tradeId]
    }));
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
    try {
      const date = new Date(dateTimeStr);
      return {
        date: date.toLocaleDateString('en-IN'),
        time: date.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })
      };
    } catch {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  const getPositionTypeBadge = (position: any) => {
    const side = position.entry?.side || 'buy';
    return (
      <Badge variant={side === 'buy' ? 'default' : 'secondary'}>
        {side.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (position: any) => {
    const status = position.status;
    const pnl = Number(position.pnl) || 0;
    
    if (status === 'open') {
      return <Badge variant="outline">OPEN</Badge>;
    }
    
    if (pnl > 0) {
      return <Badge className="bg-emerald-500 text-white">PROFIT</Badge>;
    } else if (pnl < 0) {
      return <Badge className="bg-red-500 text-white">LOSS</Badge>;
    } else {
      return <Badge variant="outline">BREAKEVEN</Badge>;
    }
  };

  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No trading data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Trade Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed view of all trade transactions with entry/exit data
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Node ID</TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Exit Price</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade: any) => {
                const entryDateTime = formatDateTime(trade.entry_time);
                const exitDateTime = formatDateTime(trade.exit_time);
                const isExpanded = expandedRows[trade.id];
                
                return (
                  <>
                    {/* Main row */}
                    <TableRow key={trade.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(trade.id)}
                          className="h-6 w-6 p-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <div>{trade.node_id}</div>
                        {trade.reentryNumber > 0 && (
                          <div className="text-orange-600 font-semibold">
                            Re-entry #{trade.reentryNumber}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {trade.instrument}
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.trade_side === 'Long' ? 'default' : 'secondary'}>
                          {trade.trade_side || (trade.entry?.side === 'buy' ? 'LONG' : 'SHORT')}
                        </Badge>
                      </TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(trade.entry_price)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {trade.exit_price ? formatCurrency(trade.exit_price) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{entryDateTime.date}</div>
                          <div className="text-muted-foreground">{entryDateTime.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {trade.exit_time ? (
                          <div className="text-xs">
                            <div>{exitDateTime.date}</div>
                            <div className="text-muted-foreground">{exitDateTime.time}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`font-mono font-medium ${
                          Number(trade.pnl) > 0 ? 'text-emerald-600' : 
                          Number(trade.pnl) < 0 ? 'text-red-600' : 
                          'text-muted-foreground'
                        }`}>
                          {formatCurrency(Number(trade.pnl) || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(trade)}
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded details row */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={11}>
                          <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                            <h4 className="font-medium text-sm">Transaction Details</h4>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Entry Details */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-xs text-emerald-600">ENTRY TRANSACTION</h5>
                                <div className="space-y-1 text-xs">
                                  <div><strong>Node ID:</strong> {trade.entry?.node_id || 'N/A'}</div>
                                  <div><strong>Order ID:</strong> {trade.entry?.order_id || 'N/A'}</div>
                                  <div><strong>Order Type:</strong> {trade.entry?.order_type || 'N/A'}</div>
                                  <div><strong>Product Type:</strong> {trade.entry?.product_type || 'N/A'}</div>
                                  <div><strong>Fill Time:</strong> {trade.entry?.fill_time ? formatDateTime(trade.entry.fill_time).time : 'N/A'}</div>
                                  <div><strong>Fill Price:</strong> {trade.entry?.fill_price ? formatCurrency(trade.entry.fill_price) : 'N/A'}</div>
                                  {trade.reentryNumber > 0 && (
                                    <div><strong>Re-entry Number:</strong> {trade.reentryNumber}</div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Exit Details */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-xs text-red-600">EXIT TRANSACTION</h5>
                                <div className="space-y-1 text-xs">
                                  {trade.exit ? (
                                    <>
                                      <div><strong>Node ID:</strong> {trade.exit.node_id || 'N/A'}</div>
                                      <div><strong>Order ID:</strong> {trade.exit.order_id || 'N/A'}</div>
                                      <div><strong>Order Type:</strong> {trade.exit.order_type || 'N/A'}</div>
                                      <div><strong>Exit Reason:</strong> {trade.exit.reason || trade.close_reason || 'N/A'}</div>
                                      <div><strong>Fill Time:</strong> {trade.exit.fill_time ? formatDateTime(trade.exit.fill_time).time : 'N/A'}</div>
                                      <div><strong>Fill Price:</strong> {trade.exit.fill_price ? formatCurrency(trade.exit.fill_price) : 'N/A'}</div>
                                    </>
                                  ) : (
                                    <div className="text-muted-foreground">Position still open</div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Additional Info */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-xs text-blue-600">ADDITIONAL INFO</h5>
                                <div className="space-y-1 text-xs">
                                  <div><strong>Strategy:</strong> {trade.strategy || 'N/A'}</div>
                                  <div><strong>Date:</strong> {trade.date || 'N/A'}</div>
                                  <div><strong>Position ID:</strong> {trade.positionId || trade.entry?.position_config?.id || 'N/A'}</div>
                                  <div><strong>VPI:</strong> {trade.entry?.position_config?.vpi || 'N/A'}</div>
                                  <div><strong>Priority:</strong> {trade.entry?.position_config?.priority || 'N/A'}</div>
                                  <div><strong>Multiplier:</strong> {trade.entry?.position_config?.multiplier || 'N/A'}</div>
                                  <div><strong>Trade Index:</strong> {trade.tradeIndex || 'N/A'}</div>
                                  <div><strong>Trade Side:</strong> {trade.trade_side || 'N/A'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary */}
        <div className="mt-4 text-sm text-muted-foreground">
          Total Transactions: {trades.length} | 
          Closed: {trades.filter(t => t.status === 'closed').length} | 
          Open: {trades.filter(t => t.status === 'open').length}
        </div>
      </CardContent>
    </Card>
  );
}