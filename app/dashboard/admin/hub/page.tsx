'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Settings, BarChart3 } from 'lucide-react';
import { UserManagementPanel } from '@/components/admin/user-management-panel';
import { PlatformTradeAnalytics } from '@/components/admin/platform-trade-analytics';
import { UserTradeViewer } from '@/components/admin/user-trade-viewer';

type AdminTab = 'overview' | 'users' | 'trades' | 'analytics';

export default function AdminHubPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <main className="flex-1 bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Admin Hub</h1>
          <p className="text-slate-400">
            Manage users, view platform analytics, and monitor all trading activities
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            className={`flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={18} />
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            className={`flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <Users size={18} />
            User Management
          </Button>
          <Button
            onClick={() => setActiveTab('trades')}
            variant={activeTab === 'trades' ? 'default' : 'ghost'}
            className={`flex items-center gap-2 ${
              activeTab === 'trades'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <TrendingUp size={18} />
            User Trades
          </Button>
          <Button
            onClick={() => setActiveTab('analytics')}
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            className={`flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={18} />
            Platform Analytics
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50">
                <h2 className="text-2xl font-bold text-slate-100 mb-3">Welcome to Admin Hub</h2>
                <p className="text-slate-300 mb-4">
                  This admin panel provides comprehensive tools to manage your trading platform. You can:
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Manage Users:</strong> View all users, adjust balances, and reset passwords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>View User Trades:</strong> Search and analyze individual user trading history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Platform Analytics:</strong> Monitor platform-wide trading statistics and performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Real-time Data:</strong> All data is fetched in real-time from your backend API</span>
                  </li>
                </ul>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">Active Feature</p>
                      <p className="text-lg font-bold text-slate-200">User Management</p>
                    </div>
                    <Users size={24} className="text-blue-400" />
                  </div>
                </Card>
                <Card className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">Data Source</p>
                      <p className="text-lg font-bold text-slate-200">Backend API</p>
                    </div>
                    <TrendingUp size={24} className="text-green-400" />
                  </div>
                </Card>
                <Card className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">Status</p>
                      <p className="text-lg font-bold text-green-400">Connected</p>
                    </div>
                    <Settings size={24} className="text-emerald-400" />
                  </div>
                </Card>
              </div>

              
            </div>
          )}

          {activeTab === 'users' && <UserManagementPanel />}

          {activeTab === 'trades' && <UserTradeViewer />}

          {activeTab === 'analytics' && <PlatformTradeAnalytics />}
        </div>
      </div>
    </main>
  );
}
