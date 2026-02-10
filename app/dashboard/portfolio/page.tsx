'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const portfolioData = [
  { name: 'Bitcoin', value: 45, amount: '$56,000' },
  { name: 'Ethereum', value: 25, amount: '$31,000' },
  { name: 'Solana', value: 15, amount: '$18,600' },
  { name: 'Other', value: 15, amount: '$18,980' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

const holdings = [
  { symbol: 'BTC', name: 'Bitcoin', amount: 2.5, price: 22400, total: 56000, change: '+12.5%' },
  { symbol: 'ETH', name: 'Ethereum', amount: 15.5, price: 2000, total: 31000, change: '+8.2%' },
  { symbol: 'SOL', name: 'Solana', amount: 250, price: 74.4, total: 18600, change: '+15.3%' },
  { symbol: 'ADA', name: 'Cardano', amount: 5000, price: 0.94, total: 4700, change: '+5.1%' },
  { symbol: 'USDC', name: 'USD Coin', amount: 18980, price: 1.0, total: 18980, change: '0%' },
];

export default function PortfolioPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Portfolio</h1>
        <p className="text-slate-400 mt-2">Manage and monitor your crypto holdings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Allocation</CardTitle>
            <CardDescription className="text-slate-400">Portfolio distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Holdings</CardTitle>
            <CardDescription className="text-slate-400">Your current assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {holdings.map((holding) => (
                <div
                  key={holding.symbol}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{holding.symbol[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{holding.name}</p>
                      <p className="text-xs text-slate-400">{holding.amount} {holding.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">${holding.total.toLocaleString()}</p>
                    <p className={`text-xs ${holding.change.startsWith('+') ? 'text-green-400' : 'text-slate-400'}`}>
                      {holding.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
