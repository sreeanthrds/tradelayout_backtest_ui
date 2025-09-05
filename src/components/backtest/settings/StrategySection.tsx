
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { FormValues } from "./formSchema";
import { useStrategies } from "../hooks/useStrategies";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useEffect, useState } from "react";

interface StrategySectionProps {
  control: Control<FormValues>;
  setValue: (name: keyof FormValues, value: any) => void;
}

export function StrategySection({ control, setValue }: StrategySectionProps) {
  const { userId, strategyId } = useUrlParams();
  const { strategies, isLoading, error } = useStrategies(userId);
  const [hasSetInitialStrategy, setHasSetInitialStrategy] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('StrategySection render - strategyId:', strategyId, 'strategies:', strategies.length, 'isLoading:', isLoading);
  }, [strategyId, strategies, isLoading]);

  // Auto-select strategy if strategyId is provided in URL
  useEffect(() => {
    if (strategyId && strategies.length > 0 && !hasSetInitialStrategy) {
      const strategy = strategies.find(s => s.id === strategyId);
      if (strategy) {
        console.log('Setting strategy from URL:', strategyId, 'Strategy found:', strategy.name);
        setValue('strategy', strategyId);
        setHasSetInitialStrategy(true);
      } else {
        console.warn('Strategy ID from URL not found in available strategies:', strategyId);
        console.log('Available strategies:', strategies.map(s => ({ id: s.id, name: s.name })));
      }
    }
  }, [strategyId, strategies, setValue, hasSetInitialStrategy]);

  const isStrategyDisabled = isLoading || !!strategyId; // Disable if loading or strategyId is provided
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Strategy Configuration</CardTitle>
        <CardDescription className="text-sm">Set up the core parameters for your backtest</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <FormField
          control={control}
          name="strategy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strategy</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={isStrategyDisabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={
                        isLoading ? (
                          <div className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading strategies...
                          </div>
                        ) : strategyId ? 
                          "Strategy pre-selected" : 
                          "Select a strategy"
                      } 
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {strategies.length === 0 && !isLoading ? (
                    <SelectItem value="no-strategies" disabled>
                      {error ? "API connection failed - check settings" : "No strategies found"}
                    </SelectItem>
                  ) : (
                    strategies.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        {strategy.name}
                        {strategy.id === strategyId && " (Pre-selected)"}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {strategyId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Strategy automatically selected from URL parameter
                </p>
              )}
              {error && <p className="text-sm text-destructive mt-1">Error: {error}</p>}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            const date = new Date(value);
                            if (!isNaN(date.getTime())) {
                              field.onChange(date);
                            }
                          }
                        }}
                        max={control._formValues.endDate ? format(control._formValues.endDate, "yyyy-MM-dd") : undefined}
                        className="cursor-pointer h-9 text-sm"
                      />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-1 z-[100] max-h-[60vh] overflow-auto" 
                    align="start"
                    side="top"
                    sideOffset={4}
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date > control._formValues.endDate
                      }
                      defaultMonth={control._formValues.endDate || field.value || new Date()}
                      initialFocus
                      className={cn("p-2 pointer-events-auto")}
                      classNames={{
                        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
                        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                        cell: "h-8 w-8 text-center text-sm p-0 relative",
                        caption_label: "text-xs font-medium",
                        table: "w-full border-collapse space-y-0.5",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            const date = new Date(value);
                            if (!isNaN(date.getTime())) {
                              field.onChange(date);
                            }
                          }
                        }}
                        min={control._formValues.startDate ? format(control._formValues.startDate, "yyyy-MM-dd") : undefined}
                        max={format(new Date(), "yyyy-MM-dd")}
                        className="cursor-pointer h-9 text-sm"
                      />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-1 z-[100] max-h-[60vh] overflow-auto" 
                    align="start"
                    side="top"
                    sideOffset={4}
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < control._formValues.startDate
                      }
                      defaultMonth={field.value || control._formValues.startDate || new Date()}
                      initialFocus
                      className={cn("p-2 pointer-events-auto")}
                      classNames={{
                        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
                        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                        cell: "h-8 w-8 text-center text-sm p-0 relative",
                        caption_label: "text-xs font-medium",
                        table: "w-full border-collapse space-y-0.5",
                      }}
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
  );
}
