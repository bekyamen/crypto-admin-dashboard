'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const transactions = [
  { id: 1, asset: 'Bitcoin', type: 'buy', amount: '0.5 BTC', value: '$18,250', time: '2 hours ago' },
  { id: 2, asset: 'Ethereum', type: 'sell', amount: '5.2 ETH', value: '$8,840', time: '4 hours ago' },
  { id: 3, asset: 'Solana', type: 'buy', amount: '25 SOL', value: '$3,750', time: '1 day ago' },
  { id: 4, asset: 'Bitcoin', type: 'buy', amount: '0.25 BTC', value: '$9,125', time: '2 days ago' },
  { id: 5, asset: 'Cardano', type: 'sell', amount: '1000 ADA', value: '$390', time: '3 days ago' },
];

export default function RecentTransactions() {
  return (
    <Card className="border-slate-800 bg-slate-900/50 h-full">
      <CardHeader>
        <CardTitle className="text-white">Recent Transactions</CardTitle>
        <CardDescription className="text-slate-400">Last 5 transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  {tx.type === 'buy' ? (
                    <ArrowDownLeft className="text-green-400" size={18} />
                  ) : (
                    <ArrowUpRight className="text-red-400" size={18} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{tx.asset}</p>
                  <p className="text-xs text-slate-400">{tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{tx.amount}</p>
                <p className="text-xs text-slate-400">{tx.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
