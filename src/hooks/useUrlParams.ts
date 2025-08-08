import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { ConfigService } from "@/services/ConfigService";

export interface UrlParams {
  userId: string | null;
  strategyId: string | null;
  theme: string | null;
  apiUrl: string | null;
}

export function useUrlParams(): UrlParams {
  const [searchParams] = useSearchParams();
  
  return useMemo(() => ({
    userId: searchParams.get('userId'),
    strategyId: searchParams.get('strategyId'),
    theme: searchParams.get('theme'),
    apiUrl: searchParams.get('apiUrl'),
  }), [searchParams]);
}

export function useThemeFromUrl() {
  const { theme: urlTheme } = useUrlParams();
  const { theme: currentTheme, setTheme } = useTheme();
  
  // Apply URL theme if provided and different from current
  useMemo(() => {
    if (urlTheme && urlTheme !== currentTheme) {
      setTheme(urlTheme);
    }
  }, [urlTheme, currentTheme, setTheme]);
  
  return urlTheme || currentTheme;
}

// Initialize API base URL from ?apiUrl= query param
export function useApplyApiUrlFromParams() {
  const { apiUrl } = useUrlParams();

  useEffect(() => {
    if (apiUrl) {
      ConfigService.setApiBaseUrl(apiUrl);
    }
  }, [apiUrl]);

  return apiUrl;
}
