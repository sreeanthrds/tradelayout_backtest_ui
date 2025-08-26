
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/models/TradeTypes";
import { TradeSummaryTab } from "./components/TradeSummaryTab";
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
  
  // Safeguard against missing trade data
  if (!trade) {
    return <div className="p-4 text-center text-muted-foreground">No trade details available.</div>;
  }

  // Create a single backend trade object from this specific transaction
  let backendTrades = [];
  
  // If the trade has originalTransaction (from the new structure), create a backend trade from it
  if ((trade as any).originalTransaction) {
    const transaction = (trade as any).originalTransaction;
    const singleBackendTrade = {
      entry: transaction.entry,
      exit: transaction.exit,
      status: transaction.status,
      entry_time: transaction.entry_time,
      exit_time: transaction.exit_time,
      close_reason: transaction.exit?.reason || transaction.close_reason,
      pnl: transaction.pnl,
      quantity: transaction.quantity || transaction.entry?.quantity,
      entry_price: transaction.entry_price || transaction.entry?.price,
      exit_price: transaction.exit_price || transaction.exit?.price,
      instrument: trade.instrument,
      strategy: trade.strategy,
      node_id: transaction.entry?.node_id,
      trade_side: transaction.entry?.side,
      // Create a transactions array with just this transaction
      transactions: [transaction]
    };
    backendTrades = [singleBackendTrade];
  }
  // Fallback: if trade itself has entry/exit structure, use it as a single backend trade
  else if ((trade as any).entry && (trade as any).exit) {
    backendTrades = [trade as any];
  }
  
  const tradePairs = trade.tradePairs && Array.isArray(trade.tradePairs) ? trade.tradePairs : [];
  
  // Force show comprehensive details if we have backend trades
  const hasBackendData = backendTrades.length > 0;
  
  console.log("Backend trades created for this specific transaction:", hasBackendData, "Count:", backendTrades.length);

  return (
    <div className="px-4 py-2 bg-muted/30 border-t">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Comprehensive Details</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <TradeSummaryTab trade={trade} />
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
