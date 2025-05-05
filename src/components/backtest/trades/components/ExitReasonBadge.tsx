
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertOctagon, RefreshCw, Target, Clock, XCircle, AlertTriangle } from "lucide-react";

interface ExitReasonBadgeProps {
  reason: string | undefined;
}

export function ExitReasonBadge({ reason }: ExitReasonBadgeProps) {
  if (!reason) return null;
  
  const colorMap: Record<string, string> = {
    "Signal": "bg-blue-50 text-blue-700 border-blue-200",
    "SL": "bg-red-50 text-red-700 border-red-200",
    "TSL": "bg-amber-50 text-amber-700 border-amber-200",
    "Target": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Time Decay": "bg-purple-50 text-purple-700 border-purple-200",
    "Cancelled": "bg-gray-50 text-gray-700 border-gray-200",
    "Error": "bg-rose-50 text-rose-700 border-rose-200"
  };
  
  const iconMap: Record<string, any> = {
    "Signal": ArrowRight,
    "SL": AlertOctagon,
    "TSL": RefreshCw,
    "Target": Target,
    "Time Decay": Clock,
    "Cancelled": XCircle,
    "Error": AlertTriangle
  };
  
  const Icon = iconMap[reason] || ArrowRight;
  const colorClass = colorMap[reason] || "bg-gray-50 text-gray-700 border-gray-200";
  
  return (
    <Badge variant="outline" className={`${colorClass} gap-1 font-medium`}>
      <Icon className="h-3.5 w-3.5" />
      {reason}
    </Badge>
  );
}
