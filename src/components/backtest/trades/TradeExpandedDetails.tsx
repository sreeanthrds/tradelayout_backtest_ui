
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/models/TradeTypes";
import { TradeSummaryTab } from "./components/TradeSummaryTab";
import { TransactionsTab } from "./components/TransactionsTab";
import { BackendTradeDetails } from "./components/BackendTradeDetails";

interface TradeExpandedDetailsProps {
  trade: Trade;
}

export function TradeExpandedDetails({ trade }: TradeExpandedDetailsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  
  // Debug logging - check what data we're receiving
  console.log("=== TradeExpandedDetails Debug ===");
  console.log("Trade object:", trade);
  console.log("Trade keys:", Object.keys(trade));
  console.log("Trade.trades:", trade.trades);
  console.log("Trade.tradePairs:", trade.tradePairs);
  console.log("=== End Debug ===");
  
  // Safeguard against missing trade data
  if (!trade) {
    return <div className="p-4 text-center text-muted-foreground">No trade details available.</div>;
  }

  // Check for your backend data structure
  // If the trade itself has entry/exit structure, use it as a single backend trade
  let backendTrades = trade.trades || [];
  
  // If trade.trades is empty but the trade itself has entry/exit structure, use the trade itself
  if (backendTrades.length === 0 && (trade as any).entry && (trade as any).exit) {
    backendTrades = [trade as any]; // Cast trade as BackendTrade
  }
  
  const tradePairs = trade.tradePairs && Array.isArray(trade.tradePairs) ? trade.tradePairs : [];
  
  // Force show comprehensive details if we have backend trades
  const hasBackendData = backendTrades.length > 0;
  
  console.log("Backend trades available:", hasBackendData, "Count:", backendTrades.length);

  return (
    <div className="px-4 py-2 bg-muted/30 border-t">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="details">Comprehensive Details</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <TradeSummaryTab trade={trade} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab tradePairs={tradePairs} />
        </TabsContent>

        <TabsContent value="details">
          {hasBackendData ? (
            <BackendTradeDetails trades={backendTrades} />
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No comprehensive backend data available for this trade.</p>
              <p className="text-xs mt-2">Expected format: trade.trades array with entry/exit details</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
