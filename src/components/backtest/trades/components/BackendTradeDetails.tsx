import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BackendTrade } from "@/models/TradeTypes";
import { formatDateTime } from "@/utils/formatters";
import { TrendingUp, TrendingDown, Target, Settings, Info } from "lucide-react";

interface BackendTradeDetailsProps {
  trades: BackendTrade[];
}

export function BackendTradeDetails({ trades }: BackendTradeDetailsProps) {
  if (!trades || trades.length === 0) {
    return <div className="text-center text-muted-foreground p-4">No detailed trade data available.</div>;
  }

  return (
    <div className="space-y-6">
      {trades.map((trade, tradeIndex) => {
        // Check if this trade has a transactions array with multiple entries
        const hasTransactions = trade.transactions && Array.isArray(trade.transactions) && trade.transactions.length > 0;
        
        return (
          <Card key={tradeIndex} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Trade {tradeIndex + 1} - {trade.instrument}
                  {hasTransactions && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {trade.transactions.length} Transactions
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={trade.status === 'closed' ? 'secondary' : 'outline'}>
                    {trade.status.toUpperCase()}
                  </Badge>
                  <Badge variant={trade.pnl >= 0 ? 'default' : 'destructive'}>
                    {trade.pnl >= 0 ? '₹' : '-₹'}{Math.abs(trade.pnl).toFixed(2)}
                  </Badge>
                </div>
              </div>
              {hasTransactions && (
                <p className="text-sm text-muted-foreground mt-2">
                  This position contains {trade.transactions.length} separate transactions (re-entries)
                </p>
              )}
            </CardHeader>
          
          <CardContent>
            {hasTransactions ? (
              // Display all transactions separately
              <div className="space-y-6">
                {trade.transactions.map((transaction, txIndex) => (
                  <div key={txIndex} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-sm">
                        Transaction {txIndex + 1} 
                        {transaction.reEntryNum !== undefined && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Re-entry #{transaction.reEntryNum}
                          </Badge>
                        )}
                      </h5>
                      <Badge variant={transaction.pnl >= 0 ? 'default' : 'destructive'} className="text-xs">
                        {transaction.pnl >= 0 ? '₹' : '-₹'}{Math.abs(transaction.pnl).toFixed(2)}
                      </Badge>
                    </div>
                    
                    {/* 3 Column Layout for each transaction */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Entry Column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <h4 className="font-medium text-emerald-600">Entry Details</h4>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-muted-foreground block">Node ID:</span>
                            <p className="font-medium">{transaction.entry.node_id}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Side:</span>
                            <p className="font-medium capitalize">{transaction.entry.side}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Quantity:</span>
                            <p className="font-medium">{transaction.entry.quantity}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Entry Price:</span>
                            <p className="font-medium">₹{transaction.entry.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Fill Price:</span>
                            <p className="font-medium">₹{transaction.entry.fill_price.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Entry Time:</span>
                            <p className="font-medium">
                              {(() => {
                                const formatted = formatDateTime(transaction.entry.entry_time);
                                return `${formatted.date} ${formatted.time}`;
                              })()}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Order Type:</span>
                            <p className="font-medium">{transaction.entry.order_type}</p>
                          </div>
                        </div>
                      </div>

                      {/* Exit Column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <h4 className="font-medium text-red-600">Exit Details</h4>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-muted-foreground block">Node ID:</span>
                            <p className="font-medium">{transaction.exit.node_id}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Exit Reason:</span>
                            <p className="font-medium capitalize">{transaction.exit.reason.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Exit Price:</span>
                            <p className="font-medium">₹{transaction.exit.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Fill Price:</span>
                            <p className="font-medium">₹{transaction.exit.fill_price.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Exit Time:</span>
                            <p className="font-medium">
                              {(() => {
                                const formatted = formatDateTime(transaction.exit.exit_time);
                                return `${formatted.date} ${formatted.time}`;
                              })()}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Duration:</span>
                            <p className="font-medium">
                              {Math.round((new Date(transaction.exit_time).getTime() - new Date(transaction.entry_time).getTime()) / (1000 * 60))} min
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Summary Column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-4 w-4 text-purple-600" />
                          <h4 className="font-medium text-purple-600">Transaction Summary</h4>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-muted-foreground block">Status:</span>
                            <Badge variant={transaction.status === 'closed' ? 'secondary' : 'outline'} className="text-xs">
                              {transaction.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">P&L:</span>
                            <p className={`font-medium text-lg ${transaction.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {transaction.pnl >= 0 ? '₹' : '-₹'}{Math.abs(transaction.pnl).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Re-entry #:</span>
                            <p className="font-medium">{transaction.reEntryNum}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Overall Trade Summary */}
                <div className="bg-muted/30 rounded-lg p-4 mt-4">
                  <h5 className="font-medium mb-3">Overall Position Summary</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Total Transactions:</span>
                      <p className="font-medium">{trade.transactions.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Total P&L:</span>
                      <p className={`font-medium ${trade.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trade.pnl >= 0 ? '₹' : '-₹'}{Math.abs(trade.pnl).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Instrument:</span>
                      <p className="font-medium">{trade.instrument}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Strategy:</span>
                      <p className="font-medium">{trade.strategy}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Fallback to old single-transaction display
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Entry Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <h4 className="font-medium text-emerald-600">Entry Details</h4>
                  </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Node ID:</span>
                    <p className="font-medium">{trade.entry.node_id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Side:</span>
                    <p className="font-medium capitalize">{trade.entry.side}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Quantity:</span>
                    <p className="font-medium">{trade.entry.quantity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Entry Price:</span>
                    <p className="font-medium">₹{trade.entry.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Fill Price:</span>
                    <p className="font-medium">₹{trade.entry.fill_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Entry Time:</span>
                    <p className="font-medium">
                      {(() => {
                        const formatted = formatDateTime(trade.entry.entry_time);
                        return `${formatted.date} ${formatted.time}`;
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Order Type:</span>
                    <p className="font-medium">{trade.entry.order_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Product Type:</span>
                    <p className="font-medium">{trade.entry.product_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Strategy:</span>
                    <p className="font-medium">{trade.entry.strategy}</p>
                  </div>
                  
                  {/* Position Config Dialog */}
                  <div>
                    <span className="text-muted-foreground block mb-2">Position Config:</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Settings className="h-3 w-3" />
                          View Config
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Position Configuration</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-muted-foreground block">Position ID:</span>
                            <p className="font-medium">{trade.entry.position_config.id}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">VPI:</span>
                            <p className="font-medium">{trade.entry.position_config.vpi}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">VPT:</span>
                            <p className="font-medium">{trade.entry.position_config.vpt || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Priority:</span>
                            <p className="font-medium">{trade.entry.position_config.priority}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Quantity:</span>
                            <p className="font-medium">{trade.entry.position_config.quantity}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Order Type:</span>
                            <p className="font-medium">{trade.entry.position_config.orderType}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Multiplier:</span>
                            <p className="font-medium">{trade.entry.position_config.multiplier}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Product Type:</span>
                            <p className="font-medium">{trade.entry.position_config.productType}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Position Type:</span>
                            <p className="font-medium capitalize">{trade.entry.position_config.positionType}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Last Updated:</span>
                            <p className="font-medium">{new Date(trade.entry.position_config._lastUpdated).toLocaleString()}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Exit Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium text-red-600">Exit Details</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Node ID:</span>
                    <p className="font-medium">{trade.exit.node_id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Exit Reason:</span>
                    <p className="font-medium capitalize">{trade.exit.reason.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Exit Price:</span>
                    <p className="font-medium">₹{trade.exit.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Fill Price:</span>
                    <p className="font-medium">₹{trade.exit.fill_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Exit Time:</span>
                    <p className="font-medium">
                      {(() => {
                        const formatted = formatDateTime(trade.exit.exit_time);
                        return `${formatted.date} ${formatted.time}`;
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Fill Time:</span>
                    <p className="font-medium">
                      {(() => {
                        const formatted = formatDateTime(trade.exit.fill_time);
                        return `${formatted.date} ${formatted.time}`;
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Order Type:</span>
                    <p className="font-medium">{trade.exit.order_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Order ID:</span>
                    <p className="font-medium text-xs break-all">{trade.exit.order_id}</p>
                  </div>
                </div>
              </div>

              {/* Summary Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-purple-600">Trade Summary</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Instrument:</span>
                    <p className="font-medium">{trade.instrument}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Strategy:</span>
                    <p className="font-medium">{trade.strategy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Trade Side:</span>
                    <p className="font-medium capitalize">{trade.trade_side}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Status:</span>
                    <Badge variant={trade.status === 'closed' ? 'secondary' : 'outline'} className="text-xs">
                      {trade.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Close Reason:</span>
                    <p className="font-medium capitalize">{trade.close_reason?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Quantity:</span>
                    <p className="font-medium">{trade.quantity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Entry Price:</span>
                    <p className="font-medium">₹{trade.entry_price?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Exit Price:</span>
                    <p className="font-medium">₹{trade.exit_price?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Duration:</span>
                    <p className="font-medium">
                      {Math.round((new Date(trade.exit_time).getTime() - new Date(trade.entry_time).getTime()) / (1000 * 60))} min
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">P&L:</span>
                    <p className={`font-medium text-lg ${trade.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {trade.pnl >= 0 ? '₹' : '-₹'}{Math.abs(trade.pnl).toFixed(2)}
                    </p>
                  </div>
                </div>
                </div>
               
              </div>
            )}
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}