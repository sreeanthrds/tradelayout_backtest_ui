
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { StrategySection } from "./StrategySection";

import { SubmitButton } from "./SubmitButton";
import { ApiConfig } from "@/components/settings/ApiConfig";
import { formSchema, FormValues, defaultValues } from "./formSchema";
import { useBacktestSubmit } from "@/hooks/useBacktestSubmit";
import { tradeService } from "@/services/TradeDataService";

export function BacktestForm() {
  const { isLoading, submitBacktest } = useBacktestSubmit();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Restore previous parameters on component mount
  useEffect(() => {
    const previousParams = tradeService.getBacktestParameters();
    if (previousParams) {
      form.reset(previousParams);
    }
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitBacktest)} className="space-y-8">
        <ApiConfig />
        <StrategySection control={form.control} setValue={form.setValue} />
        <div className="flex justify-center gap-4">
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>
    </Form>
  );
}
