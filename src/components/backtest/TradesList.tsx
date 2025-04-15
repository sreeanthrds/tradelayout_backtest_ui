
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownUp, 
  MoreHorizontal, 
  Copy, 
  Eye, 
  Info, 
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function TradesList() {
  const [page, setPage] = useState(1);
  
  // This is mock data - in a real application, you would fetch this from your API
  const mockTrades = [
    {
      id: "TR-7821",
      date: "2023-12-15",
      strategy: "Iron Condor",
      symbol: "SPY",
      type: "Short",
      entryPrice: 468.25,
      exitPrice: 472.50,
      pnl: -542.75,
      pnlPercent: -2.7,
      status: "loss",
      details: {
        legs: 4,
        dte: 45,
        iv: "18.2%"
      }
    },
    {
      id: "TR-7820",
      date: "2023-12-10",
      strategy: "Bull Put Spread",
      symbol: "QQQ",
      type: "Short",
      entryPrice: 382.15,
      exitPrice: 379.80,
      pnl: 312.50,
      pnlPercent: 1.8,
      status: "win",
      details: {
        legs: 2,
        dte: 32,
        iv: "16.5%"
      }
    },
    {
      id: "TR-7819",
      date: "2023-12-05",
      strategy: "Long Call",
      symbol: "AAPL",
      type: "Long",
      entryPrice: 185.75,
      exitPrice: 191.20,
      pnl: 685.00,
      pnlPercent: 8.3,
      status: "win",
      details: {
        legs: 1,
        dte: 60,
        iv: "20.3%"
      }
    },
    {
      id: "TR-7818",
      date: "2023-11-28",
      strategy: "Short Strangle",
      symbol: "MSFT",
      type: "Short",
      entryPrice: 375.50,
      exitPrice: 372.25,
      pnl: 218.50,
      pnlPercent: 1.2,
      status: "win",
      details: {
        legs: 2,
        dte: 28,
        iv: "19.8%"
      }
    },
    {
      id: "TR-7817",
      date: "2023-11-20",
      strategy: "Bear Call Spread",
      symbol: "TSLA",
      type: "Short",
      entryPrice: 234.80,
      exitPrice: 245.30,
      pnl: -789.25,
      pnlPercent: -4.1,
      status: "loss",
      details: {
        legs: 2,
        dte: 35,
        iv: "42.7%"
      }
    },
  ];

  const getStatusBadge = (status: string) => {
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
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Input 
            placeholder="Search trades..." 
            className="max-w-sm h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ArrowDownUp className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>
      
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
            {mockTrades.map((trade) => (
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
                <TableCell>{getStatusBadge(trade.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Trade
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Info className="h-4 w-4 mr-2" />
                        Analysis
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Report Issue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">5</span> of <span className="font-medium">47</span> trades
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(Math.max(1, page - 1))}
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
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
