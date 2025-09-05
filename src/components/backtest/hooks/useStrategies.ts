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
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch strategies';
        setError(errorMessage);
        console.error('Error fetching strategies:', err);
        
        // Provide fallback strategies when API fails
        console.log('Using fallback strategies due to API error');
        setStrategies([
          { id: "My New Strategy", name: "My New Strategy" },
          { id: "My New Strategy1", name: "My New Strategy1" },
          { id: "My New Strategy2", name: "My New Strategy2" },
          { id: "My New Strategy3", name: "My New Strategy3" },
          { id: "My New Strategy4", name: "My New Strategy4" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategies();
  }, [userId]);

  return { strategies, isLoading, error };
}