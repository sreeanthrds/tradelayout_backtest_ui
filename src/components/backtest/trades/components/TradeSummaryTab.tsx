
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, IndianRupee } from "lucide-react";
import { Trade } from "@/models/TradeTypes";
import { formatDateTime } from "@/utils/formatters";

interface TradeSummaryTabProps {
  trade: Trade;
}

export function TradeSummaryTab({ trade }: TradeSummaryTabProps) {
  // Ensure trade pairs array exists
  const tradePairs = trade.tradePairs && Array.isArray(trade.tradePairs) ? trade.tradePairs : [];
  
  // Get comprehensive trade data - prioritize backend data
  const backendTrades = trade.trades || [];
  const pnl = trade.pnl ?? trade.profitLoss;
  const entryTime = trade.entry_time || trade.entryTime;
  const exitTime = trade.exit_time || trade.exitTime;
  const strategy = trade.strategy || 'N/A';
  const instrument = trade.instrument || trade.symbol || 'N/A';
  const quantity = trade.quantity || 'N/A';
  const entryPrice = trade.entry_price || 'N/A';
  const exitPrice = trade.exit_price || 'N/A';
  const closeReason = trade.close_reason || 'N/A';
  const tradeNodeId = trade.node_id || 'N/A';
  const tradeSide = trade.trade_side || 'N/A';
  
  // Determine trade status string
  const getTradeStatusText = () => {
    if (trade.status === 'Pending' || trade.status === 'Open' || trade.status === 'open') {
      return "Trade is still active";
    }
    if (trade.status === 'Cancelled') {
      return "Trade was cancelled";
    }
    if (trade.status === 'Error') {
      return "Trade had execution errors";
    }
    
    if (pnl === null || pnl === undefined) {
      return "Trade outcome not available";
    }
    
    return `Trade closed with ${(pnl || 0) >= 0 ? "profit" : "loss"} of ${(pnl || 0) >= 0 ? "₹" : "-₹"}${Math.abs(pnl || 0).toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Trade Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex flex-col items-center">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div className="h-full w-0.5 bg-muted-foreground/20 my-1" />
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-medium">
                  {entryTime ? (() => {
                    const formatted = formatDateTime(entryTime);
                    return `${formatted.date} ${formatted.time}`;
                  })() : 'N/A'} - Entry
                </p>
                <p className="text-muted-foreground">
                  {tradeSide !== 'N/A' ? `${tradeSide} side` : ''} trade with {backendTrades.length || tradePairs.length} transaction{(backendTrades.length || tradePairs.length) === 1 ? '' : 's'}
                </p>
              </div>
              <div>
                <p className="font-medium">
                  {exitTime ? (() => {
                    const formatted = formatDateTime(exitTime);
                    return `${formatted.date} ${formatted.time} - Exit`;
                  })() : 'Trade Not Yet Closed'}
                </p>
                <p className="text-muted-foreground">
                  {getTradeStatusText()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Net P&L:</span>
            {pnl === null || pnl === undefined ? (
              <span className="font-medium text-muted-foreground">N/A</span>
            ) : (
              <span className={`font-medium ${(pnl || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {(pnl || 0) >= 0 ? "₹" : "-₹"}{Math.abs(pnl || 0).toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Strategy:</span>
            <span className="font-medium">{strategy}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Instrument:</span>
            <span className="font-medium">{instrument}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Entry Price:</span>
            <span className="font-medium">{typeof entryPrice === 'number' ? `₹${entryPrice.toFixed(2)}` : entryPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Exit Price:</span>
            <span className="font-medium">{typeof exitPrice === 'number' ? `₹${exitPrice.toFixed(2)}` : exitPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Close Reason:</span>
            <span className="font-medium">{closeReason}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Trade Side:</span>
            <span className="font-medium">{tradeSide}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Node ID:</span>
            <span className="font-medium">{tradeNodeId}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Position ID:</span>
            <span className="font-medium">{trade.positionId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">{trade.status || 'N/A'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
