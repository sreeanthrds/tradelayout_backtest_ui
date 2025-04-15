
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

interface TradesTableProps {
  trades: any[];
  onViewDetails: (trade: any) => void;
  onViewAnalysis: (trade: any) => void;
  onReportIssue: (trade: any) => void;
}

export function TradesTable({ 
  trades,
  onViewDetails,
  onViewAnalysis,
  onReportIssue
}: TradesTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Strategy</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Entry</TableHead>
            <TableHead className="text-right">Exit</TableHead>
            <TableHead className="text-right">P&L</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell className="font-medium">{trade.id}</TableCell>
              <TableCell>{trade.date}</TableCell>
              <TableCell>{trade.strategy}</TableCell>
              <TableCell>{trade.symbol}</TableCell>
              <TableCell>{trade.type}</TableCell>
              <TableCell className="text-right">${trade.entryPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">${trade.exitPrice.toFixed(2)}</TableCell>
              <TableCell className={`text-right font-medium ${trade.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                ${Math.abs(trade.pnl).toFixed(2)} ({trade.pnlPercent}%)
              </TableCell>
              <TableCell><TradeStatusBadge status={trade.status} /></TableCell>
              <TableCell className="text-right">
                <TradeActionsMenu 
                  trade={trade}
                  onViewDetails={onViewDetails}
                  onViewAnalysis={onViewAnalysis}
                  onReportIssue={onReportIssue}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
