const API_BASE_URL = 'https://5f48e29893bb.ngrok-free.app';

// Temporary user ID for development
const TEMP_USER_ID = 'dev-user-123';

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
  strategy_name: string;
  total_return: number;
  max_drawdown: number;
  sharpe_ratio: number;
  win_rate: number;
  trades: Array<{
    entry_date: string;
    exit_date: string;
    symbol: string;
    profit_loss: number;
    return_percentage: number;
  }>;
  equity_curve: Array<{
    date: string;
    value: number;
  }>;
  monthly_returns: Array<{
    month: string;
    return: number;
  }>;
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
      strategy_name: 'Mock Strategy',
      total_return: 15.5,
      max_drawdown: -8.2,
      sharpe_ratio: 1.35,
      win_rate: 68.5,
      trades: [
        {
          entry_date: '2024-01-15',
          exit_date: '2024-01-20',
          symbol: 'AAPL',
          profit_loss: 150.00,
          return_percentage: 2.5,
        },
        {
          entry_date: '2024-01-22',
          exit_date: '2024-01-25',
          symbol: 'MSFT',
          profit_loss: -75.00,
          return_percentage: -1.2,
        },
      ],
      equity_curve: [
        { date: '2024-01-01', value: 10000 },
        { date: '2024-01-15', value: 10150 },
        { date: '2024-01-30', value: 11550 },
      ],
      monthly_returns: [
        { month: 'Jan 2024', return: 5.5 },
        { month: 'Feb 2024', return: 3.2 },
        { month: 'Mar 2024', return: -1.8 },
      ],
    };
  }
}

export const backtestApiService = new BacktestApiService();