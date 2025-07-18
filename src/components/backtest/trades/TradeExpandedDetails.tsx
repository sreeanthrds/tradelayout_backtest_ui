
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
  
  // Debug logging
  console.log("TradeExpandedDetails received trade:", trade);
  
  // Safeguard against missing trade data
  if (!trade) {
    return <div className="p-4 text-center text-muted-foreground">No trade details available.</div>;
  }

  // Ensure trade pairs array exists
  const tradePairs = trade.tradePairs && Array.isArray(trade.tradePairs) ? trade.tradePairs : [];
  const backendTrades = trade.trades || [];
  
  console.log("Trade pairs:", tradePairs.length, "Backend trades:", backendTrades.length);

  return (
    <div className="px-4 py-2 bg-muted/30 border-t">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          {backendTrades.length > 0 && (
            <TabsTrigger value="details">Comprehensive Details</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="summary">
          <TradeSummaryTab trade={trade} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab tradePairs={tradePairs} />
        </TabsContent>

        {backendTrades.length > 0 && (
          <TabsContent value="details">
            <BackendTradeDetails trades={backendTrades} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
