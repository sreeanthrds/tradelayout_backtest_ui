
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { StrategySection } from "./StrategySection";
import { CapitalSection } from "./CapitalSection";
import { SubmitButton } from "./SubmitButton";
import { formSchema, FormValues, defaultValues } from "./formSchema";
import { useBacktestSubmit } from "@/hooks/useBacktestSubmit";

export function BacktestForm() {
  const { isLoading, submitBacktest } = useBacktestSubmit();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitBacktest)} className="space-y-8">
        <StrategySection control={form.control} />
        <CapitalSection control={form.control} />

        <div className="flex justify-center gap-4">
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>
    </Form>
  );
}
