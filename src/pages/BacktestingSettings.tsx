
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
    <div className="min-h-screen">
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="glass-intense rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="neomorph" 
                size="icon"
                onClick={() => navigate("/")}
                className="mr-4"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Backtest Settings
                </h1>
                <p className="text-muted-foreground mt-1">Configure parameters for your options trading backtest</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="glass-intense rounded-2xl p-6">
          <BacktestForm />
        </div>
      </div>
    </div>
  );
}
