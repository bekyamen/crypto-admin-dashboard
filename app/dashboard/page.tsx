'use client';

import PortfolioChart from '@/components/dashboard/portfolio-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, PieChart, Activity } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">uth



    
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome back! Here's your portfolio overview.</p>
      </div>

      {/* Stats Grid */}
       {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Portfolio</CardTitle>
            <Wallet className="text-blue-400" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$124,580.50</div>
            <p className="text-xs text-green-400 flex items-center gap-1 mt-2">
              <ArrowUpRight size={14} /> +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">24h Volume</CardTitle>
            <TrendingUp className="text-purple-400" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$42,300.00</div>
            <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
              <ArrowDownLeft size={14} /> -5.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Assets</CardTitle>
            <PieChart className="text-amber-400" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-slate-400 mt-2">Currently managed</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Transactions</CardTitle>
            <Activity className="text-green-400" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,284</div>
            <p className="text-xs text-slate-400 mt-2">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioChart />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
