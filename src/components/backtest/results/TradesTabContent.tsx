
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TradesList } from "@/components/backtest/TradesList";
import { PositionBasedTradesTable } from "./PositionBasedTradesTable";
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold sm:text-lg">Trade History</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">Detailed view of all trades and transactions</p>
        </div>
        {/* Temporarily hidden - will be used in later stages */}
        {/* <Button onClick={handleExportTrades} variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          Export JSON
        </Button> */}
      </div>
      <PositionBasedTradesTable />
    </div>
  );
}
