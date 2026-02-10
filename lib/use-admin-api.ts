'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

const API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || 'http://localhost:5000/api/admin';
const USE_PROXY = true; // Use Next.js proxy to avoid CORS issues

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface UseAdminApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
}

export function useAdminApi() {
  const { token, logout, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T,>(endpoint: string, options: UseAdminApiOptions = {}): Promise<ApiResponse<T> | null> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!isLoggedIn || !token) {
          throw new Error('Not authenticated. Please log in.');
        }

        console.log('[v0] Admin API: Calling', options.method || 'GET', endpoint);

        // Use proxy if needed
        const url = USE_PROXY
          ? `/api/admin/proxy?endpoint=${encodeURIComponent(endpoint)}`
          : `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        console.log('[v0] Admin API: Response status:', response.status);

        if (response.status === 401) {
          console.error('[v0] Admin API: Unauthorized or expired token');
          logout(); // Auto logout on 401
          throw new Error('Unauthorized or expired token. Please log in again.');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API error: ${response.status}`);
        }

        const data: ApiResponse<T> = await response.json();
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('[v0] Admin API: Error:', errorMsg);
        setError(errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token, logout, isLoggedIn]
  );

  return { request, isLoading, error };
}

// Admin methods
export function useAdminMethods() {
  const { request } = useAdminApi();

  return {
    setGlobalMode: (mode: 'win' | 'lose' | 'random') =>
      request('/mode', { method: 'POST', body: { mode } }),
    setWinProbability: (percentage: number) =>
      request('/win-probability', { method: 'POST', body: { percentage } }),
    setUserOverride: (userId: string, forceOutcome: 'win' | 'lose' | null, expiresAt?: string) =>
      request('/user-override', { method: 'POST', body: { userId, forceOutcome, ...(expiresAt && { expiresAt }) } }),
    updateBetConfig: (expirationTime: number, profitPercent: number, lossPercent: number) =>
      request('/bet-config', { method: 'POST', body: { expirationTime, profitPercent, lossPercent } }),
    getSettings: () => request('/settings', { method: 'GET' }),
    getStats: () => request('/stats', { method: 'GET' }),
    resetAllData: (confirmation: string) => request('/reset', { method: 'POST', body: { confirmation } }),
  };
}
