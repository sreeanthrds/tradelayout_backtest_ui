
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

  // Auto-select strategy if strategyId is provided in URL
  useEffect(() => {
    if (strategyId && strategies.length > 0) {
      const strategy = strategies.find(s => s.id === strategyId);
      if (strategy) {
        setValue('strategy', strategyId);
      }
    }
  }, [strategyId, strategies, setValue]);

  const isStrategyDisabled = isLoading || !!strategyId; // Disable if loading or strategyId is provided
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Configuration</CardTitle>
        <CardDescription>Set up the core parameters for your backtest</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                      {strategy.id === strategyId && " (Pre-selected)"}
                    </SelectItem>
                  ))}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => {
              const [inputValue, setInputValue] = useState(
                field.value ? format(field.value, "yyyy-MM-dd") : ""
              );

              const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setInputValue(value);
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  field.onChange(date);
                }
              };

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Input
                          type="date"
                          value={inputValue}
                          onChange={handleInputChange}
                          max={control._formValues.endDate ? format(control._formValues.endDate, "yyyy-MM-dd") : undefined}
                          className="cursor-pointer"
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-auto p-0 z-[100]" 
                      align="start"
                      side="bottom"
                      sideOffset={8}
                      avoidCollisions={false}
                      sticky="always"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setInputValue(date ? format(date, "yyyy-MM-dd") : "");
                        }}
                        disabled={(date) =>
                          date > new Date() || date > control._formValues.endDate
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="endDate"
            render={({ field }) => {
              const [inputValue, setInputValue] = useState(
                field.value ? format(field.value, "yyyy-MM-dd") : ""
              );

              const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setInputValue(value);
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  field.onChange(date);
                }
              };

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Input
                          type="date"
                          value={inputValue}
                          onChange={handleInputChange}
                          min={control._formValues.startDate ? format(control._formValues.startDate, "yyyy-MM-dd") : undefined}
                          max={format(new Date(), "yyyy-MM-dd")}
                          className="cursor-pointer"
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-auto p-0 z-[100]" 
                      align="start"
                      side="bottom"
                      sideOffset={8}
                      avoidCollisions={false}
                      sticky="always"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setInputValue(date ? format(date, "yyyy-MM-dd") : "");
                        }}
                        disabled={(date) =>
                          date > new Date() || date < control._formValues.startDate
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
