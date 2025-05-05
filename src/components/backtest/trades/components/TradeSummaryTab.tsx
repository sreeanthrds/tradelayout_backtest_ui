
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
  
  // Determine trade status string
  const getTradeStatusText = () => {
    if (trade.status === 'Pending' || trade.status === 'Open') {
      return "Trade is still active";
    }
    if (trade.status === 'Cancelled') {
      return "Trade was cancelled";
    }
    if (trade.status === 'Error') {
      return "Trade had execution errors";
    }
    
    if (trade.profitLoss === null || trade.profitLoss === undefined) {
      return "Trade outcome not available";
    }
    
    return `Trade closed with ${(trade.profitLoss || 0) >= 0 ? "profit" : "loss"} of ${(trade.profitLoss || 0) >= 0 ? "₹" : "-₹"}${Math.abs(trade.profitLoss || 0).toFixed(2)}`;
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
                <p className="font-medium">{trade.entryDate || 'N/A'} {trade.entryTime || ''} - Entry</p>
                <p className="text-muted-foreground">
                  Trade opened with {tradePairs.length} position {tradePairs.length === 1 ? 'pair' : 'pairs'}
                </p>
              </div>
              <div>
                <p className="font-medium">
                  {trade.exitDate ? `${trade.exitDate} ${trade.exitTime || ''} - Exit` : 'Trade Not Yet Closed'}
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
            {trade.profitLoss === null || trade.profitLoss === undefined ? (
              <span className="font-medium text-muted-foreground">N/A</span>
            ) : (
              <span className={`font-medium ${(trade.profitLoss || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {(trade.profitLoss || 0) >= 0 ? "₹" : "-₹"}{Math.abs(trade.profitLoss || 0).toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Trade Pairs:</span>
            <span className="font-medium">{tradePairs.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">VIX Level:</span>
            <span className="font-medium">{typeof trade.vix === 'number' ? trade.vix.toFixed(2) : 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Holding Period:</span>
            <span className="font-medium">{trade.tradeDuration || 'Active'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Position ID:</span>
            <span className="font-medium">{trade.positionId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Instrument Type:</span>
            <span className="font-medium">{trade.instrumentType || 'N/A'}</span>
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
