'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Clock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  id: string;
  userId: string;
  email: string;
  type: 'BUY' | 'SELL';
  amount: number;
  timeframe: number;
  startPrice: number;
  endPrice?: number;
  result?: 'WIN' | 'LOSE' | 'PENDING';
  profitLoss?: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  completedAt?: string;
}

export default function AdminTradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades/place');
      if (!response.ok) throw new Error('Failed to fetch trades');
      const data = await response.json();
      setTrades(data.trades || []);
      console.log('[v0] Fetched trades:', data.trades);
    } catch (err) {
      console.error('[v0] Error fetching trades:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredTrades = trades.filter((trade) => {
    if (filter === 'PENDING') return trade.status === 'PENDING';
    if (filter === 'COMPLETED') return trade.status === 'COMPLETED';
    return true;
  });

  const stats = {
    totalTrades: trades.length,
    pendingTrades: trades.filter((t) => t.status === 'PENDING').length,
    completedTrades: trades.filter((t) => t.status === 'COMPLETED').length,
    totalVolume: trades.reduce((sum, t) => sum + t.amount, 0),
    totalProfit: trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0),
  };

  if (isLoading) {
    return <div className="text-slate-400">Loading trades...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Trade Management</h1>
        <p className="text-slate-400 mt-2">Monitor and manage all user trades</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Total Trades</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{stats.totalTrades}</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Pending</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pendingTrades}</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Completed</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{stats.completedTrades}</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Volume</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">${stats.totalVolume.toFixed(2)}</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Profit/Loss</p>
          <p className={`text-2xl font-bold mt-1 ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['ALL', 'PENDING', 'COMPLETED'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Trades Table */}
      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Trade</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Result</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">P/L</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No trades found
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">{trade.email}</p>
                        <p className="text-xs text-slate-500">{trade.userId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {trade.type === 'BUY' ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <ArrowUp size={16} />
                          BUY
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <ArrowDown size={16} />
                          SELL
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-100">
                      ${trade.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {trade.timeframe}s
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {trade.startPrice.toFixed(2)}
                      {trade.endPrice && ` → ${trade.endPrice.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {trade.result === 'WIN' && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          WIN
                        </Badge>
                      )}
                      {trade.result === 'LOSE' && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          LOSE
                        </Badge>
                      )}
                      {trade.result === 'PENDING' && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          PENDING
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {trade.profitLoss !== undefined && (
                        <div className={trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {trade.status === 'PENDING' && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          PENDING
                        </Badge>
                      )}
                      {trade.status === 'COMPLETED' && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          COMPLETED
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
