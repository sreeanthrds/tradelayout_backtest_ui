
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, ArrowDownUp } from "lucide-react";

interface TradesSearchProps {
  onSearch: (query: string) => void;
}

export function TradesSearch({ onSearch }: TradesSearchProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Input 
          placeholder="Search trades..." 
          className="max-w-sm h-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <ArrowDownUp className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>
    </div>
  );
}
