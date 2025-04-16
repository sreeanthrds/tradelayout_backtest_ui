
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { strategyColors } from "./comparisonUtils";
import { StrategySelectorProps } from "./types";

export function ComparisonStrategySelector({
  selectedStrategies,
  availableStrategies,
  onAddStrategy,
  onRemoveStrategy,
}: StrategySelectorProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 flex-wrap">
        <ScrollArea className="max-w-[600px]">
          <div className="flex gap-2">
            {selectedStrategies.map((strategy) => (
              <Badge
                key={strategy}
                variant="secondary"
                className="px-3 py-1 flex items-center gap-1"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: strategyColors[strategy] }}
                ></span>
                {strategy}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-muted"
                  onClick={() => onRemoveStrategy(strategy)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </ScrollArea>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Strategy
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {availableStrategies
              .filter((s) => !selectedStrategies.includes(s))
              .map((strategy) => (
                <DropdownMenuItem
                  key={strategy}
                  onClick={() => onAddStrategy(strategy)}
                >
                  <span
                    className="h-2 w-2 rounded-full mr-2"
                    style={{ backgroundColor: strategyColors[strategy] }}
                  ></span>
                  {strategy}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
