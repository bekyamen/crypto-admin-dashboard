'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface Trade {
  id: string;
  userId: string;
  type: 'BUY' | 'SELL';
  amount: number;
  result?: 'WIN' | 'LOSE';
  profitLoss?: number;
  createdAt: string;
}

export default function UserAnalyticsPage() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch('/api/trades/place');
        if (!response.ok) throw new Error('Failed to fetch trades');
        const data = await response.json();
        const userTrades = (data.trades || []).filter(
          (t: Trade) => t.userId === user?.id
        );
        setTrades(userTrades);
      } catch (err) {
        console.error('Error fetching trades:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchTrades();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
        Loading analytics...
      </div>
    );
  }

  // ===== Stats Calculation =====
  const completedTrades = trades.filter((t) => t.result);
  const winTrades = completedTrades.filter((t) => t.result === 'WIN');
  const loseTrades = completedTrades.filter((t) => t.result === 'LOSE');

  const winRate =
    completedTrades.length > 0
      ? ((winTrades.length / completedTrades.length) * 100).toFixed(1)
      : '0';

  const totalProfit = completedTrades.reduce(
    (sum, t) => sum + (t.profitLoss || 0),
    0
  );

  const avgWin =
    winTrades.length > 0
      ? (
          winTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) /
          winTrades.length
        ).toFixed(2)
      : '0';

  const avgLoss =
    loseTrades.length > 0
      ? Math.abs(
          loseTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) /
            loseTrades.length
        ).toFixed(2)
      : '0';

  const winLossData = [
    { name: 'Wins', value: winTrades.length, fill: '#10b981' },
    { name: 'Losses', value: loseTrades.length, fill: '#ef4444' },
  ];

  const profitOverTime: any[] = [];
  let runningProfit = 0;

  completedTrades
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    )
    .slice(-20)
    .forEach((trade) => {
      runningProfit += trade.profitLoss || 0;
      profitOverTime.push({
        time: new Date(trade.createdAt).toLocaleDateString(),
        profit: runningProfit,
      });
    });

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100">
            Your Trading Analytics
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Track your trading performance and statistics
          </p>
        </div>

        {/* ===== Key Metrics ===== */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

          {/* Win Rate */}
          <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase">Win Rate</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-400 mt-2">
                  {winRate}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {winTrades.length} wins
                </p>
              </div>
              <Target className="text-blue-500 opacity-40" size={26} />
            </div>
          </Card>

          {/* Total Profit */}
          <Card className="bg-gradient-to-br from-green-900/50 to-slate-900 border-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase">
                  Total Profit
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-bold mt-2 ${
                    totalProfit >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {completedTrades.length} trades
                </p>
              </div>
              {totalProfit >= 0 ? (
                <TrendingUp
                  className="text-green-500 opacity-40"
                  size={26}
                />
              ) : (
                <TrendingDown
                  className="text-red-500 opacity-40"
                  size={26}
                />
              )}
            </div>
          </Card>

          {/* Avg Win */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase">
                  Avg Win
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-400 mt-2">
                  +${avgWin}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {winTrades.length} trades
                </p>
              </div>
              <Award
                className="text-purple-500 opacity-40"
                size={26}
              />
            </div>
          </Card>

          {/* Avg Loss */}
          <Card className="bg-gradient-to-br from-orange-900/50 to-slate-900 border-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase">
                  Avg Loss
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-400 mt-2">
                  -${avgLoss}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {loseTrades.length} trades
                </p>
              </div>
              <TrendingDown
                className="text-orange-500 opacity-40"
                size={26}
              />
            </div>
          </Card>
        </div>

        {/* ===== Charts Section ===== */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">

          {/* Win/Loss Pie */}
          <Card className="bg-slate-900 border-slate-800 p-5 sm:p-6">
            <h3 className="font-semibold text-slate-100 mb-4 text-sm sm:text-base">
              Win/Loss Distribution
            </h3>
            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={winLossData}
                    dataKey="value"
                    outerRadius={90}
                    label
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Profit Line Chart */}
          {profitOverTime.length > 0 && (
            <Card className="bg-slate-900 border-slate-800 p-5 sm:p-6">
              <h3 className="font-semibold text-slate-100 mb-4 text-sm sm:text-base">
                Cumulative Profit/Loss
              </h3>
              <div className="w-full h-[250px] sm:h-[320px]">
                <ResponsiveContainer>
                  <LineChart data={profitOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#3b82f6"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>

        {/* Empty State */}
        {completedTrades.length === 0 && (
          <Card className="bg-slate-900 border-slate-800 p-8 text-center">
            <p className="text-slate-400">
              No completed trades yet. Start trading to see your analytics!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
