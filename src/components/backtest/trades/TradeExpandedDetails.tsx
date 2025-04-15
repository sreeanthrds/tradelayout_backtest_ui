
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ArrowRight, BarChart2, Clock, DollarSign, ChevronDown, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TradeExpandedDetailsProps {
  trade: any;
}

export function TradeExpandedDetails({ trade }: TradeExpandedDetailsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  // Organize transactions by trade ID (grouping parent and child transactions)
  const transactions = getFormattedTransactions(trade.id);
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

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
            </CardHeader>
            <CardContent>
              {transactions.map((group) => (
                <div key={group.id} className="mb-4">
                  <div 
                    className="flex items-center justify-between bg-muted/50 p-2 rounded-md cursor-pointer"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedGroups[group.id] ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                      <span className="font-medium">Trade {group.id} - {group.date}</span>
                    </div>
                    <span className={`font-medium ${parseFloat(group.pnl) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      ${Math.abs(parseFloat(group.pnl)).toFixed(2)}
                    </span>
                  </div>
                  
                  {expandedGroups[group.id] && (
                    <div className="mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Index</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Strike</TableHead>
                            <TableHead>B/S</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Entry</TableHead>
                            <TableHead className="text-right">Exit</TableHead>
                            <TableHead className="text-right">P&L</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.transactions.map((transaction) => (
                            <TableRow key={transaction.index}>
                              <TableCell>{transaction.index}</TableCell>
                              <TableCell>{transaction.entryDate}</TableCell>
                              <TableCell>{transaction.entryTime}</TableCell>
                              <TableCell>{transaction.type}</TableCell>
                              <TableCell>{transaction.strike}</TableCell>
                              <TableCell>{transaction.bs}</TableCell>
                              <TableCell className="text-right">{transaction.qty}</TableCell>
                              <TableCell className="text-right">{transaction.entryPrice}</TableCell>
                              <TableCell className="text-right">{transaction.exitPrice}</TableCell>
                              <TableCell className={`text-right font-medium ${parseFloat(transaction.pnl) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                {transaction.pnl}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Function to format the provided transaction data
function getFormattedTransactions(tradeId: string) {
  // This would typically come from your API or database
  // For now, we're using the provided static data
  
  const tradeData = [
    {
      id: "1",
      date: "2024-04-16",
      vix: "12.55",
      pnl: "-26025.00",
      transactions: [
        { index: "1.1", entryDate: "2024-04-16", entryTime: "10:08:00", exitDate: "2024-04-16", exitTime: "10:13:00", type: "CE", strike: "22200", bs: "Buy", qty: "750", entryPrice: "87.10", exitPrice: "82.75", pnl: "-3262.50" },
        { index: "1.2", entryDate: "2024-04-16", entryTime: "09:46:00", exitDate: "2024-04-16", exitTime: "09:49:00", type: "PE", strike: "22200", bs: "Buy", qty: "750", entryPrice: "104.45", exitPrice: "99.25", pnl: "-3900.00" },
        { index: "1.3", entryDate: "2024-04-16", entryTime: "09:50:00", exitDate: "2024-04-16", exitTime: "09:52:00", type: "PE", strike: "22200", bs: "Buy", qty: "750", entryPrice: "104.45", exitPrice: "99.25", pnl: "-3900.00" },
        { index: "1.4", entryDate: "2024-04-16", entryTime: "10:23:00", exitDate: "2024-04-16", exitTime: "10:27:00", type: "PE", strike: "22200", bs: "Buy", qty: "750", entryPrice: "104.45", exitPrice: "99.25", pnl: "-3900.00" },
        { index: "1.5", entryDate: "2024-04-16", entryTime: "10:38:00", exitDate: "2024-04-16", exitTime: "10:39:00", type: "CE", strike: "22200", bs: "Buy", qty: "750", entryPrice: "87.10", exitPrice: "82.75", pnl: "-3262.50" },
        { index: "1.6", entryDate: "2024-04-16", entryTime: "12:03:00", exitDate: "2024-04-16", exitTime: "12:12:00", type: "PE", strike: "22200", bs: "Buy", qty: "750", entryPrice: "104.45", exitPrice: "99.25", pnl: "-3900.00" },
        { index: "1.7", entryDate: "2024-04-16", entryTime: "12:21:00", exitDate: "2024-04-16", exitTime: "12:22:00", type: "PE", strike: "22200", bs: "Buy", qty: "750", entryPrice: "104.45", exitPrice: "99.25", pnl: "-3900.00" }
      ]
    },
    {
      id: "2",
      date: "2024-04-18",
      vix: "12.22",
      pnl: "-31687.50",
      transactions: [
        { index: "2.1", entryDate: "2024-04-18", entryTime: "11:07:00", exitDate: "2024-04-18", exitTime: "11:08:00", type: "CE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "42.70", exitPrice: "40.55", pnl: "-1612.50" },
        { index: "2.2", entryDate: "2024-04-18", entryTime: "09:47:00", exitDate: "2024-04-18", exitTime: "09:51:00", type: "PE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "100.10", exitPrice: "95.10", pnl: "-3750.00" },
        { index: "2.3", entryDate: "2024-04-18", entryTime: "10:09:00", exitDate: "2024-04-18", exitTime: "10:10:00", type: "PE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "100.10", exitPrice: "88.60", pnl: "-8625.00" },
        { index: "2.4", entryDate: "2024-04-18", entryTime: "10:13:00", exitDate: "2024-04-18", exitTime: "10:14:00", type: "PE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "100.10", exitPrice: "95.10", pnl: "-3750.00" },
        { index: "2.5", entryDate: "2024-04-18", entryTime: "10:15:00", exitDate: "2024-04-18", exitTime: "10:35:00", type: "PE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "100.10", exitPrice: "95.10", pnl: "-3750.00" },
        { index: "2.6", entryDate: "2024-04-18", entryTime: "10:48:00", exitDate: "2024-04-18", exitTime: "10:49:00", type: "PE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "100.10", exitPrice: "95.10", pnl: "-3750.00" },
        { index: "2.7", entryDate: "2024-04-18", entryTime: "11:09:00", exitDate: "2024-04-18", exitTime: "11:31:00", type: "CE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "42.70", exitPrice: "40.55", pnl: "-1612.50" },
        { index: "2.8", entryDate: "2024-04-18", entryTime: "11:44:00", exitDate: "2024-04-18", exitTime: "11:45:00", type: "CE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "42.70", exitPrice: "40.55", pnl: "-1612.50" },
        { index: "2.9", entryDate: "2024-04-18", entryTime: "11:48:00", exitDate: "2024-04-18", exitTime: "13:28:00", type: "CE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "42.70", exitPrice: "40.55", pnl: "-1612.50" },
        { index: "2.10", entryDate: "2024-04-18", entryTime: "13:29:00", exitDate: "2024-04-18", exitTime: "13:30:00", type: "CE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "42.70", exitPrice: "40.55", pnl: "-1612.50" }
      ]
    },
    {
      id: "3",
      date: "2024-04-19",
      vix: "13.99",
      pnl: "81562.50",
      transactions: [
        { index: "3.1", entryDate: "2024-04-19", entryTime: "09:48:00", exitDate: "2024-04-19", exitTime: "09:49:00", type: "CE", strike: "21850", bs: "Buy", qty: "750", entryPrice: "199.75", exitPrice: "189.75", pnl: "-7500.00" },
        { index: "3.2", entryDate: "2024-04-19", entryTime: "09:52:00", exitDate: "2024-04-19", exitTime: "09:55:00", type: "CE", strike: "21850", bs: "Buy", qty: "750", entryPrice: "199.75", exitPrice: "189.75", pnl: "-7500.00" },
        { index: "3.3", entryDate: "2024-04-19", entryTime: "10:02:00", exitDate: "2024-04-19", exitTime: "10:12:00", type: "CE", strike: "21850", bs: "Buy", qty: "750", entryPrice: "199.75", exitPrice: "189.75", pnl: "-7500.00" },
        { index: "3.4", entryDate: "2024-04-19", entryTime: "10:14:00", exitDate: "2024-04-19", exitTime: "10:25:00", type: "CE", strike: "21850", bs: "Buy", qty: "750", entryPrice: "199.75", exitPrice: "189.75", pnl: "-7500.00" },
        { index: "3.5", entryDate: "2024-04-19", entryTime: "11:23:00", exitDate: "2024-04-19", exitTime: "14:56:00", type: "CE", strike: "21850", bs: "Buy", qty: "750", entryPrice: "199.75", exitPrice: "348.50", pnl: "111562.50" }
      ]
    },
    {
      id: "4",
      date: "2024-04-22",
      vix: "12.99",
      pnl: "8775.00",
      transactions: [
        { index: "4.1", entryDate: "2024-04-22", entryTime: "10:53:00", exitDate: "2024-04-22", exitTime: "14:56:00", type: "CE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "126.10", exitPrice: "162.10", pnl: "27000.00" },
        { index: "4.2", entryDate: "2024-04-22", entryTime: "09:47:00", exitDate: "2024-04-22", exitTime: "09:49:00", type: "PE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "161.90", exitPrice: "153.80", pnl: "-6075.00" },
        { index: "4.3", entryDate: "2024-04-22", entryTime: "09:50:00", exitDate: "2024-04-22", exitTime: "09:51:00", type: "PE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "161.90", exitPrice: "153.80", pnl: "-6075.00" },
        { index: "4.4", entryDate: "2024-04-22", entryTime: "09:54:00", exitDate: "2024-04-22", exitTime: "09:57:00", type: "PE", strike: "22250", bs: "Buy", qty: "750", entryPrice: "161.90", exitPrice: "153.80", pnl: "-6075.00" }
      ]
    },
    {
      id: "5",
      date: "2024-04-23",
      vix: "10.43",
      pnl: "-24000.00",
      transactions: [
        { index: "5.1", entryDate: "2024-04-23", entryTime: "10:04:00", exitDate: "2024-04-23", exitTime: "10:27:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "97.60", exitPrice: "92.70", pnl: "-3675.00" },
        { index: "5.2", entryDate: "2024-04-23", entryTime: "09:48:00", exitDate: "2024-04-23", exitTime: "09:51:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "122.45", exitPrice: "116.35", pnl: "-4575.00" },
        { index: "5.3", entryDate: "2024-04-23", entryTime: "10:50:00", exitDate: "2024-04-23", exitTime: "10:54:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "122.45", exitPrice: "116.35", pnl: "-4575.00" },
        { index: "5.4", entryDate: "2024-04-23", entryTime: "12:10:00", exitDate: "2024-04-23", exitTime: "12:30:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "97.60", exitPrice: "92.70", pnl: "-3675.00" },
        { index: "5.5", entryDate: "2024-04-23", entryTime: "12:42:00", exitDate: "2024-04-23", exitTime: "12:44:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "97.65", exitPrice: "92.75", pnl: "-3675.00" },
        { index: "5.6", entryDate: "2024-04-23", entryTime: "14:22:00", exitDate: "2024-04-23", exitTime: "14:23:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "97.60", exitPrice: "92.50", pnl: "-3825.00" }
      ]
    },
    {
      id: "6",
      date: "2024-04-24",
      vix: "10.34",
      pnl: "-10312.50",
      transactions: [
        { index: "6.1", entryDate: "2024-04-24", entryTime: "09:46:00", exitDate: "2024-04-24", exitTime: "14:34:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "82.60", exitPrice: "78.45", pnl: "-3112.50" },
        { index: "6.2", entryDate: "2024-04-24", entryTime: "14:34:00", exitDate: "2024-04-24", exitTime: "14:35:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "63.60", exitPrice: "60.40", pnl: "-2400.00" },
        { index: "6.3", entryDate: "2024-04-24", entryTime: "14:36:00", exitDate: "2024-04-24", exitTime: "14:42:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "63.60", exitPrice: "60.40", pnl: "-2400.00" },
        { index: "6.4", entryDate: "2024-04-24", entryTime: "14:43:00", exitDate: "2024-04-24", exitTime: "14:45:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "63.60", exitPrice: "60.40", pnl: "-2400.00" }
      ]
    },
    {
      id: "7",
      date: "2024-04-25",
      vix: "10.46",
      pnl: "-26250.00",
      transactions: [
        { index: "7.1", entryDate: "2024-04-25", entryTime: "09:47:00", exitDate: "2024-04-25", exitTime: "09:48:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "62.50", exitPrice: "59.40", pnl: "-2325.00" },
        { index: "7.2", entryDate: "2024-04-25", entryTime: "10:52:00", exitDate: "2024-04-25", exitTime: "10:53:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "53.90", exitPrice: "51.20", pnl: "-2025.00" },
        { index: "7.3", entryDate: "2024-04-25", entryTime: "09:56:00", exitDate: "2024-04-25", exitTime: "09:58:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "62.50", exitPrice: "59.40", pnl: "-2325.00" },
        { index: "7.4", entryDate: "2024-04-25", entryTime: "10:00:00", exitDate: "2024-04-25", exitTime: "10:01:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "62.50", exitPrice: "59.40", pnl: "-2325.00" },
        { index: "7.5", entryDate: "2024-04-25", entryTime: "10:02:00", exitDate: "2024-04-25", exitTime: "10:52:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "62.50", exitPrice: "59.40", pnl: "-2325.00" },
        { index: "7.6", entryDate: "2024-04-25", entryTime: "11:08:00", exitDate: "2024-04-25", exitTime: "11:22:00", type: "CE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "62.50", exitPrice: "59.40", pnl: "-2325.00" },
        { index: "7.7", entryDate: "2024-04-25", entryTime: "11:07:00", exitDate: "2024-04-25", exitTime: "11:08:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "53.90", exitPrice: "48.20", pnl: "-4275.00" },
        { index: "7.8", entryDate: "2024-04-25", entryTime: "11:22:00", exitDate: "2024-04-25", exitTime: "11:23:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "53.90", exitPrice: "51.20", pnl: "-2025.00" },
        { index: "7.9", entryDate: "2024-04-25", entryTime: "12:26:00", exitDate: "2024-04-25", exitTime: "12:27:00", type: "PE", strike: "22400", bs: "Buy", qty: "750", entryPrice: "53.90", exitPrice: "45.50", pnl: "-6300.00" }
      ]
    },
    {
      id: "8",
      date: "2024-04-26",
      vix: "10.84",
      pnl: "30562.50",
      transactions: [
        { index: "8.1", entryDate: "2024-04-26", entryTime: "09:51:00", exitDate: "2024-04-26", exitTime: "14:56:00", type: "PE", strike: "22600", bs: "Buy", qty: "750", entryPrice: "137.60", exitPrice: "178.35", pnl: "30562.50" }
      ]
    },
    {
      id: "9",
      date: "2024-04-29",
      vix: "11.89",
      pnl: "33187.50",
      transactions: [
        { index: "9.1", entryDate: "2024-04-29", entryTime: "10:20:00", exitDate: "2024-04-29", exitTime: "10:51:00", type: "CE", strike: "22500", bs: "Buy", qty: "750", entryPrice: "158.55", exitPrice: "150.60", pnl: "-5962.50" },
        { index: "9.2", entryDate: "2024-04-29", entryTime: "09:46:00", exitDate: "2024-04-29", exitTime: "10:08:00", type: "PE", strike: "22500", bs: "Buy", qty: "750", entryPrice: "95.00", exitPrice: "90.25", pnl: "-3562.50" },
        { index: "9.3", entryDate: "2024-04-29", entryTime: "10:54:00", exitDate: "2024-04-29", exitTime: "14:56:00", type: "CE", strike: "22500", bs: "Buy", qty: "750", entryPrice: "158.55", exitPrice: "215.50", pnl: "42712.50" }
      ]
    },
    {
      id: "10",
      date: "2024-04-30",
      vix: "12.53",
      pnl: "-26925.00",
      transactions: [
        { index: "10.1", entryDate: "2024-04-30", entryTime: "09:50:00", exitDate: "2024-04-30", exitTime: "10:09:00", type: "CE", strike: "22700", bs: "Buy", qty: "750", entryPrice: "112.00", exitPrice: "106.40", pnl: "-4200.00" },
        { index: "10.2", entryDate: "2024-04-30", entryTime: "14:52:00", exitDate: "2024-04-30", exitTime: "14:53:00", type: "PE", strike: "22700", bs: "Buy", qty: "750", entryPrice: "78.80", exitPrice: "74.85", pnl: "-2962.50" },
        { index: "10.3", entryDate: "2024-04-30", entryTime: "10:13:00", exitDate: "2024-04-30", exitTime: "11:07:00", type: "CE", strike: "22700", bs: "Buy", qty: "750", entryPrice: "112.00", exitPrice: "106.40", pnl: "-4200.00" },
        { index: "10.4", entryDate: "2024-04-30", entryTime: "11:08:00", exitDate: "2024-04-30", exitTime: "13:09:00", type: "CE", strike: "22700", bs: "Buy", qty: "750", entryPrice: "112.00", exitPrice: "106.40", pnl: "-4200.00" },
        { index: "10.5", entryDate: "2024-04-30", entryTime: "13:29:00", exitDate: "2024-04-30", exitTime: "14:42:00", type: "CE", strike: "22700", bs: "Buy", qty: "750", entryPrice: "112.00", exitPrice: "106.40", pnl: "-4200.00" },
        { index: "10.6", entryDate: "2024-04-30", entryTime: "14:43:00", exitDate: "2024-04-30", exitTime: "14:45:00", type: "CE", strike: "22700", bs: "Buy", qty: "750", entryPrice: "112.00", exitPrice: "106.40", pnl: "-4200.00" },
        { index: "10.7", entryDate: "2024-04-30", entryTime: "14:54:00", exitDate: "2024-04-30", exitTime: "14:55:00", type: "PE", strike: "22700", bs: "Buy", qty: "750", entryPrice: "78.80", exitPrice: "74.85", pnl: "-2962.50" }
      ]
    }
  ];
  
  // In a real application, you might filter by the tradeId
  return tradeData;
}
