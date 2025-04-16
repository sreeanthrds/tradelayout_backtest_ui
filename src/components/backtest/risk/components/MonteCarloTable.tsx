
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SimulationResults } from "../hooks/useMonteCarloSimulation";

interface MonteCarloTableProps {
  results: SimulationResults;
}

export function MonteCarloTable({ results }: MonteCarloTableProps) {
  // Calculate growth rates for the table
  const calculateGrowthRate = (finalValue: number) => {
    const years = results.stats.years;
    return (Math.pow(finalValue / results.stats.initialInvestment, 1 / years) - 1) * 100;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Percentile</TableHead>
            <TableHead className="text-right">Final Value</TableHead>
            <TableHead className="text-right">Annualized Return</TableHead>
            <TableHead className="text-right">Total Return</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">5th (Worst)</TableCell>
            <TableCell className="text-right">${results.stats.percentiles.p5.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
            <TableCell className="text-right">{calculateGrowthRate(results.stats.percentiles.p5).toFixed(2)}%</TableCell>
            <TableCell className="text-right">{((results.stats.percentiles.p5 / results.stats.initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">25th</TableCell>
            <TableCell className="text-right">${results.stats.percentiles.p25.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
            <TableCell className="text-right">{calculateGrowthRate(results.stats.percentiles.p25).toFixed(2)}%</TableCell>
            <TableCell className="text-right">{((results.stats.percentiles.p25 / results.stats.initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">50th (Median)</TableCell>
            <TableCell className="text-right">${results.stats.percentiles.p50.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
            <TableCell className="text-right">{calculateGrowthRate(results.stats.percentiles.p50).toFixed(2)}%</TableCell>
            <TableCell className="text-right">{((results.stats.percentiles.p50 / results.stats.initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">75th</TableCell>
            <TableCell className="text-right">${results.stats.percentiles.p75.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
            <TableCell className="text-right">{calculateGrowthRate(results.stats.percentiles.p75).toFixed(2)}%</TableCell>
            <TableCell className="text-right">{((results.stats.percentiles.p75 / results.stats.initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">95th (Best)</TableCell>
            <TableCell className="text-right">${results.stats.percentiles.p95.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
            <TableCell className="text-right">{calculateGrowthRate(results.stats.percentiles.p95).toFixed(2)}%</TableCell>
            <TableCell className="text-right">{((results.stats.percentiles.p95 / results.stats.initialInvestment - 1) * 100).toFixed(2)}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
