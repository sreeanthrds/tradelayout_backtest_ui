
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskData } from "./types";

interface ReturnsTabProps {
  riskData: RiskData;
}

export function ReturnsTab({ riskData }: ReturnsTabProps) {
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
  );
}
