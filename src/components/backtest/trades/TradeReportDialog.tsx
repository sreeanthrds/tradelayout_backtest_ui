
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TradeReportDialogProps {
  trade: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeReportDialog({ trade, open, onOpenChange }: TradeReportDialogProps) {
  if (!trade) return null;
  
  const handleSubmitReport = () => {
    toast.success("Issue Reported", {
      description: "Thank you for your feedback. Our team will review this trade.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Issue</DialogTitle>
          <DialogDescription>
            Submit a report for trade {trade.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="issue-type" className="text-sm font-medium">Issue Type</label>
            <select 
              id="issue-type" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option>Data Inconsistency</option>
              <option>Incorrect Calculation</option>
              <option>Missing Information</option>
              <option>Other</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea 
              id="description" 
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Please describe the issue you found..."
            ></textarea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmitReport}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
