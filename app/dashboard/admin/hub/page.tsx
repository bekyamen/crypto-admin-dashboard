
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
    <main className="flex-1 bg-slate-900 min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100">
            Admin Hub
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
            Manage users, view platform analytics, and monitor all trading activities.
          </p>
        </div>

        {/* Responsive Tabs (Scrollable on Mobile) */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 border-b border-slate-700 pb-4 min-w-max">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'trades', label: 'User Trades', icon: TrendingUp },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <Button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as AdminTab)}
                  variant="ghost"
                  className={`flex items-center gap-2 whitespace-nowrap transition-all
                    ${
                      isActive
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">

          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* Welcome Card */}
              <Card className="p-5 sm:p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3">
                  Welcome to Admin Hub
                </h2>
                <p className="text-slate-300 mb-4 text-sm sm:text-base">
                  This admin panel provides comprehensive tools to manage your trading platform:
                </p>

                <ul className="space-y-3 text-slate-300 text-sm sm:text-base">
                  <li className="flex gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong>Manage Users:</strong> Adjust balances & reset passwords</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong>User Trades:</strong> Analyze individual trading history</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong>Platform Analytics:</strong> Monitor global statistics</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong>Real-time Data:</strong> Fetched from backend API</span>
                  </li>
                </ul>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">
                        Active Feature
                      </p>
                      <p className="text-base sm:text-lg font-bold text-slate-200">
                        User Management
                      </p>
                    </div>
                    <Users size={22} className="text-blue-400" />
                  </div>
                </Card>

                <Card className="p-4 bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">
                        Data Source
                      </p>
                      <p className="text-base sm:text-lg font-bold text-slate-200">
                        Backend API
                      </p>
                    </div>
                    <TrendingUp size={22} className="text-green-400" />
                  </div>
                </Card>

                <Card className="p-4 bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">
                        Status
                      </p>
                      <p className="text-base sm:text-lg font-bold text-green-400">
                        Connected
                      </p>
                    </div>
                    <Settings size={22} className="text-emerald-400" />
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
