'use client';

import { useState, useEffect } from 'react';
import { useAdminMethods } from '@/lib/use-admin-api';
import { useAdminTradesApi } from '@/lib/use-admin-trades-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Users, X } from 'lucide-react';

/* -------------------- Types -------------------- */

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface UserOverride {
  userId: string;
  forceOutcome: 'win' | 'lose' | null;
  expiresAt?: string;
}

interface SettingsResponse {
  data?: {
    userOverrides?: UserOverride[];
  };
}

interface UsersResponse {
  data?: {
    users?: User[];
  };
}

interface Props {
  onSettingsUpdate?: () => void;
}

/* -------------------- Component -------------------- */

export function UserOverrideManager({ onSettingsUpdate }: Props) {
  const adminMethods = useAdminMethods();
  const { getAllUsers } = useAdminTradesApi();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [overrides, setOverrides] = useState<UserOverride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState<
    { type: 'success' | 'error'; text: string } | null
  >(null);

  /* -------------------- Safe Load Settings -------------------- */

  const loadSettings = async () => {
    try {
      const result = (await adminMethods.getSettings()) as SettingsResponse;

      const overrideArray =
        result?.data?.userOverrides &&
        Array.isArray(result.data.userOverrides)
          ? result.data.userOverrides
          : [];

      setOverrides(overrideArray);
    } catch (err) {
      console.error('Failed to load overrides:', err);
      setOverrides([]);
    }
  };

  /* -------------------- Safe Load Users -------------------- */

  const loadUsers = async () => {
    try {
      const usersResult = (await getAllUsers(500, 0)) as UsersResponse;

      const usersArray =
        usersResult?.data?.users &&
        Array.isArray(usersResult.data.users)
          ? usersResult.data.users
          : [];

      setAllUsers(usersArray);
    } catch (err) {
      console.error('Failed to load users:', err);
      setAllUsers([]);
    }
  };

  /* -------------------- Initial Load -------------------- */

  useEffect(() => {
    const init = async () => {
      setIsFetching(true);
      try {
        await Promise.all([loadUsers(), loadSettings()]);
      } catch (err) {
        console.error('Initial load error:', err);
      } finally {
        setIsFetching(false);
      }
    };

    init();
  }, []);

  /* -------------------- Remove Override -------------------- */

  const handleRemoveOverride = async (userId: string) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await adminMethods.setUserOverride(userId, null);

      if (result?.success) {
        setMessage({ type: 'success', text: 'Override removed successfully' });
        await loadSettings();
        onSettingsUpdate?.();
      } else {
        setMessage({ type: 'error', text: 'Failed to remove override' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to remove override' });
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <Card className="p-6 bg-slate-900 border border-slate-700 rounded-2xl text-white">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
          <Users size={20} className="text-white" />
          <h3 className="text-lg font-semibold text-white">
            User-Specific Adjustments
          </h3>
        </div>

        {/* Loading */}
        {isFetching && (
          <div className="text-center py-6 text-white">
            Loading...
          </div>
        )}

        {/* Overrides */}
        {!isFetching && overrides.length === 0 && (
          <div className="text-center py-8 bg-slate-800 rounded-xl border border-slate-700 text-white">
            No active overrides
          </div>
        )}

        {!isFetching && overrides.length > 0 && (
          <div className="space-y-4">
            {overrides.map((override) => {
              const user = allUsers.find(
                (u) => u.id === override.userId
              );

              const userName =
                `${user?.firstName ?? ''} ${
                  user?.lastName ?? ''
                }`.trim() || 'User';

              const userEmail = user?.email ?? 'N/A';

              const validDate =
                override.expiresAt &&
                !isNaN(new Date(override.expiresAt).getTime());

              return (
                <div
                  key={override.userId}
                  className="flex justify-between items-center p-5 bg-slate-800 border border-slate-700 rounded-2xl"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {userName}
                    </p>
                    <p className="text-sm text-white">
                      {userEmail}
                    </p>

                    <div className="flex gap-3 mt-2 flex-wrap">
                      {override.forceOutcome && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-white">
                          FORCE {override.forceOutcome.toUpperCase()}
                        </span>
                      )}

                      {validDate && (
                        <span className="px-3 py-1 rounded-full text-xs bg-slate-700 text-white">
                          Expires:{' '}
                          {new Date(
                            override.expiresAt!
                          ).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="icon"
                    disabled={isLoading}
                    onClick={() =>
                      handleRemoveOverride(override.userId)
                    }
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    <X size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-2 p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-emerald-600'
                : 'bg-rose-600'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>
    </Card>
  );
}