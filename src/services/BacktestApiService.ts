const API_BASE_URL = 'https://5f48e29893bb.ngrok-free.app';

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
  message: string;
  processing_method: string;
  workers_used: number;
  gps_aggregated: {
    all_positions: {
      [key: string]: {
        entry: any;
        exit: any;
        status: string;
        entry_time: string;
        exit_time: string;
        close_reason: string;
        pnl: number;
        quantity: number;
        entry_price: number;
        exit_price: number;
        instrument: string;
        strategy: string;
        node_id: string;
        date: string;
      };
    };
  };
}

class BacktestApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

  async getStrategies(): Promise<Strategy[]> {
    try {
      const response = await this.makeRequest<{ strategies: Strategy[] }>('/backtest/strategies/list', {
        method: 'POST',
        body: JSON.stringify({ user_id: TEMP_USER_ID }),
      });
      
      // If API returns empty strategies, use fallback for development
      if (!response.strategies || response.strategies.length === 0) {
        console.warn('No strategies found from API, using fallback data');
        return [
          { id: '1', name: 'Strategy 1' },
          { id: '2', name: 'Strategy 2' },
          { id: '3', name: 'Strategy 3' },
        ];
      }
      
      return response.strategies;
    } catch (error) {
      console.error('Error fetching strategies:', error);
      // Fallback to mock data for development
      return [
        { id: '1', name: 'Strategy 1' },
        { id: '2', name: 'Strategy 2' },
        { id: '3', name: 'Strategy 3' },
      ];
    }
  }

  async runBacktest(request: BacktestRequest): Promise<BacktestResult> {
    try {
      const response = await this.makeRequest<BacktestResult>('/backtest/range/optimized', {
        method: 'POST',
        body: JSON.stringify({
          ...request,
          user_id: TEMP_USER_ID,
        }),
      });
      return response;
    } catch (error) {
      console.error('Error running backtest:', error);
      // Return mock data for development
      return this.getMockBacktestResult();
    }
  }

  private getMockBacktestResult(): BacktestResult {
    return {
      message: 'Mock backtest completed',
      processing_method: 'mock',
      workers_used: 1,
      gps_aggregated: {
        all_positions: {
          'mock-position-1': {
            entry: {},
            exit: {},
            status: 'closed',
            entry_time: '2024-01-15T09:30:00',
            exit_time: '2024-01-15T15:30:00',
            close_reason: 'manual_exit',
            pnl: 150.00,
            quantity: 1,
            entry_price: 6000,
            exit_price: 6150,
            instrument: 'AAPL',
            strategy: 'Mock Strategy',
            node_id: 'mock-1',
            date: '15-01-2024',
          },
          'mock-position-2': {
            entry: {},
            exit: {},
            status: 'closed',
            entry_time: '2024-01-22T09:30:00',
            exit_time: '2024-01-22T15:30:00',
            close_reason: 'stop_loss',
            pnl: -75.00,
            quantity: 1,
            entry_price: 6200,
            exit_price: 6125,
            instrument: 'MSFT',
            strategy: 'Mock Strategy',
            node_id: 'mock-2',
            date: '22-01-2024',
          },
        },
      },
    };
  }
}

export const backtestApiService = new BacktestApiService();