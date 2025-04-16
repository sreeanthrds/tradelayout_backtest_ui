
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ArrowRight, BarChart2, Clock, DollarSign, ChevronDown, ChevronRight, RefreshCw, AlertOctagon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trade, TradePair } from "@/models/TradeTypes";
import { formatDateTime } from "@/utils/formatters";

interface TradeExpandedDetailsProps {
  trade: Trade;
}

export function TradeExpandedDetails({ trade }: TradeExpandedDetailsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  function getExitReasonBadge(reason: string | undefined) {
    if (!reason) return null;
    
    const colorMap: Record<string, string> = {
      "Signal": "bg-blue-50 text-blue-700 border-blue-200",
      "SL": "bg-red-50 text-red-700 border-red-200",
      "TSL": "bg-amber-50 text-amber-700 border-amber-200"
    };
    
    const iconMap: Record<string, any> = {
      "Signal": ArrowRight,
      "SL": AlertOctagon,
      "TSL": RefreshCw
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

  // Safeguard against missing trade data
  if (!trade) {
    return <div className="p-4 text-center text-muted-foreground">No trade details available.</div>;
  }

  // Ensure trade pairs array exists
  const tradePairs = trade.tradePairs && Array.isArray(trade.tradePairs) ? trade.tradePairs : [];

  return (
    <div className="px-4 py-2 bg-muted/30 border-t">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Trade Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div className="h-full w-0.5 bg-muted-foreground/20 my-1" />
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">{trade.entryDate || 'N/A'} {trade.entryTime || ''} - Entry</p>
                      <p className="text-muted-foreground">
                        Trade opened with {tradePairs.length} position pairs
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">{trade.exitDate || 'N/A'} {trade.exitTime || ''} - Exit</p>
                      <p className="text-muted-foreground">
                        Trade closed with {(trade.profitLoss || 0) >= 0 ? "profit" : "loss"} of ${Math.abs(trade.profitLoss || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Net P&L:</span>
                  <span className={`font-medium ${(trade.profitLoss || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    ${Math.abs(trade.profitLoss || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Trade Pairs:</span>
                  <span className="font-medium">{tradePairs.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">VIX Level:</span>
                  <span className="font-medium">{typeof trade.vix === 'number' ? trade.vix.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Holding Period:</span>
                  <span className="font-medium">{trade.tradeDuration || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Transaction Pairs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tradePairs.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No transaction pairs available.</div>
              ) : (
                tradePairs.map((pair) => (
                  <div key={pair.index} className="mb-4">
                    <div 
                      className="flex items-center justify-between bg-muted/50 p-2 rounded-md cursor-pointer"
                      onClick={() => toggleGroup(pair.index)}
                    >
                      <div className="flex items-center gap-2">
                        {expandedGroups[pair.index] ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                        <span className="font-medium">
                          {pair.entry?.type || 'N/A'} {pair.entry?.strike || 'N/A'} 
                          <span className="text-gray-500 ml-2 text-xs">
                            ({formatDateTime(pair.entry?.timestamp || "").time || 'N/A'} - {formatDateTime(pair.exit?.timestamp || "").time || 'N/A'})
                          </span>
                        </span>
                        {pair.exit?.exitReason && (
                          <span className="ml-2">{getExitReasonBadge(pair.exit.exitReason)}</span>
                        )}
                        {pair.entry?.reEntryNumber !== undefined && pair.entry.reEntryNumber > 0 && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            Re-entry #{pair.entry.reEntryNumber}
                          </Badge>
                        )}
                      </div>
                      <span className={`font-medium ${(pair.exit?.profitLoss || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        ${Math.abs(pair.exit?.profitLoss || 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {expandedGroups[pair.index] && (
                      <div className="mt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Action</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Strike</TableHead>
                              <TableHead>B/S</TableHead>
                              <TableHead className="text-right">Qty</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              {pair.exit?.exitReason && <TableHead>Exit Reason</TableHead>}
                              <TableHead>Position ID</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pair.entry && (
                              <TableRow>
                                <TableCell className="font-medium">Entry</TableCell>
                                <TableCell>{formatDateTime(pair.entry.timestamp || "").time || 'N/A'}</TableCell>
                                <TableCell>{pair.entry.type || 'N/A'}</TableCell>
                                <TableCell>{pair.entry.strike || 'N/A'}</TableCell>
                                <TableCell>{pair.entry.buySell || 'N/A'}</TableCell>
                                <TableCell className="text-right">{pair.entry.quantity || 'N/A'}</TableCell>
                                <TableCell className="text-right">{pair.entry.entryPrice?.toFixed(2) || 'N/A'}</TableCell>
                                {pair.exit?.exitReason && <TableCell>-</TableCell>}
                                <TableCell className="text-xs text-gray-500">{pair.entry.positionId || 'N/A'}</TableCell>
                              </TableRow>
                            )}
                            {pair.exit && (
                              <TableRow>
                                <TableCell className="font-medium">Exit</TableCell>
                                <TableCell>{formatDateTime(pair.exit.timestamp || "").time || 'N/A'}</TableCell>
                                <TableCell>{pair.exit.type || 'N/A'}</TableCell>
                                <TableCell>{pair.exit.strike || 'N/A'}</TableCell>
                                <TableCell>{pair.exit.buySell || 'N/A'}</TableCell>
                                <TableCell className="text-right">{pair.exit.quantity || 'N/A'}</TableCell>
                                <TableCell className="text-right">{pair.exit.exitPrice?.toFixed(2) || 'N/A'}</TableCell>
                                {pair.exit.exitReason && <TableCell>{getExitReasonBadge(pair.exit.exitReason)}</TableCell>}
                                <TableCell className="text-xs text-gray-500">{pair.exit.positionId || 'N/A'}</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    
                    <Separator className="my-2" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
