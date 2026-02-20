'use client';

import { useState, useEffect } from 'react';
import { useAdminMethods } from '@/lib/use-admin-api';
import { useAdminTradesApi } from '@/lib/use-admin-trades-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Users, X, ChevronDown } from 'lucide-react';

// User interface
interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// Override interface
interface UserOverride {
  userId: string;
  forceOutcome: 'win' | 'lose' | null;
  expiresAt?: string;
}

// Settings response type
interface SettingsResponse {
  userOverrides: UserOverride[];
}

// Props
interface UserOverrideManagerProps {
  onSettingsUpdate?: () => void;
}

export function UserOverrideManager({ onSettingsUpdate }: UserOverrideManagerProps) {
  const adminMethods = useAdminMethods();
  const { getAllUsers } = useAdminTradesApi();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [overrides, setOverrides] = useState<UserOverride[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [outcome, setOutcome] = useState<'win' | 'lose'>('win');
  const [expiresAt, setExpiresAt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Load overrides safely
  const loadSettings = async () => {
    try {
      const result = (await adminMethods.getSettings()) as
        | { data?: SettingsResponse }
        | null;

      if (Array.isArray(result?.data?.userOverrides)) {
        setOverrides(result.data.userOverrides);
      } else {
        setOverrides([]);
      }
    } catch (err) {
      console.error('Failed to load overrides:', err);
      setOverrides([]);
    }
  };

  // Load initial users + overrides
  const loadInitialData = async () => {
    setIsFetchingUsers(true);
    try {
      const usersResult = await getAllUsers(500, 0);
      if (Array.isArray(usersResult?.users)) setAllUsers(usersResult.users);
      await loadSettings();
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsFetchingUsers(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSetOverride = async () => {
    if (!selectedUserId.trim()) {
      setMessage({ type: 'error', text: 'Please select a user' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await adminMethods.setUserOverride(
        selectedUserId,
        outcome,
        expiresAt || undefined
      );

      const selectedUser = allUsers.find((u) => u.id === selectedUserId);
      const name =
        `${selectedUser?.firstName ?? ''} ${selectedUser?.lastName ?? ''}`.trim() || 'User';

      if (result?.success) {
        setMessage({ type: 'success', text: `Force ${outcome.toUpperCase()} set for ${name}` });
        setSelectedUserId('');
        setShowUserDropdown(false);
        setExpiresAt('');
        await loadInitialData();
        onSettingsUpdate?.();
      } else {
        setMessage({ type: 'error', text: 'Failed to set user override' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to set user override' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveOverride = async (overrideUserId: string) => {
    setIsLoading(true);
    try {
      const result = await adminMethods.setUserOverride(overrideUserId, null);
      if (result?.success) {
        setMessage({ type: 'success', text: 'Override removed successfully' });
        await loadInitialData();
        onSettingsUpdate?.();
      } else {
        setMessage({ type: 'error', text: 'Failed to remove override' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove override' });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDisplay = (user?: User) => {
    const first = user?.firstName ?? '';
    const last = user?.lastName ?? '';
    const email = user?.email ?? 'N/A';
    return `${first} ${last} (${email})`.trim();
  };

  return (
  <Card className="p-6 bg-slate-900 border border-slate-700 shadow-xl shadow-black/40 rounded-2xl">
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <Users className="text-white" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-white tracking-wide">
          User-Specific Adjustments
        </h3>
      </div>

      {/* Active Overrides */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-widest">
          Manual Outcome Control ({overrides.length})
        </h4>

        {overrides.length === 0 ? (
          <div className="text-center py-8 text-white text-sm bg-slate-800 rounded-xl border border-slate-700">
            No active overrides
          </div>
        ) : (
          <div className="space-y-3">
            {(Array.isArray(overrides) ? overrides : []).map((override) => {
              const user = allUsers.find((u) => u.id === override.userId);
              const userName =
                `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User';
              const userEmail = user?.email ?? 'N/A';

              return (
                <div
                  key={override.userId}
                  className="flex items-center justify-between p-5 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800/80 transition-all duration-200"
                >
                  {/* LEFT SIDE */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {(user?.firstName?.charAt(0) ?? '') +
                            (user?.lastName?.charAt(0) ?? '')}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          {userName}
                        </p>
                        <p className="text-xs text-white">
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    {/* STATUS BADGES */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {override.forceOutcome && (
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold tracking-wide shadow-sm text-white ${
                            override.forceOutcome === 'win'
                              ? 'bg-emerald-600'
                              : 'bg-rose-600'
                          }`}
                        >
                          FORCE {override.forceOutcome.toUpperCase()}
                        </span>
                      )}

                      {override.expiresAt && (
                        <span className="text-xs text-white bg-slate-700 px-3 py-1 rounded-full border border-slate-600">
                          Expires:{" "}
                          {new Date(override.expiresAt).toLocaleDateString()}{" "}
                          {new Date(override.expiresAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* REMOVE BUTTON */}
                  <Button
                    onClick={() => handleRemoveOverride(override.userId)}
                    disabled={isLoading}
                    size="icon"
                    className="ml-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 w-10 shadow-md"
                  >
                    <X size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-white ${
            message.type === 'success'
              ? 'bg-emerald-600 border-emerald-700'
              : 'bg-rose-600 border-rose-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span className="text-sm font-medium text-white">
            {message.text}
          </span>
        </div>
      )}
    </div>
  </Card>
);
}