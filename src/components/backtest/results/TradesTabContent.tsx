
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TradesList } from "@/components/backtest/TradesList";

export function TradesTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
        <CardDescription>Detailed view of all trades</CardDescription>
      </CardHeader>
      <CardContent>
        <TradesList />
      </CardContent>
    </Card>
  );
}
