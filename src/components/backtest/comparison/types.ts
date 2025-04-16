
// Define types for comparison components

export interface ComparisonDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface MetricsDataPoint {
  metric: string;
  [key: string]: string | number;
}

export interface StrategyColors {
  [key: string]: string;
}

export interface PerformanceComparisonChartProps {
  comparisonData: ComparisonDataPoint[];
  selectedStrategies: string[];
}

export interface MetricsComparisonTableProps {
  metricsComparisonData: MetricsDataPoint[];
  selectedStrategies: string[];
}

export interface StrategySelectorProps {
  selectedStrategies: string[];
  availableStrategies: string[];
  onAddStrategy: (strategy: string) => void;
  onRemoveStrategy: (strategy: string) => void;
}

export interface ComparisonData {
  performanceData: ComparisonDataPoint[];
  metricsData: MetricsDataPoint[];
}
