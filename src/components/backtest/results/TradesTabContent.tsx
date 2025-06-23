
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TradesList } from "@/components/backtest/TradesList";
import { tradeService } from "@/services/TradeDataService";

export function TradesTabContent() {
  const handleExportTrades = () => {
    try {
      const tradesData = tradeService.getData();
      const jsonString = JSON.stringify(tradesData, null, 2);
      
      // Create and download the file
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trade-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Trade history exported successfully');
    } catch (error) {
      console.error('Error exporting trade history:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trade History</CardTitle>
            <CardDescription>Detailed view of all trades</CardDescription>
          </div>
          <Button onClick={handleExportTrades} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TradesList />
      </CardContent>
    </Card>
  );
}
