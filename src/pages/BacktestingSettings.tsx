
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { BacktestForm } from "@/components/backtest/settings/BacktestForm";
import { FormValues } from "@/components/backtest/settings/formSchema";

export default function BacktestingSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    // Simulate API call or processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Log the submitted data (would be sent to an API in a real app)
    console.log("Running backtest with parameters:", data);
    
    setIsLoading(false);
    
    toast({
      title: "Backtest Completed",
      description: `Successfully ran ${data.strategy} backtest on ${data.symbol}`,
    });

    // Automatically redirect to results page
    navigate("/backtest-results");
  };

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

      <BacktestForm 
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
    </div>
  );
}
