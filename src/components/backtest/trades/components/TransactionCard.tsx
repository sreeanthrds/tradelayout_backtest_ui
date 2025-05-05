
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/models/TradeTypes";
import { formatDateTime } from "@/utils/formatters";
import { ExitReasonBadge } from "./ExitReasonBadge";

interface TransactionCardProps {
  transaction: Transaction | undefined | null;
  type: "Entry" | "Exit";
}

export function TransactionCard({ transaction, type }: TransactionCardProps) {
  if (!transaction) {
    return (
      <Card className="border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{type} Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="text-center py-4 text-muted-foreground">
            {type === "Entry" ? "No entry information available" : "Trade not yet closed"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { date, time } = formatDateTime(transaction.timestamp || "");
  
  return (
    <Card className="border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{type} Details</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-2 gap-y-2">
          <span className="text-muted-foreground">Date & Time:</span>
          <span>{date || 'N/A'} {time || 'N/A'}</span>
          
          <span className="text-muted-foreground">Type:</span>
          <span>{transaction.type || 'N/A'}</span>
          
          <span className="text-muted-foreground">Strike:</span>
          <span>{transaction.strike || 'N/A'}</span>
          
          <span className="text-muted-foreground">Buy/Sell:</span>
          <span>{transaction.buySell || 'N/A'}</span>
          
          <span className="text-muted-foreground">Quantity:</span>
          <span>{transaction.quantity || 'N/A'}</span>
          
          <span className="text-muted-foreground">{type === "Entry" ? "Entry Price:" : "Exit Price:"}</span>
          <span>₹{(type === "Entry" ? transaction.entryPrice?.toFixed(2) : transaction.exitPrice?.toFixed(2)) || 'N/A'}</span>
          
          <span className="text-muted-foreground">Order Type:</span>
          <span>{transaction.orderType || 'N/A'}</span>
          
          {type === "Entry" ? (
            <>
              <span className="text-muted-foreground">Entry Number:</span>
              <span>#{transaction.entryNumber || 'N/A'}</span>
              
              <span className="text-muted-foreground">Re-entry Number:</span>
              <span>{transaction.reEntryNumber || '0'}</span>
            </>
          ) : (
            <>
              <span className="text-muted-foreground">Exit Reason:</span>
              <span>{transaction.exitReason ? <ExitReasonBadge reason={transaction.exitReason} /> : '-'}</span>
              
              <span className="text-muted-foreground">P&L:</span>
              <span className={`font-medium ${(transaction.profitLoss || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {transaction.profitLoss === undefined ? 'N/A' : 
                  ((transaction.profitLoss || 0) >= 0 ? "₹" : "-₹") + Math.abs(transaction.profitLoss || 0).toFixed(2)}
              </span>
            </>
          )}
          
          <span className="text-muted-foreground">Position ID:</span>
          <span className="font-mono text-xs">{transaction.positionId || 'N/A'}</span>
          
          <span className="text-muted-foreground">Node ID:</span>
          <span className="font-mono text-xs">{transaction.nodeId || 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
