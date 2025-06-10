
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trade } from "@/models/TradeTypes";

interface TradeChartDialogProps {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeChartDialog({ trade, open, onOpenChange }: TradeChartDialogProps) {
  if (!trade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Chart Analysis - Trade {trade.index}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 pt-0">
          <iframe
            src="https://tile.unificater.com/"
            className="w-full h-[80vh] border-0 rounded-lg"
            title={`Chart for Trade ${trade.index}`}
            allow="fullscreen"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
