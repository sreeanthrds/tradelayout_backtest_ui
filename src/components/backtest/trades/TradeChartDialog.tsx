
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trade } from "@/models/TradeTypes";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useTheme } from "next-themes";
import { ExternalLink, AlertTriangle } from "lucide-react";

interface TradeChartDialogProps {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeChartDialog({ trade, open, onOpenChange }: TradeChartDialogProps) {
  const { userId, strategyId } = useUrlParams();
  const { theme } = useTheme();
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  if (!trade) return null;

  // Build iframe URL with proper parameters
  const iframeUrl = new URL("https://report.unificater.com");
  if (userId) iframeUrl.searchParams.set("userId", userId);
  if (strategyId) iframeUrl.searchParams.set("strategyId", strategyId);
  if (theme) iframeUrl.searchParams.set("theme", theme);

  // Auto-detect iframe blocking after 3 seconds
  useEffect(() => {
    if (!open) {
      setIsBlocked(false);
      setIsLoading(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check if iframe failed to load (likely blocked by X-Frame-Options)
      const iframe = iframeRef.current;
      if (iframe) {
        try {
          // Try to access iframe content - will throw if blocked
          iframe.contentDocument;
        } catch (error) {
          setIsBlocked(true);
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [open]);

  const handleOpenInNewTab = () => {
    window.open(iframeUrl.toString(), '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Chart Analysis - Trade {trade.index}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 pt-0">
          {isLoading && !isBlocked && (
            <div className="flex items-center justify-center h-[80vh] border rounded-lg bg-muted/50">
              <div className="text-center space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground">Loading chart...</p>
              </div>
            </div>
          )}
          
          {isBlocked && (
            <div className="flex items-center justify-center h-[80vh] border rounded-lg bg-muted/50">
              <div className="text-center space-y-6 max-w-md px-6">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Chart Blocked</h3>
                  <p className="text-muted-foreground text-sm">
                    The external chart cannot be displayed in an iframe due to security restrictions (X-Frame-Options).
                  </p>
                </div>
                <Button onClick={handleOpenInNewTab} className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Chart in New Tab
                </Button>
                <p className="text-xs text-muted-foreground">
                  Theme and user settings will be automatically synced
                </p>
              </div>
            </div>
          )}
          
          {!isBlocked && (
            <iframe
              ref={iframeRef}
              src={iframeUrl.toString()}
              className="w-full h-[80vh] border-0 rounded-lg"
              title={`Chart for Trade ${trade.index}`}
              allow="fullscreen"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setIsBlocked(true);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
