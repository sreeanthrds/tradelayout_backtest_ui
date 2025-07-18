import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackendTrade } from "@/models/TradeTypes";
import { formatDateTime } from "@/utils/formatters";
import { TrendingUp, TrendingDown, Clock, Target, Settings } from "lucide-react";

interface BackendTradeDetailsProps {
  trades: BackendTrade[];
}

export function BackendTradeDetails({ trades }: BackendTradeDetailsProps) {
  if (!trades || trades.length === 0) {
    return <div className="text-center text-muted-foreground p-4">No detailed trade data available.</div>;
  }

  return (
    <div className="space-y-4">
      {trades.map((trade, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Trade {index + 1} - {trade.instrument}
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
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Entry Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <h4 className="font-medium text-emerald-600">Entry Details</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Node ID:</span>
                  <p className="font-medium">{trade.entry.node_id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Side:</span>
                  <p className="font-medium capitalize">{trade.entry.side}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <p className="font-medium">{trade.entry.quantity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Entry Price:</span>
                  <p className="font-medium">₹{trade.entry.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fill Price:</span>
                  <p className="font-medium">₹{trade.entry.fill_price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Entry Time:</span>
                  <p className="font-medium">
                    {(() => {
                      const formatted = formatDateTime(trade.entry.entry_time);
                      return `${formatted.date} ${formatted.time}`;
                    })()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Order Type:</span>
                  <p className="font-medium">{trade.entry.order_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Product Type:</span>
                  <p className="font-medium">{trade.entry.product_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Order ID:</span>
                  <p className="font-medium text-xs">{trade.entry.order_id}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Exit Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <h4 className="font-medium text-red-600">Exit Details</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Node ID:</span>
                  <p className="font-medium">{trade.exit.node_id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Exit Reason:</span>
                  <p className="font-medium capitalize">{trade.exit.reason.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Exit Price:</span>
                  <p className="font-medium">₹{trade.exit.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fill Price:</span>
                  <p className="font-medium">₹{trade.exit.fill_price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Exit Time:</span>
                  <p className="font-medium">
                    {(() => {
                      const formatted = formatDateTime(trade.exit.exit_time);
                      return `${formatted.date} ${formatted.time}`;
                    })()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Order Type:</span>
                  <p className="font-medium">{trade.exit.order_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Order ID:</span>
                  <p className="font-medium text-xs">{trade.exit.order_id}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Position Configuration */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-blue-600">Position Configuration</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Position ID:</span>
                  <p className="font-medium">{trade.entry.position_config.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">VPI:</span>
                  <p className="font-medium">{trade.entry.position_config.vpi}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority:</span>
                  <p className="font-medium">{trade.entry.position_config.priority}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Multiplier:</span>
                  <p className="font-medium">{trade.entry.position_config.multiplier}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Position Type:</span>
                  <p className="font-medium capitalize">{trade.entry.position_config.positionType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <p className="font-medium">{new Date(trade.entry.position_config._lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Trade Summary */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-purple-600">Trade Summary</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Strategy:</span>
                  <p className="font-medium">{trade.strategy}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trade Side:</span>
                  <p className="font-medium capitalize">{trade.trade_side}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">
                    {Math.round((new Date(trade.exit_time).getTime() - new Date(trade.entry_time).getTime()) / (1000 * 60))} min
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Final P&L:</span>
                  <p className={`font-medium ${trade.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {trade.pnl >= 0 ? '₹' : '-₹'}{Math.abs(trade.pnl).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}