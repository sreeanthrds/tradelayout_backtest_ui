
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiskProfileChart } from "./RiskProfileChart";
import { RadarDataItem } from "./types";

interface RiskProfileCardProps {
  radarData: RadarDataItem[];
}

export function RiskProfileCard({ radarData }: RiskProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Profile</CardTitle>
        <CardDescription>
          Multi-factor risk assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RiskProfileChart radarData={radarData} />
      </CardContent>
    </Card>
  );
}
