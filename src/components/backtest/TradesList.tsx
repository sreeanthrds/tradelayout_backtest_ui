
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
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function TradesList() {
  const [page, setPage] = useState(1);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  
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

  const handleViewDetails = (trade: any) => {
    setSelectedTrade(trade);
    setShowDetailsDialog(true);
  };

  const handleCopyTrade = (trade: any) => {
    // In a real application, you would copy the trade to create a new one
    toast.success("Trade Copied", {
      description: `${trade.strategy} trade on ${trade.symbol} copied to clipboard`,
    });
  };

  const handleViewAnalysis = (trade: any) => {
    setSelectedTrade(trade);
    setShowAnalysisDialog(true);
  };

  const handleReportIssue = (trade: any) => {
    setSelectedTrade(trade);
    setShowReportDialog(true);
  };

  const handleSubmitReport = () => {
    toast.success("Issue Reported", {
      description: "Thank you for your feedback. Our team will review this trade.",
    });
    setShowReportDialog(false);
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
                      <DropdownMenuItem onClick={() => handleViewDetails(trade)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyTrade(trade)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Trade
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewAnalysis(trade)}>
                        <Info className="h-4 w-4 mr-2" />
                        Analysis
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleReportIssue(trade)}
                      >
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

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Trade Details</DialogTitle>
            <DialogDescription>
              Detailed information for trade {selectedTrade?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedTrade && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Strategy</h4>
                  <p>{selectedTrade.strategy}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Symbol</h4>
                  <p>{selectedTrade.symbol}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Entry Price</h4>
                  <p>${selectedTrade.entryPrice.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Exit Price</h4>
                  <p>${selectedTrade.exitPrice.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">P&L</h4>
                  <p className={selectedTrade.pnl >= 0 ? "text-emerald-600" : "text-red-600"}>
                    ${Math.abs(selectedTrade.pnl).toFixed(2)} ({selectedTrade.pnlPercent}%)
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Date</h4>
                  <p>{selectedTrade.date}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Legs</h4>
                  <p>{selectedTrade.details.legs}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">DTE</h4>
                  <p>{selectedTrade.details.dte}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">IV</h4>
                  <p>{selectedTrade.details.iv}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                  <p>{getStatusBadge(selectedTrade.status)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Trade Analysis Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Trade Analysis</DialogTitle>
            <DialogDescription>
              Performance analysis for {selectedTrade?.strategy} trade on {selectedTrade?.symbol}
            </DialogDescription>
          </DialogHeader>
          {selectedTrade && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Win Probability:</span>
                  <span>62%</span>
                  <span className="text-muted-foreground">Expected Value:</span>
                  <span>${selectedTrade.pnl >= 0 ? "+" : "-"}${Math.abs(selectedTrade.pnl * 0.25).toFixed(2)}</span>
                  <span className="text-muted-foreground">Similar Trades:</span>
                  <span>12 trades</span>
                  <span className="text-muted-foreground">Average P&L:</span>
                  <span>${(selectedTrade.pnl * 0.8).toFixed(2)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This analysis is based on historical performance of similar trades with this strategy.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
            <DialogDescription>
              Submit a report for trade {selectedTrade?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="issue-type" className="text-sm font-medium">Issue Type</label>
              <select 
                id="issue-type" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option>Data Inconsistency</option>
                <option>Incorrect Calculation</option>
                <option>Missing Information</option>
                <option>Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea 
                id="description" 
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Please describe the issue you found..."
              ></textarea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitReport}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
