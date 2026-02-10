'use client';

import { useEffect, useState } from 'react';
import { useTradeSimApi } from '@/lib/use-trade-sim-api';
import { Card } from '@/components/ui/card';
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

export function PlatformTradeAnalytics() {
  const { getPlatformStats, getAllTrades, isLoading, error } = useTradeSimApi();
  const [stats, setStats] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [assetBreakdown, setAssetBreakdown] = useState<Record<string, number>>({});

  const loadData = async () => {
    try {
      const statsResult = await getPlatformStats();
      if (statsResult) setStats(statsResult);

      const tradesResult = await getAllTrades();
      const tradesArray = tradesResult?.trades ?? []; // Safely access trades array
      if (Array.isArray(tradesArray)) {
        setTrades(tradesArray);

        // Calculate asset breakdown
        const breakdown: Record<string, number> = {};
        tradesArray.forEach((trade) => {
          const symbol = trade.asset.symbol;
          breakdown[symbol] = (breakdown[symbol] || 0) + trade.amount;
        });
        setAssetBreakdown(breakdown);
      } else {
        setTrades([]);
        setAssetBreakdown({});
      }
    } catch (err) {
      console.error('[v0] Error loading trades:', err);
      setTrades([]);
      setAssetBreakdown({});
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const winRate = stats ? parseFloat(stats.winRate) : 0;
  const totalProfit = stats ? parseFloat(stats.totalProfit) : 0;
  const totalVolume = stats ? parseFloat(stats.totalVolumeUSD) : 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Trades */}
        <Card className="p-4 bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-blue-200">{stats?.totalTrades ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-400" />
            </div>
          </div>
        </Card>

        {/* Win Rate */}
        <Card className="p-4 bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-green-200">{winRate.toFixed(1)}%</p>
              <p className="text-xs text-slate-500 mt-1">
                {stats?.totalWins ?? 0} wins / {stats?.totalLosses ?? 0} losses
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Percent size={24} className="text-green-400" />
            </div>
          </div>
        </Card>

        {/* Total Volume */}
        <Card className="p-4 bg-gradient-to-br from-purple-900/30 to-purple-900/10 border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-purple-200">${totalVolume.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-purple-400" />
            </div>
          </div>
        </Card>

        {/* Total Profit/Loss */}
        <Card
          className={`p-4 bg-gradient-to-br border ${
            totalProfit >= 0
              ? 'from-green-900/30 to-green-900/10 border-green-700'
              : 'from-red-900/30 to-red-900/10 border-red-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Profit/Loss</p>
              <p
                className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-200' : 'text-red-200'}`}
              >
                ${totalProfit.toFixed(2)}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                totalProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              {totalProfit >= 0 ? (
                <TrendingUp size={24} className="text-green-400" />
              ) : (
                <TrendingDown size={24} className="text-red-400" />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Asset Breakdown */}
      <Card className="p-4 bg-slate-800 border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Asset Breakdown</h3>
        {Object.entries(assetBreakdown).length > 0 ? (
          Object.entries(assetBreakdown).map(([symbol, volume]) => {
            const percentage = totalVolume > 0 ? (volume / totalVolume) * 100 : 0;
            return (
              <div key={symbol} className="mb-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>{symbol}</span>
                  <span>${volume.toFixed(2)}</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500">{percentage.toFixed(1)}%</div>
              </div>
            );
          })
        ) : (
          <p className="text-slate-500 text-sm">No trades yet</p>
        )}
      </Card>

      {/* Recent Trades */}
      <Card className="p-4 bg-slate-800 border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Trades</h3>
        {trades.length > 0 ? (
          trades.slice(0, 10).map((trade) => (
            <div key={trade.tradeId} className="flex justify-between items-center p-2 bg-slate-700/50 rounded text-sm mb-1">
              <div>
                <p className="text-slate-200 font-medium">{trade.asset.symbol}</p>
                <p className="text-xs text-slate-500">
                  {trade.type.toUpperCase()} • ${trade.amount.toFixed(2)}
                </p>
              </div>
              <div className={`font-mono font-bold text-sm ${trade.outcome === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                {trade.outcome === 'WIN' ? '+' : ''}${trade.profitLossAmount.toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm">No trades yet</p>
        )}
      </Card>
    </div>
  );
}
