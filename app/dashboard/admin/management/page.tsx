'use client';

import { useState } from 'react';
import { GlobalModeControl } from '@/components/admin/global-mode-control';
import { WinProbabilityControl } from '@/components/admin/win-probability-control';
import { UserOverrideManager } from '@/components/admin/user-override-manager';
import { BetConfigManager } from '@/components/admin/bet-config-manager';
import { AdminStatistics } from '@/components/admin/admin-statistics';
import { DangerZone } from '@/components/admin/danger-zone';

export default function AdminManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSettingsUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="flex-1 bg-slate-900 min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-2">
            Admin Management
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Control global trading settings, probabilities, and user overrides
          </p>
        </div>

        {/* Admin Statistics */}
        <AdminStatistics refreshTrigger={refreshTrigger} />

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <GlobalModeControl onSettingsUpdate={handleSettingsUpdate} />
          <WinProbabilityControl onSettingsUpdate={handleSettingsUpdate} />
        </div>

        {/* Full Width Controls */}
        <div className="space-y-6">
          <UserOverrideManager onSettingsUpdate={handleSettingsUpdate} />
          <BetConfigManager onSettingsUpdate={handleSettingsUpdate} />
          <DangerZone onReset={handleSettingsUpdate} />
        </div>

      </div>
    </main>
  );
}
