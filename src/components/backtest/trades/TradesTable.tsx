
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
  const getTradeStatus = (trade: Trade): "win" | "loss" | "breakeven" => {
    if (trade.profitLoss > 0) return "win";
    if (trade.profitLoss < 0) return "loss";
    return "breakeven";
  };

  // Safeguard if trades is undefined
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
          {trades.map((trade) => (
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
                <TableCell>{trade.entryDate}</TableCell>
                <TableCell>{trade.symbol}</TableCell>
                <TableCell>{trade.tradeDuration}</TableCell>
                <TableCell>{trade.tradePairs?.length || 0}</TableCell>
                <TableCell className={`text-right font-medium ${trade.profitLoss >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  ${Math.abs(trade.profitLoss).toFixed(2)}
                </TableCell>
                <TableCell><TradeStatusBadge status={getTradeStatus(trade)} /></TableCell>
                <TableCell className="text-right">{trade.vix.toFixed(2)}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
