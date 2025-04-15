
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { BacktestForm } from "@/components/backtest/settings/BacktestForm";

export default function BacktestingSettings() {
  const navigate = useNavigate();

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

      <BacktestForm />
    </div>
  );
}
