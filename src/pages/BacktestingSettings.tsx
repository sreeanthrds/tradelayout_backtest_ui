
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User } from "lucide-react";
import { BacktestForm } from "@/components/backtest/settings/BacktestForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUrlParams, useThemeFromUrl } from "@/hooks/useUrlParams";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export default function BacktestingSettings() {
  const navigate = useNavigate();
  const { userId, strategyId } = useUrlParams();
  
  // Apply theme from URL if provided
  useThemeFromUrl();
  
  // Initialize theme sync on page load
  useEffect(() => {
    console.log('🚀 Theme sync initialized on backtesting page');
  }, []);

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
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
        <ThemeToggle />
      </div>

      <BacktestForm />
    </div>
  );
}
