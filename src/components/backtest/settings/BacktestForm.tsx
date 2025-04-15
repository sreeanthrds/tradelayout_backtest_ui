
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { StrategySection } from "./StrategySection";
import { CapitalSection } from "./CapitalSection";
import { TradingRulesSection } from "./TradingRulesSection";
import { SubmitButton } from "./SubmitButton";
import { formSchema, FormValues, defaultValues } from "./formSchema";

interface BacktestFormProps {
  isLoading: boolean;
  onSubmit: (data: FormValues) => void;
}

export function BacktestForm({ isLoading, onSubmit }: BacktestFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <StrategySection control={form.control} />
        <CapitalSection control={form.control} />
        <TradingRulesSection control={form.control} />

        <div className="flex justify-center gap-4">
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>
    </Form>
  );
}
