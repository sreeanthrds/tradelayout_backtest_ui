
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
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
  );
}
