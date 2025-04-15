
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TradeStatusBadge } from "./TradeStatusBadge";

interface TradeDetailsDialogProps {
  trade: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeDetailsDialog({ trade, open, onOpenChange }: TradeDetailsDialogProps) {
  if (!trade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trade Details</DialogTitle>
          <DialogDescription>
            Detailed information for trade {trade.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Strategy</h4>
              <p>{trade.strategy}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Symbol</h4>
              <p>{trade.symbol}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Entry Price</h4>
              <p>${trade.entryPrice.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Exit Price</h4>
              <p>${trade.exitPrice.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">P&L</h4>
              <p className={trade.pnl >= 0 ? "text-emerald-600" : "text-red-600"}>
                ${Math.abs(trade.pnl).toFixed(2)} ({trade.pnlPercent}%)
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Date</h4>
              <p>{trade.date}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Legs</h4>
              <p>{trade.details.legs}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">DTE</h4>
              <p>{trade.details.dte}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">IV</h4>
              <p>{trade.details.iv}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
              <p><TradeStatusBadge status={trade.status} /></p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
