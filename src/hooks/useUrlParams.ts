import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export interface UrlParams {
  userId: string | null;
  strategyId: string | null;
}

export function useUrlParams(): UrlParams {
  const [searchParams] = useSearchParams();
  
  return useMemo(() => ({
    userId: searchParams.get('userId'),
    strategyId: searchParams.get('strategyId'),
  }), [searchParams]);
}