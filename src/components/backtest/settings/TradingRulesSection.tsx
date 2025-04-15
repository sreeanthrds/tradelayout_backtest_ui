
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { FormValues } from "./formSchema";

interface TradingRulesSectionProps {
  control: Control<FormValues>;
}

export function TradingRulesSection({ control }: TradingRulesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Rules</CardTitle>
        <CardDescription>Define rules for entries, exits, and risk management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
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
            control={control}
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
            control={control}
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
          control={control}
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
          control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
  );
}
