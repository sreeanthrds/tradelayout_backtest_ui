
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trade } from "@/models/TradeTypes";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useTheme } from "next-themes";

interface TradeChartDialogProps {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeChartDialog({ trade, open, onOpenChange }: TradeChartDialogProps) {
  const { userId, strategyId } = useUrlParams();
  const { theme } = useTheme();
  
  if (!trade) return null;

  // Build iframe URL with proper parameters
  const iframeUrl = new URL("https://report.unificater.com");
  if (userId) iframeUrl.searchParams.set("userId", userId);
  if (strategyId) iframeUrl.searchParams.set("strategyId", strategyId);
  if (theme) iframeUrl.searchParams.set("theme", theme);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Chart Analysis - Trade {trade.index}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 pt-0">
          <iframe
            src={iframeUrl.toString()}
            className="w-full h-[80vh] border-0 rounded-lg"
            title={`Chart for Trade ${trade.index}`}
            allow="fullscreen"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
