
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskData } from "./types";

interface DrawdownsTabProps {
  riskData: RiskData;
}

export function DrawdownsTab({ riskData }: DrawdownsTabProps) {
  return (
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
  );
}
