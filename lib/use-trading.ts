'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './auth-context';
import type { TradeType } from './trade-utils';

export interface PlacedTrade {
  tradeId: string;
  startPrice: number;
  timeframe: number;
  expiresAt: string;
}

export interface TradeResult {
  tradeId: string;
  result: 'WIN' | 'LOSE';
  startPrice: number;
  endPrice: number;
  profitLoss: number;
  finalBalance: number;
}

export function useTrading() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedTrade, setPlacedTrade] = useState<PlacedTrade | null>(null);

  const placeTrade = useCallback(
    async (type: TradeType, amount: number, timeframe: number) => {
      if (!user) {
        setError('User not authenticated');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('[v0] Placing trade:', { type, amount, timeframe, userId: user.id });

        const response = await fetch('/api/trades/place', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            type,
            amount,
            timeframe,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to place trade');
        }

        const data = await response.json();
        console.log('[v0] Trade placed successfully:', data.data);

        setPlacedTrade(data.data);
        return data.data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to place trade';
        console.error('[v0] Trade placement error:', errorMsg);
        setError(errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const resolveTrade = useCallback(async (tradeId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[v0] Resolving trade:', tradeId);

      const response = await fetch('/api/trades/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resolve trade');
      }

      const data = await response.json();
      console.log('[v0] Trade resolved:', data.data);

      return data.data as TradeResult;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to resolve trade';
      console.error('[v0] Trade resolution error:', errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    placeTrade,
    resolveTrade,
    isLoading,
    error,
    placedTrade,
    setPlacedTrade,
    setError,
  };
}
