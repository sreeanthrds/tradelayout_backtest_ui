
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronDown, Copy, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TradeActionsMenuProps {
  trade: any;
  onViewDetails: (trade: any) => void;
  onViewAnalysis: (trade: any) => void;
  onReportIssue: (trade: any) => void;
}

export function TradeActionsMenu({ 
  trade, 
  onViewDetails, 
  onViewAnalysis, 
  onReportIssue 
}: TradeActionsMenuProps) {
  
  const handleCopyTrade = (trade: any) => {
    toast.success("Trade Copied", {
      description: `${trade.strategy} trade on ${trade.symbol} copied to clipboard`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewDetails(trade)}>
          <ChevronDown className="h-4 w-4 mr-2" />
          Toggle Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopyTrade(trade)}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Trade
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewAnalysis(trade)}>
          <Info className="h-4 w-4 mr-2" />
          Analysis
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => onReportIssue(trade)}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Report Issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
