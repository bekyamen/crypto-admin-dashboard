'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, LineChart, Sliders, Gauge, LogOut,Contact } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: LineChart },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Contact }
];

const adminItems = [
  { href: '/dashboard/admin/hub', label: 'Admin Hub', icon: Gauge },
  { href: '/dashboard/admin/management', label: 'Admin Control', icon: Sliders },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear local/session storage to prevent auto-login
    localStorage.removeItem('authToken'); // adjust key if you use a different one
    sessionStorage.removeItem('authToken');

    // Redirect to login page
    router.push('/login');
  };

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

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Main Menu */}
        <div className="space-y-2">
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
        </div>

        {/* Admin Section */}
        <div className="pt-4 border-t border-slate-700">
          <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Admin Panel
          </p>
          <div className="space-y-2">
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 border border-amber-500/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
