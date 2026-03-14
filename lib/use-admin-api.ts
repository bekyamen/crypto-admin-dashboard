'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || 'http://localhost:5000/api/admin';
const USE_PROXY = true; // Use Next.js proxy to avoid CORS issues

/* -------------------- Types -------------------- */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface UseAdminApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
}

/* -------------------- Base API Hook -------------------- */

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

        if (response.status === 401) {
          logout();
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
        setError(errorMsg);
        console.error('[Admin API] Error:', errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token, logout, isLoggedIn]
  );

  return { request, isLoading, error };
}

/* -------------------- Admin Methods -------------------- */

export function useAdminMethods() {
  const { request } = useAdminApi();

  return {
    // Set global mode for all trades
    setGlobalMode: (mode: 'win' | 'lose' | 'random') =>
      request('/mode', { method: 'POST', body: { mode } }),

    // Set win probability for a specific trade type (demo/real)
    setWinProbability: (percentage: number, tradeType: 'demo' | 'real') =>
      request('/win-probability', {
        method: 'POST',
        body: { percentage, tradeType },
      }),

    // Set a user-specific override
    setUserOverride: (userId: string, forceOutcome: 'win' | 'lose' | null, expiresAt?: string) =>
      request('/user-override', {
        method: 'POST',
        body: { userId, forceOutcome, ...(expiresAt && { expiresAt }) },
      }),

    // Update bet configuration (profit/loss percentages & expiration time)
    updateBetConfig: (expirationTime: number, profitPercent: number, lossPercent: number) =>
      request('/bet-config', {
        method: 'POST',
        body: { expirationTime, profitPercent, lossPercent },
      }),

    // Fetch current admin settings (DEMO/REAL, win probability, global mode)
    getSettings: () => request<{
      DEMO: { globalMode: string; winProbability: number; userOverrides?: Record<string, unknown> };
      REAL: { globalMode: string; winProbability: number; userOverrides?: Record<string, unknown> };
    }>('/settings', { method: 'GET' }),

    // Fetch admin stats
    getStats: () => request('/stats', { method: 'GET' }),

    // Reset all platform data (requires confirmation)
    resetAllData: (confirmation: string) =>
      request('/reset', { method: 'POST', body: { confirmation } }),
  };
}