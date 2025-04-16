
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
