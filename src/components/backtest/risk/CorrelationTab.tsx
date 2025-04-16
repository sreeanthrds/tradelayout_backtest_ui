
import { CorrelationMatrix } from "./CorrelationMatrix";
import { mockCorrelationData } from "./mockCorrelationData";

export function CorrelationTab() {
  return <CorrelationMatrix data={mockCorrelationData} />;
}
