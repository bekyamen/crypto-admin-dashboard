'use client';

import { useEffect, useState } from 'react';
import { useAdminTradesApi } from '@/lib/use-admin-trades-api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  balance?: number;
  totalEarnings?: number;
  createdAt?: string;
  forceOutcome?: 'win' | 'lose' | null;
  overrideExpiresAt?: string | null;
}

export function UserManagementPanel() {
  const {
    getUsersWithMode,
    adjustBalance,
    resetPassword,
    deleteUser,
    setUserOverride,
    isLoading,
    error,
  } = useAdminTradesApi();

  const [users, setUsers] = useState<User[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceMode, setBalanceMode] = useState<'add' | 'deduct' | 'set'>('add');
  const [balanceReason, setBalanceReason] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [inlineForceOutcome, setInlineForceOutcome] = useState<Record<string, 'win' | 'lose' | 'null'>>({});

  const loadUsers = async () => {
    const result = await getUsersWithMode();
    if (result) setUsers(result);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const initialOutcome: Record<string, 'win' | 'lose' | 'null'> = {};
    users.forEach((u) => {
      initialOutcome[u.id!] = u.forceOutcome ?? 'null';
    });
    setInlineForceOutcome(initialOutcome);
  }, [users]);

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setBalanceAmount('');
    setBalanceReason('');
    setNewPassword('');
    setBalanceMode('add');
  };

  const applyEdit = async () => {
    if (!editingUser) return;
    const userId = editingUser.id!;

    // Apply balance adjustment if provided
    const amount = parseFloat(balanceAmount || '0');
    if (amount && balanceReason.trim()) {
      await adjustBalance(userId, amount, balanceReason, balanceMode);
    }

    // Apply password change if provided
    if (newPassword.trim()) {
      await resetPassword(userId, newPassword.trim());
    }

    setSuccessMessage('User updated successfully');
    setEditingUser(null);
    await loadUsers();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteUser = async (userId: string, name?: string) => {
    if (!confirm(`Delete ${name || 'this user'}?`)) return;
    const success = await deleteUser(userId);
    if (success) {
      setSuccessMessage('User deleted successfully');
      await loadUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success / Error */}
      {successMessage && (
        <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by name or email"
          className="flex-1 bg-slate-700 border-slate-600 text-slate-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={loadUsers}>Refresh</Button>
      </div>

      {/* Table */}
      <Card className="bg-slate-800 border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-slate-900/60 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200">Email</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200">Balance</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200">Earnings</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-200">Force Outcome</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-200">Override</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-200">Edit Balance/Password</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-200">Delete</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {users.map((user) => {
              const userId = user.id!;
              const isRandom = user.forceOutcome === null && user.overrideExpiresAt;
              return (
                <tr
                  key={userId}
                  className={`transition ${
                    user.forceOutcome === 'win'
                      ? 'bg-green-900/40'
                      : user.forceOutcome === 'lose'
                      ? 'bg-red-900/40'
                      : isRandom
                      ? 'bg-yellow-900/30'
                      : 'hover:bg-slate-700/40'
                  }`}
                >
                  <td className="px-4 py-3 text-slate-100 font-medium">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3 text-slate-300">{user.email}</td>
                  <td className="px-4 py-3 text-right text-slate-100 font-mono">${user.balance?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-green-400">${user.totalEarnings?.toFixed(2)}</td>

                  {/* Force Outcome */}
                  <td className="px-4 py-3 text-center">
                    <select
                      className="bg-slate-700 border-slate-600 text-slate-100 p-1 rounded text-sm"
                      value={inlineForceOutcome[userId] || 'null'}
                      onChange={(e) =>
                        setInlineForceOutcome({ ...inlineForceOutcome, [userId]: e.target.value as 'win' | 'lose' | 'null' })
                      }
                    >
                      <option value="win">Win</option>
                      <option value="lose">Lose</option>
                      <option value="null">Random</option>
                    </select>
                  </td>

                  {/* Apply Force Outcome */}
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={async () => {
                        const selected = inlineForceOutcome[userId];
                        const outcome = selected === 'null' ? null : selected;
                        await setUserOverride(userId, outcome);
                        setSuccessMessage('Override updated');
                        await loadUsers();
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }}
                    >
                      Apply
                    </Button>
                  </td>

                  {/* Edit Balance / Password Button */}
                  <td className="px-4 py-3 text-center">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>
                      Edit
                    </Button>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(userId, user.firstName)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Edit Balance / Password Modal */}
      {editingUser && (
        <Dialog open={true} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-slate-800 text-slate-100 w-[400px]">
            <DialogHeader>
              <DialogTitle>Edit {editingUser.firstName} {editingUser.lastName}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-2">
              <input
                type="number"
                placeholder="Amount"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="w-full text-sm px-2 py-1 rounded bg-slate-700 border border-slate-600 text-slate-100"
              />
              <select
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 p-1 rounded text-sm"
                value={balanceMode}
                onChange={(e) => setBalanceMode(e.target.value as 'add' | 'deduct' | 'set')}
              >
                <option value="add">Add</option>
                <option value="deduct">Deduct</option>
                <option value="set">Set</option>
              </select>
              <input
                type="text"
                placeholder="Reason"
                value={balanceReason}
                onChange={(e) => setBalanceReason(e.target.value)}
                className="w-full text-sm px-2 py-1 rounded bg-slate-700 border border-slate-600 text-slate-100"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-sm px-2 py-1 rounded bg-slate-700 border border-slate-600 text-slate-100"
              />
            </div>
            <DialogFooter className="mt-4 flex justify-end gap-2">
             <Button
  className="bg-blue-600 hover:bg-blue-700 text-white"
  onClick={() => setEditingUser(null)}
>
  Cancel
</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={applyEdit}>
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}