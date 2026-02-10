'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Wallet, TrendingUp, Settings, LogOut, Zap, BarChart2, LineChart, History, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/dashboard/trading', label: 'Trading', icon: Zap },
  { href: '/dashboard/my-trades', label: 'My Trades', icon: History },
  { href: '/dashboard/analytics', label: 'Analytics', icon: LineChart },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: Wallet },
  { href: '/dashboard/transactions', label: 'Transactions', icon: TrendingUp },
  { href: '/dashboard/admin/trades', label: 'Manage Trades', icon: Shield },
  { href: '/dashboard/admin/analytics', label: 'Trade Analytics', icon: BarChart2 },
  { href: '/dashboard/admin/game-control', label: 'Game Control', icon: BarChart2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">₿</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">CryptoAdmin</h1>
            <p className="text-xs text-slate-400">Management Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 border border-blue-500/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
