
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TradeStatusBadgeProps {
  status: string;
}

export function TradeStatusBadge({ status }: TradeStatusBadgeProps) {
  if (status === "win") {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 font-medium">
        <TrendingUp className="h-3.5 w-3.5" />
        Win
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 font-medium">
        <TrendingDown className="h-3.5 w-3.5" />
        Loss
      </Badge>
    );
  }
}
