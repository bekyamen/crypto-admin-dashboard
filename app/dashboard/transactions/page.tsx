'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const transactions = [
  {
    id: 1,
    type: 'buy',
    asset: 'Bitcoin',
    symbol: 'BTC',
    amount: '0.5',
    price: '22400',
    total: '11200',
    date: '2024-02-04',
    status: 'completed',
  },
  {
    id: 2,
    type: 'sell',
    asset: 'Ethereum',
    symbol: 'ETH',
    amount: '5.2',
    price: '2000',
    total: '10400',
    date: '2024-02-03',
    status: 'completed',
  },
  {
    id: 3,
    type: 'buy',
    asset: 'Solana',
    symbol: 'SOL',
    amount: '25',
    price: '74.4',
    total: '1860',
    date: '2024-02-02',
    status: 'completed',
  },
  {
    id: 4,
    type: 'buy',
    asset: 'Bitcoin',
    symbol: 'BTC',
    amount: '0.25',
    price: '22400',
    total: '5600',
    date: '2024-02-01',
    status: 'completed',
  },
  {
    id: 5,
    type: 'sell',
    asset: 'Cardano',
    symbol: 'ADA',
    amount: '1000',
    price: '0.39',
    total: '390',
    date: '2024-01-31',
    status: 'completed',
  },
  {
    id: 6,
    type: 'buy',
    asset: 'Ethereum',
    symbol: 'ETH',
    amount: '2.5',
    price: '1950',
    total: '4875',
    date: '2024-01-30',
    status: 'pending',
  },
  {
    id: 7,
    type: 'sell',
    asset: 'Solana',
    symbol: 'SOL',
    amount: '50',
    price: '72',
    total: '3600',
    date: '2024-01-29',
    status: 'completed',
  },
  {
    id: 8,
    type: 'buy',
    asset: 'Bitcoin',
    symbol: 'BTC',
    amount: '0.75',
    price: '21500',
    total: '16125',
    date: '2024-01-28',
    status: 'completed',
  },
];

export default function TransactionsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <p className="text-slate-400 mt-2">View and manage all your transaction history</p>
      </div>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardDescription className="text-slate-400">All trades and transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Asset</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Price</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}
                      >
                        {tx.type === 'buy' ? (
                          <ArrowDownLeft className="text-green-400" size={16} />
                        ) : (
                          <ArrowUpRight className="text-red-400" size={16} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{tx.asset}</p>
                        <p className="text-slate-400">{tx.symbol}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-200">{tx.amount}</td>
                    <td className="px-4 py-3 text-slate-200">${tx.price}</td>
                    <td className="px-4 py-3 font-medium text-white">${tx.total}</td>
                    <td className="px-4 py-3 text-slate-400">{tx.date}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          tx.status === 'completed'
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
