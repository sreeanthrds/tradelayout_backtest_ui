
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { TradePair } from "@/models/TradeTypes";
import { TradePairItem } from "./TradePairItem";

interface TransactionsTabProps {
  tradePairs: TradePair[];
}

export function TransactionsTab({ tradePairs }: TransactionsTabProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          Transaction Pairs ({tradePairs.length})
        </CardTitle>
        <CardDescription>
          Click on a pair to view detailed information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tradePairs.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No transaction pairs available.</div>
        ) : (
          tradePairs.map((pair) => (
            <TradePairItem key={pair.index} pair={pair} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
