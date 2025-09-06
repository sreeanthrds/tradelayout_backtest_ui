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
    const fullUrl = `${baseUrl}${endpoint}`;
    
    console.log('=== API REQUEST DEBUG ===');
    console.log('Current timestamp:', new Date().toISOString());
    console.log('ConfigService baseUrl:', baseUrl);
    console.log('Full URL:', fullUrl);
    console.log('Request options:', JSON.stringify(options, null, 2));
    console.log('localStorage app_config:', localStorage.getItem('app_config'));
    console.log('Window location:', window.location.href);
    console.log('==========================');
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          ...options.headers,
        },
      });

      console.log('=== API RESPONSE DEBUG ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('===========================');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('=== API SUCCESS ===');
      console.log('Response data:', data);
      console.log('===================');
      return data;
    } catch (error) {
      console.log('=== API ERROR DEBUG ===');
      console.error('Error details:', error);
      console.log('Error type:', typeof error);
      console.log('Error constructor:', error?.constructor?.name);
      console.log('Error message:', error?.message);
      console.log('Error stack:', error?.stack);
      console.log('========================');
      
      // Check if it's a CORS or network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Unable to connect to API server at ${baseUrl}. This may be due to CORS restrictions or the server being unavailable. Please check your API configuration in the Admin panel.`);
      }
      
      // Re-throw other errors
      throw error;
    }
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