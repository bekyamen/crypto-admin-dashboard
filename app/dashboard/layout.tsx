'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import TopBar from '@/components/dashboard/topbar';
import { AuthProvider } from '@/lib/auth-context'; // <-- import AuthProvider

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider> {/* <-- wrap everything with AuthProvider */}
      <div className="flex h-screen bg-slate-950">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto bg-gradient-to-b from-slate-900 to-slate-950">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
