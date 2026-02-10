'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { ArrowUp, ArrowDown, Clock, DollarSign, Calendar } from 'lucide-react';

interface Trade {
  id: string;
  userId: string;
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

export default function MyTradesPage() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'WIN' | 'LOSE'>('ALL');

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch('/api/trades/place');
        if (!response.ok) throw new Error('Failed to fetch trades');
        const data = await response.json();
        // Filter trades for current user
        const userTrades = (data.trades || [])
          .filter((t: Trade) => t.userId === user?.id)
          .sort((a: Trade, b: Trade) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTrades(userTrades);
        console.log('[v0] Fetched user trades:', userTrades);
      } catch (err) {
        console.error('[v0] Error fetching trades:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchTrades();
      const interval = setInterval(fetchTrades, 5000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const filteredTrades = trades.filter((trade) => {
    if (filter === 'PENDING') return trade.status === 'PENDING';
    if (filter === 'COMPLETED') return trade.status === 'COMPLETED';
    if (filter === 'WIN') return trade.result === 'WIN';
    if (filter === 'LOSE') return trade.result === 'LOSE';
    return true;
  });

  const stats = {
    totalTrades: trades.length,
    winTrades: trades.filter((t) => t.result === 'WIN').length,
    loseTrades: trades.filter((t) => t.result === 'LOSE').length,
    totalProfit: trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0),
  };

  if (isLoading) {
    return <div className="text-slate-400">Loading your trades...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">My Trades</h1>
        <p className="text-slate-400 mt-2">View your complete trading history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Total Trades</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{stats.totalTrades}</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Wins</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.winTrades}</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Losses</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{stats.loseTrades}</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4">
          <p className="text-xs text-slate-400 uppercase">Total P/L</p>
          <p className={`text-2xl font-bold mt-1 ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['ALL', 'PENDING', 'COMPLETED', 'WIN', 'LOSE'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Trades List */}
      <div className="space-y-3">
        {filteredTrades.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 p-8 text-center">
            <p className="text-slate-400">No trades found</p>
          </Card>
        ) : (
          filteredTrades.map((trade) => (
            <Card key={trade.id} className="bg-slate-900 border-slate-800 p-4 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between gap-4">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {trade.type === 'BUY' ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/30">
                        <ArrowUp size={16} className="text-green-400" />
                        <span className="text-sm font-semibold text-green-400">BUY</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30">
                        <ArrowDown size={16} className="text-red-400" />
                        <span className="text-sm font-semibold text-red-400">SELL</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      <span className="text-xs">{trade.timeframe}s</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={14} />
                      <span className="text-xs">
                        {new Date(trade.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Bet Amount</p>
                      <p className="font-semibold text-slate-100 mt-1">${trade.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Entry Price</p>
                      <p className="font-semibold text-slate-100 mt-1">${trade.startPrice.toFixed(2)}</p>
                    </div>
                    {trade.endPrice && (
                      <div>
                        <p className="text-xs text-slate-500">Exit Price</p>
                        <p className="font-semibold text-slate-100 mt-1">${trade.endPrice.toFixed(2)}</p>
                      </div>
                    )}
                    {trade.profitLoss !== undefined && (
                      <div>
                        <p className="text-xs text-slate-500">P/L</p>
                        <p className={`font-semibold mt-1 ${trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Result */}
                <div className="text-right">
                  {trade.result === 'WIN' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2 block">
                      WIN
                    </Badge>
                  )}
                  {trade.result === 'LOSE' && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-2 block">
                      LOSE
                    </Badge>
                  )}
                  {trade.result === 'PENDING' && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-2 block">
                      PENDING
                    </Badge>
                  )}

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
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
