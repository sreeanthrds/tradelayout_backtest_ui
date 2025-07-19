import { useState, useEffect } from 'react';
import { backtestApiService, Strategy } from '@/services/BacktestApiService';

export function useStrategies(userId?: string | null) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Use userId from URL params if provided, otherwise use default API call
        const data = await backtestApiService.getStrategies(userId);
        setStrategies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch strategies');
        console.error('Error fetching strategies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategies();
  }, [userId]);

  return { strategies, isLoading, error };
}