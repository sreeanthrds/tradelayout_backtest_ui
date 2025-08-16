import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TradeStatusBadge } from "./TradeStatusBadge";
import { TradeActionsMenu } from "./TradeActionsMenu";
import { TradeExpandedDetails } from "./TradeExpandedDetails";
import { TradeChartDialog } from "./TradeChartDialog";
import { ChevronDown, ChevronRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trade } from "@/models/TradeTypes";
import { formatDate, formatTime, formatCurrency } from "@/utils/formatters";

interface TradesTableProps {
  trades: Trade[];
  onViewDetails: (trade: Trade) => void;
  onViewAnalysis: (trade: Trade) => void;
  onReportIssue: (trade: Trade) => void;
}

export function TradesTable({ 
  trades = [],
  onViewDetails,
  onViewAnalysis,
  onReportIssue
}: TradesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const [selectedTradeForChart, setSelectedTradeForChart] = useState<Trade | null>(null);

  const toggleRow = (tradeId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [tradeId]: !prev[tradeId]
    }));
  };

  const handleOpenChart = (trade: Trade) => {
    setSelectedTradeForChart(trade);
    setChartDialogOpen(true);
  };

  // Get trade status based on P&L
  const getTradeStatus = (trade: Trade): "win" | "loss" | "breakeven" | "pending" | "cancelled" | "error" | "open" => {
    if (!trade) return "breakeven";
    
    // If trade has a status field, use that directly
    if (trade.status) {
      const status = trade.status.toLowerCase();
      if (["pending", "cancelled", "error", "open"].includes(status)) {
        return status as any;
      }
    }
    
    // Otherwise, determine by P&L
    if (typeof trade.profitLoss !== 'number') return "pending";
    if (trade.profitLoss > 0) return "win";
    if (trade.profitLoss < 0) return "loss";
    return "breakeven";
  };

  // Format P&L with appropriate sign and currency
  const formatPnL = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    return `₹${Math.abs(value).toFixed(2)}`;
  };

  // Safeguard if trades is undefined or empty
  if (!trades || trades.length === 0) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Pairs</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">VIX</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                No trades available.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] sm:w-[50px]"></TableHead>
                <TableHead className="w-[80px] sm:w-[100px] md:w-[140px] text-xs sm:text-sm">ID</TableHead>
                <TableHead className="min-w-[100px] text-xs sm:text-sm">Date</TableHead>
                <TableHead className="min-w-[60px] text-xs sm:text-sm">Symbol</TableHead>
                <TableHead className="min-w-[70px] text-xs sm:text-sm hidden sm:table-cell">Duration</TableHead>
                <TableHead className="min-w-[50px] text-xs sm:text-sm hidden md:table-cell">Pairs</TableHead>
                <TableHead className="text-right min-w-[70px] text-xs sm:text-sm">P&L</TableHead>
                <TableHead className="min-w-[60px] text-xs sm:text-sm">Status</TableHead>
                <TableHead className="text-right min-w-[50px] text-xs sm:text-sm hidden lg:table-cell">VIX</TableHead>
                <TableHead className="text-right w-[40px] sm:w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {trades.map((trade) => {
              const tradeStatus = getTradeStatus(trade);
              const isProfitable = (trade.profitLoss || 0) >= 0;
              return (
                <>
                  <TableRow key={trade.index} className={expandedRows[trade.index] ? "border-b-0" : ""}>
                    <TableCell className="p-2 sm:p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleRow(trade.index)}
                        className="h-6 w-6 sm:h-8 sm:w-8"
                      >
                        {expandedRows[trade.index] ? (
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium p-2 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm">{trade.index}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenChart(trade)}
                          className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-blue-100 dark:hover:bg-blue-900"
                          title="View Chart"
                        >
                          <BarChart3 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600 dark:text-blue-400" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="text-xs sm:text-sm">
                        <div className="font-medium">{new Date(trade.entryDate).toLocaleDateString('en-IN')}</div>
                        <div className="text-muted-foreground text-[10px] sm:text-xs">
                          {trade.entryTime} {trade.exitTime ? `- ${trade.exitTime}` : '(Active)'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">{trade.symbol || 'N/A'}</TableCell>
                    <TableCell className="p-2 sm:p-4 text-xs sm:text-sm hidden sm:table-cell">{trade.tradeDuration || 'Active'}</TableCell>
                    <TableCell className="p-2 sm:p-4 text-xs sm:text-sm hidden md:table-cell">{trade.tradePairs && Array.isArray(trade.tradePairs) ? trade.tradePairs.length : 0}</TableCell>
                    <TableCell className={`text-right font-medium p-2 sm:p-4 text-xs sm:text-sm ${
                      trade.profitLoss === null || trade.profitLoss === undefined 
                        ? "text-muted-foreground"
                        : isProfitable ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {trade.profitLoss === null || trade.profitLoss === undefined ? 'N/A' : formatPnL(trade.profitLoss)}
                    </TableCell>
                    <TableCell className="p-2 sm:p-4"><TradeStatusBadge status={tradeStatus} /></TableCell>
                    <TableCell className="text-right p-2 sm:p-4 text-xs sm:text-sm hidden lg:table-cell">{typeof trade.vix === 'number' ? trade.vix.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell className="text-right p-2 sm:p-4">
                      <TradeActionsMenu 
                        trade={trade}
                        onViewDetails={() => toggleRow(trade.index)}
                        onViewAnalysis={() => onViewAnalysis(trade)}
                        onReportIssue={() => onReportIssue(trade)}
                      />
                    </TableCell>
                  </TableRow>
                  {expandedRows[trade.index] && (
                    <TableRow key={`${trade.index}-details`}>
                      <TableCell colSpan={10} className="p-0">
                        <TradeExpandedDetails trade={trade} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
          </Table>
        </div>
      </div>

      <TradeChartDialog
        trade={selectedTradeForChart}
        open={chartDialogOpen}
        onOpenChange={setChartDialogOpen}
      />
    </>
  );
}
