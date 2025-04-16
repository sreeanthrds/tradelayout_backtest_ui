
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/models/TradeTypes";
import { TradeSummaryTab } from "./components/TradeSummaryTab";
import { TransactionsTab } from "./components/TransactionsTab";

interface TradeExpandedDetailsProps {
  trade: Trade;
}

export function TradeExpandedDetails({ trade }: TradeExpandedDetailsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  
  // Safeguard against missing trade data
  if (!trade) {
    return <div className="p-4 text-center text-muted-foreground">No trade details available.</div>;
  }

  // Ensure trade pairs array exists
  const tradePairs = trade.tradePairs && Array.isArray(trade.tradePairs) ? trade.tradePairs : [];

  return (
    <div className="px-4 py-2 bg-muted/30 border-t">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <TradeSummaryTab trade={trade} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab tradePairs={tradePairs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
