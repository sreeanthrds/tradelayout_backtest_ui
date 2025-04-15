
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TradesPaginationProps {
  page: number;
  totalTrades: number;
  tradesPerPage: number;
  onPageChange: (page: number) => void;
}

export function TradesPagination({ 
  page, 
  totalTrades, 
  tradesPerPage,
  onPageChange 
}: TradesPaginationProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{Math.min(tradesPerPage, totalTrades)}</span> of <span className="font-medium">{totalTrades}</span> trades
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="min-w-8"
        >
          {page}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
