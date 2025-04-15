
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

export function RiskMetrics() {
  // Mock risk data - in a real application, this would come from your backtest results
  const riskData = {
    sharpeRatio: 1.42,
    sortinoRatio: 1.98,
    calmarRatio: 1.12,
    maxDrawdown: -12.5,
    maxDrawdownDuration: 45,
    volatility: 15.7,
    beta: 0.82,
    alpha: 3.2,
    winRate: 68.2,
    avgWin: 4.8,
    avgLoss: -3.2,
    largestWin: 12.5,
    largestLoss: -8.3,
    profitFactor: 2.1,
    recoveryFactor: 1.5,
    payoffRatio: 1.5,
    expectedValue: 1.89,
  };

  const radarData = [
    { subject: 'Return', A: 87, fullMark: 100 },
    { subject: 'Risk', A: 65, fullMark: 100 },
    { subject: 'Consistency', A: 78, fullMark: 100 },
    { subject: 'Drawdown', A: 73, fullMark: 100 },
    { subject: 'Win Rate', A: 85, fullMark: 100 },
    { subject: 'Profitability', A: 82, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Key Risk Metrics</CardTitle>
            <CardDescription>
              Comprehensive risk analysis of the strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ratios">
              <TabsList className="mb-4">
                <TabsTrigger value="ratios">Ratios</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
                <TabsTrigger value="drawdowns">Drawdowns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ratios">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Sharpe Ratio</TableCell>
                      <TableCell className="text-right">{riskData.sharpeRatio.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">Risk-adjusted return relative to risk-free rate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sortino Ratio</TableCell>
                      <TableCell className="text-right">{riskData.sortinoRatio.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">Return relative to harmful volatility</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Calmar Ratio</TableCell>
                      <TableCell className="text-right">{riskData.calmarRatio.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">Return relative to maximum drawdown</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Profit Factor</TableCell>
                      <TableCell className="text-right">{riskData.profitFactor.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">Gross profit divided by gross loss</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Payoff Ratio</TableCell>
                      <TableCell className="text-right">{riskData.payoffRatio.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">Average win divided by average loss</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="returns">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Win Rate</TableCell>
                      <TableCell className="text-right">{riskData.winRate.toFixed(1)}%</TableCell>
                      <TableCell className="text-muted-foreground">Percentage of trades that are profitable</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Avg Win</TableCell>
                      <TableCell className="text-right">{riskData.avgWin.toFixed(1)}%</TableCell>
                      <TableCell className="text-muted-foreground">Average return of winning trades</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Avg Loss</TableCell>
                      <TableCell className="text-right">{riskData.avgLoss.toFixed(1)}%</TableCell>
                      <TableCell className="text-muted-foreground">Average return of losing trades</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Largest Win</TableCell>
                      <TableCell className="text-right">{riskData.largestWin.toFixed(1)}%</TableCell>
                      <TableCell className="text-muted-foreground">Largest single trade gain</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Largest Loss</TableCell>
                      <TableCell className="text-right">{riskData.largestLoss.toFixed(1)}%</TableCell>
                      <TableCell className="text-muted-foreground">Largest single trade loss</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="drawdowns">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Max Drawdown</TableCell>
                      <TableCell className="text-right">{riskData.maxDrawdown.toFixed(1)}%</TableCell>
                      <TableCell className="text-muted-foreground">Maximum peak-to-trough decline</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Max Drawdown Duration</TableCell>
                      <TableCell className="text-right">{riskData.maxDrawdownDuration} days</TableCell>
                      <TableCell className="text-muted-foreground">Longest time to recover from drawdown</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Volatility</TableCell>
                      <TableCell className="text-right">{riskData.volatility.toFixed(1)}%</TableCell>
                      <TableCell className="text-muted-foreground">Standard deviation of returns</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Beta</TableCell>
                      <TableCell className="text-right">{riskData.beta.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">Correlation with market volatility</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Recovery Factor</TableCell>
                      <TableCell className="text-right">{riskData.recoveryFactor.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">Net profit divided by max drawdown</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk Profile</CardTitle>
            <CardDescription>
              Multi-factor risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Strategy"
                    dataKey="A"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
