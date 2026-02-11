'use client';

import PortfolioChart from '@/components/dashboard/portfolio-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Wallet,
  PieChart,
  Activity,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Welcome back! Here's your portfolio overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

          {/* Card 1 */}
          <Card className="border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Portfolio
              </CardTitle>
              <Wallet className="text-blue-400" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white">
                $124,580.50
              </div>
              <p className="text-xs text-green-400 flex items-center gap-1 mt-2">
                <ArrowUpRight size={14} /> +12.5% from last month
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                24h Volume
              </CardTitle>
              <TrendingUp className="text-purple-400" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white">
                $42,300.00
              </div>
              <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
                <ArrowDownLeft size={14} /> -5.2% from yesterday
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Active Assets
              </CardTitle>
              <PieChart className="text-amber-400" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white">
                24
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Currently managed
              </p>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Transactions
              </CardTitle>
              <Activity className="text-green-400" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white">
                1,284
              </div>
              <p className="text-xs text-slate-400 mt-2">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts + Activity */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <PortfolioChart />
          </div>
          <div>
            <RecentTransactions />
          </div>
        </div>

      </div>
    </div>
  );
}
