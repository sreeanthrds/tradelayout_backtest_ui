
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TradePair } from "@/models/TradeTypes";
import { formatDateTime } from "@/utils/formatters";
import { ExitReasonBadge } from "./ExitReasonBadge";
import { Badge } from "@/components/ui/badge";
import { TransactionCard } from "./TransactionCard";

interface TradePairItemProps {
  pair: TradePair;
}

export function TradePairItem({ pair }: TradePairItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Handle missing data gracefully
  const entryTime = pair.entry?.timestamp ? formatDateTime(pair.entry.timestamp).time : 'N/A';
  const exitTime = pair.exit?.timestamp ? formatDateTime(pair.exit.timestamp).time : 'Pending';

  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between bg-muted/50 p-2 rounded-md cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
          <span className="font-medium">
            {pair.entry?.type || 'N/A'} {pair.entry?.strike || 'N/A'} 
            <span className="text-gray-500 ml-2 text-xs">
              ({entryTime} - {exitTime})
            </span>
          </span>
          {pair.exit?.exitReason && (
            <span className="ml-2"><ExitReasonBadge reason={pair.exit.exitReason} /></span>
          )}
          {pair.entry?.reEntryNumber !== undefined && pair.entry.reEntryNumber > 0 && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Re-entry #{pair.entry.reEntryNumber}
            </Badge>
          )}
        </div>
        <span className={`font-medium ${
          !pair.exit?.profitLoss ? "text-muted-foreground" : 
          (pair.exit.profitLoss >= 0 ? "text-emerald-600" : "text-red-600")
        }`}>
          {!pair.exit?.profitLoss ? 'N/A' : 
           ((pair.exit.profitLoss >= 0 ? "₹" : "-₹") + Math.abs(pair.exit.profitLoss).toFixed(2))}
        </span>
      </div>
      
      {expanded && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          <TransactionCard transaction={pair.entry} type="Entry" />
          <TransactionCard transaction={pair.exit} type="Exit" />
        </div>
      )}
      
      <Separator className="my-2" />
    </div>
  );
}
