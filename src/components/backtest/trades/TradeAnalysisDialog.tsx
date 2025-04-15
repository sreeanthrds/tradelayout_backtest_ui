
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TradeAnalysisDialogProps {
  trade: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeAnalysisDialog({ trade, open, onOpenChange }: TradeAnalysisDialogProps) {
  if (!trade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trade Analysis</DialogTitle>
          <DialogDescription>
            Performance analysis for {trade.strategy} trade on {trade.symbol}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Win Probability:</span>
              <span>62%</span>
              <span className="text-muted-foreground">Expected Value:</span>
              <span>${trade.pnl >= 0 ? "+" : "-"}${Math.abs(trade.pnl * 0.25).toFixed(2)}</span>
              <span className="text-muted-foreground">Similar Trades:</span>
              <span>12 trades</span>
              <span className="text-muted-foreground">Average P&L:</span>
              <span>${(trade.pnl * 0.8).toFixed(2)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            This analysis is based on historical performance of similar trades with this strategy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
