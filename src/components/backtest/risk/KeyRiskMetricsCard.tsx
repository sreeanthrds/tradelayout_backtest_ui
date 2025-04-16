
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskData } from "./types";
import { RatiosTab } from "./RatiosTab";
import { ReturnsTab } from "./ReturnsTab";
import { DrawdownsTab } from "./DrawdownsTab";
import { MonteCarloTab } from "./MonteCarloTab";
import { CorrelationTab } from "./CorrelationTab";

interface KeyRiskMetricsCardProps {
  riskData: RiskData;
}

export function KeyRiskMetricsCard({ riskData }: KeyRiskMetricsCardProps) {
  return (
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
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
            <TabsTrigger value="montecarlo">Monte Carlo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ratios">
            <RatiosTab riskData={riskData} />
          </TabsContent>
          
          <TabsContent value="returns">
            <ReturnsTab riskData={riskData} />
          </TabsContent>
          
          <TabsContent value="drawdowns">
            <DrawdownsTab riskData={riskData} />
          </TabsContent>
          
          <TabsContent value="correlation">
            <CorrelationTab />
          </TabsContent>
          
          <TabsContent value="montecarlo">
            <MonteCarloTab 
              initialInvestment={10000} 
              annualReturn={riskData.sharpeRatio / 10} 
              annualVolatility={riskData.volatility / 100}
              simulationYears={3}
              simulationPaths={1000}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
