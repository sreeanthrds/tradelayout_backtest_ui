
import { useState, useEffect } from "react";
import { TradesSearch } from "./trades/TradesSearch";
import { TradesTable } from "./trades/TradesTable";
import { TradesPagination } from "./trades/TradesPagination";
import { TradeAnalysisDialog } from "./trades/TradeAnalysisDialog";
import { TradeReportDialog } from "./trades/TradeReportDialog";
import { Trade } from "@/models/TradeTypes";
import { tradeService } from "@/services/TradeDataService";

export function TradesList() {
  const [page, setPage] = useState(1);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);
  
  const tradesPerPage = 5;
  const totalTrades = trades.length;
  
  useEffect(() => {
    // Get trades data from service (in a real app, this would be from an API)
    // For now, we use the sample data from the service
    const data = tradeService.getSampleData();
    setTrades(data.trades);
  }, []);

  const handleViewDetails = (trade: Trade) => {
    // Now handled in the TradesTable component with expandable rows
    console.log("View details for trade", trade.index);
  };

  const handleViewAnalysis = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowAnalysisDialog(true);
  };

  const handleReportIssue = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowReportDialog(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-4">
      <TradesSearch onSearch={handleSearch} />
      
      <TradesTable 
        trades={trades}
        onViewDetails={handleViewDetails}
        onViewAnalysis={handleViewAnalysis}
        onReportIssue={handleReportIssue}
      />
      
      <TradesPagination 
        page={page}
        totalTrades={totalTrades}
        tradesPerPage={tradesPerPage}
        onPageChange={setPage}
      />

      {selectedTrade && (
        <>
          <TradeAnalysisDialog 
            trade={selectedTrade} 
            open={showAnalysisDialog} 
            onOpenChange={setShowAnalysisDialog} 
          />

          <TradeReportDialog 
            trade={selectedTrade} 
            open={showReportDialog} 
            onOpenChange={setShowReportDialog} 
          />
        </>
      )}
    </div>
  );
}
