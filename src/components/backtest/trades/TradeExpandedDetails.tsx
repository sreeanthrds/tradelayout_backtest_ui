
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ArrowRight, BarChart2, Clock, DollarSign, FileText } from "lucide-react";
import { TradeDocumentUploader } from "./TradeDocumentUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradeExpandedDetailsProps {
  trade: any;
}

export function TradeExpandedDetails({ trade }: TradeExpandedDetailsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [extractedData, setExtractedData] = useState<any>(null);
  
  // Mock transactions data for illustration
  const transactions = extractedData?.extractedData?.transactions || [
    {
      id: `${trade.id}-1`,
      date: "2023-01-15 09:30:45",
      action: "BUY",
      quantity: 100,
      price: trade.entryPrice,
      total: trade.entryPrice * 100,
      fees: 5.99
    },
    {
      id: `${trade.id}-2`,
      date: "2023-01-17 10:45:22",
      action: "SELL",
      quantity: 50,
      price: trade.exitPrice + 0.35,
      total: (trade.exitPrice + 0.35) * 50,
      fees: 5.99
    },
    {
      id: `${trade.id}-3`,
      date: "2023-01-18 15:22:10",
      action: "SELL",
      quantity: 50,
      price: trade.exitPrice,
      total: trade.exitPrice * 50,
      fees: 5.99
    }
  ];

  const handleProcessComplete = (data: any) => {
    console.log("PDF processing complete:", data);
    setExtractedData(data);
    // If data was successfully extracted, switch to the transactions tab
    if (data?.extractedData) {
      setActiveTab("transactions");
    }
  };

  return (
    <div className="px-4 py-2 bg-muted/30 border-t">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
                      <p className="font-medium">{trade.date} - Entry</p>
                      <p className="text-muted-foreground">
                        Entered position at ${trade.entryPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">{trade.date} - Exit</p>
                      <p className="text-muted-foreground">
                        Exited position at ${trade.exitPrice.toFixed(2)}
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
                  <span className={`font-medium ${trade.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    ${Math.abs(trade.pnl).toFixed(2)} ({trade.pnlPercent}%)
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Holding Period:</span>
                  <span className="font-medium">3 days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Max Drawdown:</span>
                  <span className="font-medium text-red-600">-2.5%</span>
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
                Transactions
              </CardTitle>
              {extractedData && (
                <CardDescription>
                  Data extracted from uploaded document
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Fees</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className={transaction.action === "BUY" ? "text-blue-600" : "text-purple-600"}>
                        {transaction.action}
                      </TableCell>
                      <TableCell className="text-right">{transaction.quantity}</TableCell>
                      <TableCell className="text-right">${transaction.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${transaction.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${transaction.fees.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <TradeDocumentUploader 
            tradeId={trade.id} 
            onProcessComplete={handleProcessComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
