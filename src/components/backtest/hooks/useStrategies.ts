import { useState, useEffect } from 'react';
import { backtestApiService, Strategy } from '@/services/BacktestApiService';

export function useStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await backtestApiService.getStrategies();
        setStrategies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch strategies');
        console.error('Error fetching strategies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  return { strategies, isLoading, error };
}