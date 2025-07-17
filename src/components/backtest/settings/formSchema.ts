
import { z } from "zod";

export const formSchema = z.object({
  strategy: z.string().min(1, "Strategy is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: Partial<FormValues> = {
  strategy: "",
  startDate: new Date(2024, 0, 1), // Jan 1, 2024
  endDate: new Date(2024, 11, 31), // Dec 31, 2024
};
