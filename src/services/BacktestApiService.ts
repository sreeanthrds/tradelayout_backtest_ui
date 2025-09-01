import { ConfigService } from '@/services/ConfigService';

// Temporary user ID for development
const TEMP_USER_ID = 'user_2yfjTGEKjL7XkklQyBaMP6SN2Lc';

export interface Strategy {
  id: string;
  name: string;
}

export interface BacktestRequest {
  strategy_id: string;
  start_date: string;
  end_date: string;
}

export interface BacktestResult {
  message?: string;
  processing_method?: string;
  workers_used?: number;
  // Support both old and new JSON structures
  gps_aggregated?: {
    all_positions?: {
      [key: string]: any;
    };
    positions_by_date?: {
      [date: string]: {
        [positionId: string]: {
          trades?: any[];
          entry?: any;
          exit?: any;
          status?: string;
          entry_time?: string;
          exit_time?: string;
          close_reason?: string;
          pnl?: number;
          quantity?: number;
          entry_price?: number;
          exit_price?: number;
          instrument?: string;
          strategy?: string;
          node_id?: string;
          trade_side?: string;
          [key: string]: any; // Allow additional fields
        };
      };
    };
  };
  // Direct trades array support
  trades?: any[];
  // Support any additional top-level fields
  [key: string]: any;
}

class BacktestApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = ConfigService.getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getStrategies(userId?: string | null): Promise<Strategy[]> {
    try {
      // Use provided userId or fallback to temp user ID
      const userIdToUse = userId || TEMP_USER_ID;
      console.log("Fetching strategies for userId:", userIdToUse);
      
      const response = await this.makeRequest<{ strategies: Strategy[] }>('/backtest/strategies/list', {
        method: 'POST',
        body: JSON.stringify({ user_id: userIdToUse }),
      });
      
      console.log("API strategies response:", response);
      
      // Return actual API response - don't use fallback anymore
      if (!response.strategies || response.strategies.length === 0) {
        console.warn('No strategies found from API for user:', userIdToUse);
        // Show the actual empty state instead of fallback
        return [];
      }
      
      return response.strategies;
    } catch (error) {
      console.error('Error fetching strategies:', error);
      // On error, still return empty array instead of fallback
      return [];
    }
  }

  async runBacktest(request: BacktestRequest, userId?: string | null): Promise<BacktestResult> {
    try {
      // Use provided userId or fallback to temp user ID
      const userIdToUse = userId || TEMP_USER_ID;
      const response = await this.makeRequest<BacktestResult>('/backtest/range/optimized', {
        method: 'POST',
        body: JSON.stringify({
          ...request,
          user_id: userIdToUse,
        }),
      });
      return response;
    } catch (error) {
      console.error('Error running backtest:', error);
      throw error;
    }
  }
}

export const backtestApiService = new BacktestApiService();