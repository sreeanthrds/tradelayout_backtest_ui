
import { useState } from "react";
import { TradesSearch } from "./trades/TradesSearch";
import { TradesTable } from "./trades/TradesTable";
import { TradesPagination } from "./trades/TradesPagination";
import { TradeAnalysisDialog } from "./trades/TradeAnalysisDialog";
import { TradeReportDialog } from "./trades/TradeReportDialog";
import { mockTrades } from "./trades/TradesMockData";

export function TradesList() {
  const [page, setPage] = useState(1);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const tradesPerPage = 5;
  const totalTrades = 47; // This would typically come from your API

  const handleViewDetails = (trade: any) => {
    // Now handled in the TradesTable component with expandable rows
    console.log("View details for trade", trade.id);
  };

  const handleViewAnalysis = (trade: any) => {
    setSelectedTrade(trade);
    setShowAnalysisDialog(true);
  };

  const handleReportIssue = (trade: any) => {
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
        trades={mockTrades}
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
    </div>
  );
}
