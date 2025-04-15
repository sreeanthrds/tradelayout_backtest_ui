
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Calendar as CalendarIcon, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function BacktestFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2022, 0, 1),
    to: new Date(2023, 11, 31),
  });

  const [volatilityRange, setVolatilityRange] = useState([15, 30]);

  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? "filters" : undefined}
      onValueChange={(v) => setIsOpen(v === "filters")}
      className="mb-6 border rounded-md"
    >
      <AccordionItem value="filters" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span>Backtest Parameters</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <FormLabel>Date Range</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL d, y")} -{" "}
                          {format(dateRange.to, "LLL d, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL d, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <FormLabel>Symbol</FormLabel>
              <Select defaultValue="spy">
                <SelectTrigger>
                  <SelectValue placeholder="Select symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spy">SPY</SelectItem>
                  <SelectItem value="qqq">QQQ</SelectItem>
                  <SelectItem value="iwm">IWM</SelectItem>
                  <SelectItem value="aapl">AAPL</SelectItem>
                  <SelectItem value="msft">MSFT</SelectItem>
                  <SelectItem value="amzn">AMZN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <FormLabel>Strategy</FormLabel>
              <Select defaultValue="iron_condor">
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iron_condor">Iron Condor</SelectItem>
                  <SelectItem value="bull_put_spread">Bull Put Spread</SelectItem>
                  <SelectItem value="bear_call_spread">Bear Call Spread</SelectItem>
                  <SelectItem value="short_strangle">Short Strangle</SelectItem>
                  <SelectItem value="long_straddle">Long Straddle</SelectItem>
                  <SelectItem value="butterfly">Butterfly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <FormLabel>DTE Range</FormLabel>
              <Select defaultValue="30-45">
                <SelectTrigger>
                  <SelectValue placeholder="Select DTE range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-7">0-7 days</SelectItem>
                  <SelectItem value="7-14">7-14 days</SelectItem>
                  <SelectItem value="14-30">14-30 days</SelectItem>
                  <SelectItem value="30-45">30-45 days</SelectItem>
                  <SelectItem value="45-60">45-60 days</SelectItem>
                  <SelectItem value="60+">60+ days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <FormLabel>IV Percentile Range</FormLabel>
              <div className="pt-5 px-2">
                <Slider
                  defaultValue={volatilityRange}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolatilityRange(value as number[])}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{volatilityRange[0]}%</span>
                  <span>{volatilityRange[1]}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Entry Days</FormLabel>
              <Select defaultValue="any">
                <SelectTrigger>
                  <SelectValue placeholder="Select entry days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Day</SelectItem>
                  <SelectItem value="mon">Monday</SelectItem>
                  <SelectItem value="tue">Tuesday</SelectItem>
                  <SelectItem value="wed">Wednesday</SelectItem>
                  <SelectItem value="thu">Thursday</SelectItem>
                  <SelectItem value="fri">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <FormLabel>Position Size</FormLabel>
              <Select defaultValue="fixed">
                <SelectTrigger>
                  <SelectValue placeholder="Select position sizing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Size</SelectItem>
                  <SelectItem value="percent">% of Portfolio</SelectItem>
                  <SelectItem value="risk">Risk-Based</SelectItem>
                  <SelectItem value="kelly">Kelly Criterion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <FormLabel>Exit Strategy</FormLabel>
              <Select defaultValue="profit_loss">
                <SelectTrigger>
                  <SelectValue placeholder="Select exit strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit_loss">Profit/Loss Targets</SelectItem>
                  <SelectItem value="dte">DTE-Based</SelectItem>
                  <SelectItem value="technical">Technical Indicators</SelectItem>
                  <SelectItem value="expiration">Hold to Expiration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button>
              Run Backtest
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
