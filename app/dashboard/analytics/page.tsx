'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
        // Filter trades for current user
        const userTrades = (data.trades || []).filter((t: Trade) => t.userId === user?.id);
        setTrades(userTrades);
      } catch (err) {
        console.error('[v0] Error fetching trades:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchTrades();
    }
  }, [user?.id]);

  if (isLoading) {
    return <div className="text-slate-400">Loading analytics...</div>;
  }

  // Calculate statistics
  const completedTrades = trades.filter((t) => t.result);
  const winTrades = completedTrades.filter((t) => t.result === 'WIN');
  const loseTrades = completedTrades.filter((t) => t.result === 'LOSE');

  const winRate = completedTrades.length > 0 ? ((winTrades.length / completedTrades.length) * 100).toFixed(1) : '0';
  const totalProfit = completedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
  const avgWin = winTrades.length > 0 ? (winTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / winTrades.length).toFixed(2) : '0';
  const avgLoss = loseTrades.length > 0 ? Math.abs(loseTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / loseTrades.length).toFixed(2) : '0';

  const winLossData = [
    { name: 'Wins', value: winTrades.length, fill: '#10b981' },
    { name: 'Losses', value: loseTrades.length, fill: '#ef4444' },
  ];

  const buyTrades = completedTrades.filter((t) => t.type === 'BUY').length;
  const sellTrades = completedTrades.filter((t) => t.type === 'SELL').length;

  const tradeTypeData = [
    { name: 'Buy', value: buyTrades, fill: '#3b82f6' },
    { name: 'Sell', value: sellTrades, fill: '#f59e0b' },
  ];

  const profitOverTime: any[] = [];
  let runningProfit = 0;

  completedTrades
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-20)
    .forEach((trade) => {
      runningProfit += trade.profitLoss || 0;
      profitOverTime.push({
        time: new Date(trade.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        profit: runningProfit,
      });
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Your Trading Analytics</h1>
        <p className="text-slate-400 mt-2">Track your trading performance and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-slate-800 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase">Win Rate</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{winRate}%</p>
              <p className="text-xs text-slate-500 mt-1">{winTrades.length} wins</p>
            </div>
            <Target className="text-blue-500 opacity-50" size={24} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-slate-900 border-slate-800 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase">Total Profit</p>
              <p className={`text-3xl font-bold mt-2 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500 mt-1">{completedTrades.length} trades</p>
            </div>
            {totalProfit >= 0 ? (
              <TrendingUp className="text-green-500 opacity-50" size={24} />
            ) : (
              <TrendingDown className="text-red-500 opacity-50" size={24} />
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-slate-800 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase">Avg Win</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">+${avgWin}</p>
              <p className="text-xs text-slate-500 mt-1">{winTrades.length} winning trades</p>
            </div>
            <Award className="text-purple-500 opacity-50" size={24} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-slate-900 border-slate-800 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase">Avg Loss</p>
              <p className="text-3xl font-bold text-orange-400 mt-2">-${avgLoss}</p>
              <p className="text-xs text-slate-500 mt-1">{loseTrades.length} losing trades</p>
            </div>
            <TrendingDown className="text-orange-500 opacity-50" size={24} />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Pie Chart */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Win/Loss Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={winLossData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Trade Type Pie Chart */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Buy/Sell Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tradeTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tradeTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Profit Over Time */}
      {profitOverTime.length > 0 && (
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Cumulative Profit/Loss Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Profit']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                dot={false}
                name="Cumulative P/L"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Trade Summary */}
      {completedTrades.length === 0 && (
        <Card className="bg-slate-900 border-slate-800 p-8 text-center">
          <p className="text-slate-400">No completed trades yet. Start trading to see your analytics!</p>
        </Card>
      )}
    </div>
  );
}
