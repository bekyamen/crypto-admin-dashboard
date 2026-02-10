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

  // Load overrides from API
  const loadSettings = async () => {
    try {
      const result = (await adminMethods.getSettings()) as
        | { data?: SettingsResponse }
        | null;

      if (result?.data?.userOverrides) {
        setOverrides(result.data.userOverrides);
      } else {
        setOverrides([]);
      }
    } catch (err) {
      console.error('Failed to load overrides:', err);
      setOverrides([]);
    }
  };

  // Load initial data
  const loadInitialData = async () => {
    setIsFetchingUsers(true);
    try {
      const usersResult = await getAllUsers(500, 0);
      if (usersResult?.users) setAllUsers(usersResult.users);
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

  // Set user override
  const handleSetOverride = async () => {
    if (!selectedUserId.trim()) {
      setMessage({ type: 'error', text: 'Please select a user' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await adminMethods.setUserOverride(selectedUserId, outcome, expiresAt || undefined);

      const selectedUser = allUsers.find((u) => u.id === selectedUserId);
      const name = `${selectedUser?.firstName ?? ''} ${selectedUser?.lastName ?? ''}`.trim() || 'User';

      if (result?.success) {
        setMessage({ type: 'success', text: `Force ${outcome.toUpperCase()} set for ${name}` });
        setSelectedUserId('');
        setShowUserDropdown(false);
        setExpiresAt('');
        loadInitialData();
        onSettingsUpdate?.();
      } else {
        setMessage({ type: 'error', text: 'Failed to set user override' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to set user override' });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove override
  const handleRemoveOverride = async (overrideUserId: string) => {
    setIsLoading(true);
    try {
      const result = await adminMethods.setUserOverride(overrideUserId, null);
      if (result?.success) {
        setMessage({ type: 'success', text: 'Override removed successfully' });
        loadInitialData();
        onSettingsUpdate?.();
      } else {
        setMessage({ type: 'error', text: 'Failed to remove override' });
      }
    } catch (err) {
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
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Users className="text-cyan-400" size={20} />
          <h3 className="text-lg font-semibold text-slate-100">User-Specific Adjustments</h3>
        </div>
        <p className="text-sm text-slate-400"></p>

        
       {/*
<div className="p-6 bg-slate-900/50 rounded-lg space-y-4 border border-slate-700">
  <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
    Admin Trade Adjustment
  </h4>

  {isFetchingUsers ? (
    <div className="text-center py-4 text-slate-400 text-sm">
      Loading users...
    </div>
  ) : (
    <>
      <div className="space-y-2">
        <label className="text-xs text-slate-400 uppercase tracking-wide font-medium">
          Select User
        </label>
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-left text-slate-100 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all flex items-center justify-between"
          >
            <span>
              {selectedUserId
                ? getUserDisplay(allUsers.find(u => u.id === selectedUserId))
                : 'Select a user'}
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform ${
                showUserDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showUserDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              <div className="p-2 space-y-1">
                {allUsers.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-slate-400">
                    No users available
                  </div>
                ) : (
                  allUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUserId(user.id)
                        setShowUserDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-3 rounded text-sm transition-colors ${
                        selectedUserId === user.id
                          ? 'bg-cyan-600/50 text-cyan-100'
                          : 'text-slate-200 hover:bg-slate-600/50'
                      }`}
                    >
                      <div className="font-medium">
                        {user.firstName ?? ''} {user.lastName ?? ''}
                      </div>
                      <div className="text-xs text-slate-400">
                        {user.email ?? 'N/A'}
                      </div>
                      <div className="text-xs text-slate-500">
                        ID: {(user.id ?? 'N/A').substring(0, 8)}...
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wide font-medium">
            Outcome
          </label>
          <select
            value={outcome}
            onChange={e => setOutcome(e.target.value as 'win' | 'lose')}
            className="w-full mt-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
          >
            <option value="win">WIN</option>
            <option value="lose">LOSE</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wide font-medium">
            Expiration (Optional)
          </label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
          />
        </div>
      </div>

      <Button
        onClick={handleSetOverride}
        disabled={isLoading || !selectedUserId}
        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white font-medium py-2"
      >
        {isLoading ? 'Setting...' : `Force ${outcome.toUpperCase()} for Selected User`}
      </Button>
    </>
  )}
</div>
*/}


        {/* Active Overrides */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
            Manual Outcome Control({overrides.length})
          </h4>

          {overrides.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm bg-slate-900/30 rounded-lg border border-slate-700">
              No active overrides
            </div>
          ) : (
            <div className="space-y-2">
              {overrides.map((override) => {
                const user = allUsers.find((u) => u.id === override.userId);
                const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User';
                const userEmail = user?.email ?? 'N/A';
                return (
                  <div
                    key={override.userId}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-xs">
                            {(user?.firstName?.charAt(0) ?? '') + (user?.lastName?.charAt(0) ?? '')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{userName}</p>
                          <p className="text-xs text-slate-500">{userEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {override.forceOutcome && (
                          <span
                            className={`text-xs px-3 py-1 rounded font-bold ${
                              override.forceOutcome === 'win'
                                ? 'bg-green-900/50 text-green-300'
                                : 'bg-red-900/50 text-red-300'
                            }`}
                          >
                            Force {override.forceOutcome.toUpperCase()}
                          </span>
                        )}
                        {override.expiresAt && (
                          <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                            Expires: {new Date(override.expiresAt).toLocaleDateString()}{' '}
                            {new Date(override.expiresAt).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleRemoveOverride(override.userId)}
                      disabled={isLoading}
                      size="icon"
                      className="ml-3 bg-red-600 hover:bg-red-700 text-white h-9 w-9 flex-shrink-0"
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
            className={`flex items-center gap-2 p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
