
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskData } from "./types";

interface RatiosTabProps {
  riskData: RiskData;
}

export function RatiosTab({ riskData }: RatiosTabProps) {
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
  );
}
