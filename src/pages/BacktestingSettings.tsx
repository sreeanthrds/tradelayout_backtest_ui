
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Play, Eye, ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  strategy: z.string().min(1, "Strategy is required"),
  symbol: z.string().min(1, "Symbol is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  initialCapital: z.coerce.number().min(1, "Initial capital must be at least 1"),
  positionSize: z.coerce.number().min(1, "Position size must be at least 1"),
  maxTradesPerDay: z.coerce.number().int().min(1, "Max trades per day must be at least 1"),
  stopLoss: z.coerce.number().min(0, "Stop loss must be at least 0"),
  takeProfit: z.coerce.number().min(0, "Take profit must be at least 0"),
  commissionPerTrade: z.coerce.number().min(0, "Commission must be at least 0"),
  includeDividends: z.boolean().default(false),
  useMarketHoursOnly: z.boolean().default(true),
  riskManagementEnabled: z.boolean().default(true),
  volatilityAdjustment: z.number().min(0).max(100).default(50),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<FormValues> = {
  strategy: "Iron Condor",
  symbol: "SPY",
  startDate: new Date(2022, 0, 1), // Jan 1, 2022
  endDate: new Date(2023, 11, 31), // Dec 31, 2023
  initialCapital: 10000,
  positionSize: 5,
  maxTradesPerDay: 3,
  stopLoss: 25,
  takeProfit: 50,
  commissionPerTrade: 0.65,
  includeDividends: false,
  useMarketHoursOnly: true,
  riskManagementEnabled: true,
  volatilityAdjustment: 50,
};

const strategyOptions = [
  { value: "Iron Condor", label: "Iron Condor" },
  { value: "Covered Call", label: "Covered Call" },
  { value: "Cash-Secured Put", label: "Cash-Secured Put" },
  { value: "Butterfly Spread", label: "Butterfly Spread" },
  { value: "Vertical Spread", label: "Vertical Spread" },
];

const symbolOptions = [
  { value: "SPY", label: "SPY - S&P 500 ETF" },
  { value: "QQQ", label: "QQQ - Nasdaq 100 ETF" },
  { value: "IWM", label: "IWM - Russell 2000 ETF" },
  { value: "AAPL", label: "AAPL - Apple Inc." },
  { value: "MSFT", label: "MSFT - Microsoft Corp." },
  { value: "GOOGL", label: "GOOGL - Alphabet Inc." },
  { value: "AMZN", label: "AMZN - Amazon.com Inc." },
  { value: "TSLA", label: "TSLA - Tesla Inc." },
];

export default function BacktestingSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [backtestComplete, setBacktestComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    // Simulate API call or processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Log the submitted data (would be sent to an API in a real app)
    console.log("Running backtest with parameters:", data);
    
    setIsLoading(false);
    setBacktestComplete(true);
    
    toast({
      title: "Backtest Completed",
      description: `Successfully ran ${data.strategy} backtest on ${data.symbol}`,
    });
  };

  const viewResults = () => {
    navigate("/backtest-results");
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/")}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backtest Settings</h1>
          <p className="text-muted-foreground">Configure parameters for your options trading backtest</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Configuration</CardTitle>
              <CardDescription>Set up the core parameters for your backtest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="strategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a strategy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {strategyOptions.map((strategy) => (
                            <SelectItem key={strategy.value} value={strategy.value}>
                              {strategy.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a symbol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {symbolOptions.map((symbol) => (
                            <SelectItem key={symbol.value} value={symbol.value}>
                              {symbol.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date > form.getValues().endDate
                            }
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < form.getValues().startDate
                            }
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capital & Position Sizing</CardTitle>
              <CardDescription>Configure your account and risk parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="initialCapital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Capital ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Starting capital for the backtest
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="positionSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Size (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Percentage of capital per position
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trading Rules</CardTitle>
              <CardDescription>Define rules for entries, exits, and risk management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="maxTradesPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Trades Per Day</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stopLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stop Loss (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="takeProfit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Take Profit (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="commissionPerTrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Per Trade ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} step="0.01" />
                    </FormControl>
                    <FormDescription>
                      Fee charged per trade (one-way)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volatilityAdjustment"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Volatility Adjustment</FormLabel>
                    <FormControl>
                      <div className="space-y-0.5">
                        <Slider
                          value={[value]}
                          onValueChange={([newValue]) => onChange(newValue)}
                          max={100}
                          step={1}
                          {...field}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Conservative</span>
                          <span>{value}%</span>
                          <span>Aggressive</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Adjusts position size based on market volatility
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="includeDividends"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Include Dividends</FormLabel>
                        <FormDescription>
                          Factor dividend payments into returns
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useMarketHoursOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Market Hours Only</FormLabel>
                        <FormDescription>
                          Restrict to regular trading hours
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="riskManagementEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Risk Management</FormLabel>
                        <FormDescription>
                          Enable position sizing rules
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            {!backtestComplete ? (
              <Button 
                type="submit" 
                size="lg" 
                disabled={isLoading}
                className="w-64"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running Backtest...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Run Backtest
                  </span>
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                size="lg" 
                onClick={viewResults}
                className="w-64"
              >
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Backtest Results
                </span>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
