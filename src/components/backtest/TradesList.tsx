
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
  const [isLoading, setIsLoading] = useState(true);
  
  const tradesPerPage = 5;
  
  useEffect(() => {
    // Get trades data from service
    try {
      const data = tradeService.getSampleData();
      if (data && data.trades && Array.isArray(data.trades)) {
        setTrades(data.trades);
      } else {
        console.error("No trade data available or invalid format");
        setTrades([]);
      }
    } catch (error) {
      console.error("Error loading trade data:", error);
      setTrades([]);
    } finally {
      setIsLoading(false);
    }
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

  // Filter trades based on search query
  const filteredTrades = searchQuery && trades ? 
    trades.filter(trade => 
        trade.index.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.positionId.toLowerCase().includes(searchQuery.toLowerCase()))
    : trades;
    
  const totalTrades = filteredTrades ? filteredTrades.length : 0;

  if (isLoading) {
    return <div className="py-10 text-center">Loading trades data...</div>;
  }

  return (
    <div className="space-y-4">
      <TradesSearch onSearch={handleSearch} />
      
      <TradesTable 
        trades={filteredTrades || []}
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
