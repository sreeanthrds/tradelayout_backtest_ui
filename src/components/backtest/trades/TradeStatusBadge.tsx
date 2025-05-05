
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  PauseCircle, 
  AlertCircle, 
  Hourglass,
  XCircle,
  Clock
} from "lucide-react";

type TradeStatus = "win" | "loss" | "breakeven" | "pending" | "cancelled" | "error" | "open" | string;

interface TradeStatusBadgeProps {
  status: TradeStatus;
}

// Define status configurations for consistent styling and icons
const statusConfig: Record<string, { icon: any, label: string, classes: string }> = {
  win: {
    icon: TrendingUp,
    label: "Win",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  loss: {
    icon: TrendingDown,
    label: "Loss",
    classes: "bg-red-50 text-red-700 border-red-200"
  },
  breakeven: {
    icon: PauseCircle,
    label: "Breakeven",
    classes: "bg-blue-50 text-blue-700 border-blue-200"
  },
  pending: {
    icon: Hourglass,
    label: "Pending",
    classes: "bg-amber-50 text-amber-700 border-amber-200"
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    classes: "bg-gray-50 text-gray-700 border-gray-200"
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    classes: "bg-rose-50 text-rose-700 border-rose-200"
  },
  open: {
    icon: Clock,
    label: "Open",
    classes: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  closed: {
    icon: TrendingDown,
    label: "Closed",
    classes: "bg-purple-50 text-purple-700 border-purple-200"
  }
};

export function TradeStatusBadge({ status }: TradeStatusBadgeProps) {
  // Default to showing status as-is if not in our predefined list
  const config = statusConfig[status.toLowerCase()] || {
    icon: AlertCircle,
    label: status,
    classes: "bg-gray-50 text-gray-700 border-gray-200"
  };
  
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.classes} gap-1 font-medium`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
