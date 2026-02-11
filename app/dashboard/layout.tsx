'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import TopBar from '@/components/dashboard/topbar';
import { AuthProvider } from '@/lib/auth-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-950">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* TopBar receives setSidebarOpen */}
          <TopBar setSidebarOpen={setIsSidebarOpen} />

          {/* Page content */}
          <main className="flex-1 overflow-auto bg-gradient-to-b from-slate-900 to-slate-950">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
