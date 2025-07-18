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

  // Get positions data from API response
  const positions = backtestData?.apiData?.gps_aggregated?.all_positions || {};
  const positionsArray = Object.entries(positions).map(([key, position]) => ({
    id: key,
    ...(position as any)
  }));

  const toggleRow = (positionId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [positionId]: !prev[positionId]
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

  if (positionsArray.length === 0) {
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
              {positionsArray.map((position: any) => {
                const entryDateTime = formatDateTime(position.entry_time);
                const exitDateTime = formatDateTime(position.exit_time);
                const isExpanded = expandedRows[position.id];
                
                return (
                  <>
                    {/* Main row */}
                    <TableRow key={position.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(position.id)}
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
                        {position.node_id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {position.instrument}
                      </TableCell>
                      <TableCell>
                        {getPositionTypeBadge(position)}
                      </TableCell>
                      <TableCell>{position.quantity}</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(position.entry_price)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {position.exit_price ? formatCurrency(position.exit_price) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{entryDateTime.date}</div>
                          <div className="text-muted-foreground">{entryDateTime.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {position.exit_time ? (
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
                          Number(position.pnl) > 0 ? 'text-emerald-600' : 
                          Number(position.pnl) < 0 ? 'text-red-600' : 
                          'text-muted-foreground'
                        }`}>
                          {formatCurrency(Number(position.pnl) || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(position)}
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
                                  <div><strong>Node ID:</strong> {position.entry?.node_id || 'N/A'}</div>
                                  <div><strong>Order ID:</strong> {position.entry?.order_id || 'N/A'}</div>
                                  <div><strong>Order Type:</strong> {position.entry?.order_type || 'N/A'}</div>
                                  <div><strong>Product Type:</strong> {position.entry?.product_type || 'N/A'}</div>
                                  <div><strong>Fill Time:</strong> {position.entry?.fill_time ? formatDateTime(position.entry.fill_time).time : 'N/A'}</div>
                                  <div><strong>Fill Price:</strong> {position.entry?.fill_price ? formatCurrency(position.entry.fill_price) : 'N/A'}</div>
                                </div>
                              </div>
                              
                              {/* Exit Details */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-xs text-red-600">EXIT TRANSACTION</h5>
                                <div className="space-y-1 text-xs">
                                  {position.exit ? (
                                    <>
                                      <div><strong>Node ID:</strong> {position.exit.node_id || 'N/A'}</div>
                                      <div><strong>Order ID:</strong> {position.exit.order_id || 'N/A'}</div>
                                      <div><strong>Order Type:</strong> {position.exit.order_type || 'N/A'}</div>
                                      <div><strong>Exit Reason:</strong> {position.exit.reason || position.close_reason || 'N/A'}</div>
                                      <div><strong>Fill Time:</strong> {position.exit.fill_time ? formatDateTime(position.exit.fill_time).time : 'N/A'}</div>
                                      <div><strong>Fill Price:</strong> {position.exit.fill_price ? formatCurrency(position.exit.fill_price) : 'N/A'}</div>
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
                                  <div><strong>Strategy:</strong> {position.strategy || 'N/A'}</div>
                                  <div><strong>Date:</strong> {position.date || 'N/A'}</div>
                                  <div><strong>Position ID:</strong> {position.entry?.position_config?.id || 'N/A'}</div>
                                  <div><strong>VPI:</strong> {position.entry?.position_config?.vpi || 'N/A'}</div>
                                  <div><strong>Priority:</strong> {position.entry?.position_config?.priority || 'N/A'}</div>
                                  <div><strong>Multiplier:</strong> {position.entry?.position_config?.multiplier || 'N/A'}</div>
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
          Total Transactions: {positionsArray.length} | 
          Closed: {positionsArray.filter(p => p.status === 'closed').length} | 
          Open: {positionsArray.filter(p => p.status === 'open').length}
        </div>
      </CardContent>
    </Card>
  );
}