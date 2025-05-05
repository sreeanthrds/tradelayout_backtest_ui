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
import { ChevronDown, ChevronRight } from "lucide-react";
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

  const toggleRow = (tradeId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [tradeId]: !prev[tradeId]
    }));
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
          {trades.map((trade) => {
            const tradeStatus = getTradeStatus(trade);
            const isProfitable = (trade.profitLoss || 0) >= 0;
            return (
              <>
                <TableRow key={trade.index} className={expandedRows[trade.index] ? "border-b-0" : ""}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRow(trade.index)}
                      className="h-8 w-8"
                    >
                      {expandedRows[trade.index] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{trade.index}</TableCell>
                  <TableCell>{trade.entryDate || 'N/A'}</TableCell>
                  <TableCell>{trade.symbol || 'N/A'}</TableCell>
                  <TableCell>{trade.tradeDuration || 'Active'}</TableCell>
                  <TableCell>{trade.tradePairs && Array.isArray(trade.tradePairs) ? trade.tradePairs.length : 0}</TableCell>
                  <TableCell className={`text-right font-medium ${
                    trade.profitLoss === null || trade.profitLoss === undefined 
                      ? "text-muted-foreground"
                      : isProfitable ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {trade.profitLoss === null || trade.profitLoss === undefined ? 'N/A' : formatPnL(trade.profitLoss)}
                  </TableCell>
                  <TableCell><TradeStatusBadge status={tradeStatus} /></TableCell>
                  <TableCell className="text-right">{typeof trade.vix === 'number' ? trade.vix.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell className="text-right">
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
  );
}
