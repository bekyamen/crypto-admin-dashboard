'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/trade-sim';

interface Trade {
  tradeId: string;
  userId: string;
  type: 'buy' | 'sell';
  asset: {
    symbol: string;
    name: string;
    price: number;
    assetClass: 'crypto' | 'forex' | 'stock';
  };
  amount: number;
  expirationTime: number;
  outcome: 'WIN' | 'LOSE';
  returnedAmount: number;
  profitLossAmount: number;
  profitLossPercent: number;
  timestamp: string;
  completedAt: string;
}

interface TradeStats {
  totalTrades: number;
  totalWins: number;
  totalLosses: number;
  winRate: string;
  totalVolumeUSD: string;
  totalReturned: string;
  totalProfit: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useTradeSimApi() {
  const { token, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic fetch helper
  const fetchWithAuth = useCallback(
    async <T>(url: string): Promise<T | null> => {
      if (!token) {
        const msg = 'Unauthorized: No token';
        setError(msg);
        console.error('[v0] Trade API Error:', msg);
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // Token invalid or expired
          console.error('[v0] Trade API Error: Token invalid or expired');
          logout();
          return null;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data: ApiResponse<T> = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'API call failed');
        }

        return data.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        console.error('[v0] Trade API Error:', msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token, logout]
  );

  // API methods
  const getAllTrades = useCallback(() => fetchWithAuth<{ trades: Trade[] }>(API_BASE_URL), [fetchWithAuth]);
  const getPlatformStats = useCallback(() => fetchWithAuth<TradeStats>(`${API_BASE_URL}/stats`), [fetchWithAuth]);
  const getUserTrades = useCallback(
    (userId: string) => fetchWithAuth<{ trades: Trade[] }>(`${API_BASE_URL}/user/${userId.trim()}`),
    [fetchWithAuth]
  );

  return { getAllTrades, getPlatformStats, getUserTrades, isLoading, error };
}

