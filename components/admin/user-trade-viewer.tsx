'use client';

import React, { useEffect, useState } from 'react';
import { useTradeSimApi } from '@/lib/use-trade-sim-api';
import { useAdminTradesApi } from '@/lib/use-admin-trades-api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, Search, TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  tradeId: string;
  userId: string;
  type: 'buy' | 'sell';
  asset?: {
    symbol?: string;
    name?: string;
    price?: number;
    assetClass?: 'crypto' | 'forex' | 'stock';
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

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  balance?: number;
  totalEarnings?: number;
  createdAt: string;
}

interface EnrichedTrade extends Trade {
  userEmail?: string;
  userName?: string;
}

export function UserTradeViewer() {
  const { getAllTrades, isLoading: tradeLoading, error: tradeError } = useTradeSimApi();
  const { getAllUsers, isLoading: userLoading, error: userError } = useAdminTradesApi();

  const [allTrades, setAllTrades] = useState<EnrichedTrade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<EnrichedTrade[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'profit' | 'trader'>('date');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- Load trades & users -------------------- */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tradesRes = await getAllTrades();
        const usersRes = await getAllUsers(500, 0);

        const tradesArray = Array.isArray(tradesRes?.trades)
          ? tradesRes.trades
          : Array.isArray(tradesRes)
          ? tradesRes
          : [];

        const usersArray = Array.isArray(usersRes?.users) ? usersRes.users : [];

        const userMap: Record<string, User> = {};
        usersArray.forEach((u) => {
          userMap[u.id] = u;
        });

        const enriched: EnrichedTrade[] = tradesArray.map((trade) => ({
          ...trade,
          userEmail: userMap[trade.userId]?.email,
          userName: `${userMap[trade.userId]?.firstName ?? ''} ${
            userMap[trade.userId]?.lastName ?? ''
          }`.trim(),
        }));

        setUsers(userMap);
        setAllTrades(enriched);
        setFilteredTrades(enriched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getAllTrades, getAllUsers]);

  /* -------------------- Search filter -------------------- */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTrades(allTrades);
      return;
    }

    const q = searchQuery.toLowerCase();
    setFilteredTrades(
      allTrades.filter(
        (t) =>
          (t.userEmail ?? '').toLowerCase().includes(q) ||
          (t.userName ?? '').toLowerCase().includes(q) ||
          (t.asset?.symbol ?? '').toLowerCase().includes(q)
      )
    );
  }, [searchQuery, allTrades]);

  /* -------------------- Sorting -------------------- */
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    if (sortBy === 'profit') return b.profitLossAmount - a.profitLossAmount;
    if (sortBy === 'trader') return (a.userName ?? '').localeCompare(b.userName ?? '');
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const totalProfit = filteredTrades.reduce((s, t) => s + t.profitLossAmount, 0);
  const winCount = filteredTrades.filter((t) => t.outcome === 'WIN').length;
  const winRate = filteredTrades.length
    ? ((winCount / filteredTrades.length) * 100).toFixed(1)
    : '0.0';

  const combinedError = error || tradeError || userError;

  /* -------------------- UI -------------------- */
  return (
  <div className="space-y-6 text-white">

    {combinedError && (
      <div className="bg-red-900/40 border border-red-500 text-white px-4 py-3 rounded flex gap-2">
        <AlertCircle size={16} className="text-white" />
        {combinedError}
      </div>
    )}

    {(isLoading || tradeLoading || userLoading) && (
      <Card className="p-8 text-center bg-slate-800 border-slate-700 text-white">
        Loading trades and users...
      </Card>
    )}

    {!isLoading && (
      <>
        {/* Search */}
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
            />
            <Input
              placeholder="Search trader, email or asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
        </Card>

        {/* Trades Table */}
        <Card className="p-4 bg-slate-800 border-slate-700 text-white">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              All Platform Trades
            </h3>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white"
            >
              <option value="date">Date</option>
              <option value="profit">Profit</option>
              <option value="trader">Trader</option>
            </select>
          </div>

          {sortedTrades.length === 0 ? (
            <p className="text-center text-white py-6">
              No trades found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <tbody>
                  {sortedTrades.map((t) => (
                    <tr
                      key={t.tradeId}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                    >
                      <td className="px-3 py-3 text-white">
                        {t.userName || 'N/A'}
                      </td>

                      <td className="px-3 py-3 text-white">
                        {t.asset?.symbol ?? 'N/A'}
                      </td>

                      <td className="px-3 py-3 text-white">
                        ${t.amount.toFixed(2)}
                      </td>

                      <td className="px-3 py-3 font-bold text-white flex items-center gap-2">
                        {t.profitLossAmount >= 0 ? (
                          <TrendingUp size={14} className="text-white" />
                        ) : (
                          <TrendingDown size={14} className="text-white" />
                        )}
                        {t.profitLossAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </>
    )}
  </div>
);
}