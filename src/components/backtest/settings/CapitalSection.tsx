
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormValues } from "./formSchema";

interface CapitalSectionProps {
  control: Control<FormValues>;
}

export function CapitalSection({ control }: CapitalSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital & Position Sizing</CardTitle>
        <CardDescription>Configure your account and risk parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
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
            control={control}
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
  );
}
