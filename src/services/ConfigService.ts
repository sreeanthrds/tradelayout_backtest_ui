export type AppConfig = {
  apiBaseUrl: string;
};

export class ConfigService {
  private static STORAGE_KEY = 'app_config';
  private static DEFAULTS: AppConfig = {
    // Default can be updated anytime from the UI; used as a safe fallback
    apiBaseUrl: 'https://46db7003512a.ngrok-free.app',
  };

  static getConfig(): AppConfig {
    if (typeof window === 'undefined') return this.DEFAULTS;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return this.DEFAULTS;
      const parsed = JSON.parse(raw) as Partial<AppConfig>;
      return { ...this.DEFAULTS, ...parsed } as AppConfig;
    } catch {
      return this.DEFAULTS;
    }
  }

  static setConfig(next: Partial<AppConfig>) {
    if (typeof window === 'undefined') return;
    const merged = { ...this.getConfig(), ...next };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
  }

  static getApiBaseUrl(): string {
    const { apiBaseUrl } = this.getConfig();
    // Normalize: remove trailing slashes
    return (apiBaseUrl || this.DEFAULTS.apiBaseUrl).replace(/\/+$/, '');
  }

  static setApiBaseUrl(url: string) {
    const normalized = (url || '').trim().replace(/\/+$/, '');
    this.setConfig({ apiBaseUrl: normalized });
  }

  static resetToDefaults() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.DEFAULTS));
  }
}
