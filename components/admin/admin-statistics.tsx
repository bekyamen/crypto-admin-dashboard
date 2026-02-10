'use client';

import React, { useState, useEffect } from 'react';
import { useAdminMethods } from '@/lib/use-admin-api';
import { Card } from '@/components/ui/card';
import { Users, Wallet, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Stats {
  users?: {
    total?: number;
    admins?: number;
    regularUsers?: number;
  };
  portfolios?: {
    total?: number;
    totalValue?: number;
    totalInvested?: number;
    totalPnL?: number;
  };
  transactions?: {
    total?: number;
    totalVolume?: number;
    totalFees?: number;
  };
}

interface AdminStatisticsProps {
  refreshTrigger?: number;
}

export function AdminStatistics({ refreshTrigger }: AdminStatisticsProps) {
  const adminMethods = useAdminMethods();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const result = await adminMethods.getStats();
      if (result?.data) {
        setStats(result.data as Stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    icon,
    label,
    value,
    subValue,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    color: string;
  }) => (
    <Card className="p-4 bg-slate-800/50 border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-100">{value}</p>
          {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </Card>
  );

  if (isLoading) {
    return <div className="text-slate-400">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="text-slate-400">No statistics available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Platform Statistics</h2>
        <Button
          onClick={loadStats}
          disabled={isLoading}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200"
          size="sm"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Users size={24} className="text-blue-400" />}
          label="Total Users"
          value={stats.users?.total ?? 0}
          subValue={`${stats.users?.admins ?? 0} admin${(stats.users?.admins ?? 0) !== 1 ? 's' : ''}, ${stats.users?.regularUsers ?? 0} regular`}
          color="bg-blue-900/20"
        />

        <StatCard
          icon={<Wallet size={24} className="text-green-400" />}
          label="Total Portfolio Value"
          value={`$${(stats.portfolios?.totalValue ?? 0).toLocaleString()}`}
          subValue={`Invested: $${(stats.portfolios?.totalInvested ?? 0).toLocaleString()}`}
          color="bg-green-900/20"
        />

        <StatCard
          icon={<TrendingUp size={24} className="text-purple-400" />}
          label="Total Transactions"
          value={stats.transactions?.total ?? 0}
          subValue={`Volume: $${(stats.transactions?.totalVolume ?? 0).toLocaleString()}`}
          color="bg-purple-900/20"
        />
      </div>

      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Detailed Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Portfolios</p>
            <p className="text-xl font-bold text-slate-100">{stats.portfolios?.total ?? 0}</p>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Admin Users</p>
            <p className="text-xl font-bold text-slate-100">{stats.users?.admins ?? 0}</p>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">P&L</p>
            <p className={`text-xl font-bold ${(stats.portfolios?.totalPnL ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${((stats.portfolios?.totalPnL ?? 0)).toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Total Fees</p>
            <p className="text-xl font-bold text-slate-100">
              ${((stats.transactions?.totalFees ?? 0)).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
