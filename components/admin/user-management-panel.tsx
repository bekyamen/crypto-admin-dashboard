'use client';

import { useEffect, useState } from 'react';
import { useAdminTradesApi } from '@/lib/use-admin-trades-api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Edit2, Lock, DollarSign, Trash2 } from 'lucide-react';

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  balance?: number;
  totalEarnings?: number;
  createdAt?: string;
}

export function UserManagementPanel() {
  const { getAllUsers, adjustBalance, resetPassword, getUserById, deleteUser, setUserOverride, isLoading, error } =
    useAdminTradesApi();

  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);

  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<Record<string, string>>({});
  const [balanceReason, setBalanceReason] = useState<Record<string, string>>({});
  const [newPassword, setNewPassword] = useState<Record<string, string>>({});
  const [inlineForceOutcome, setInlineForceOutcome] = useState<Record<string, 'win' | 'lose' | 'null' | ''>>({});
  const [inlineExpiresAt, setInlineExpiresAt] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    const result = await getAllUsers(limit, offset);
    if (result) {
      setUsers(result.users ?? []);
      setTotalUsers(result.total ?? 0);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [offset]);

  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    const email = user.email ?? '';
    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`;
    return email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(totalUsers / limit);

  const handleAdjustBalance = async (userId: string) => {
    const amount = parseFloat(balanceAmount[userId] || '0');
    const reason = balanceReason[userId] || '';
    if (!amount || !reason) return alert('Please enter an amount and reason');
    const result = await adjustBalance(userId, amount, reason);
    if (result) {
      setSuccessMessage(`Balance updated: $${result.newBalance}`);
      setBalanceAmount({ ...balanceAmount, [userId]: '' });
      setBalanceReason({ ...balanceReason, [userId]: '' });
      await loadUsers();
      setExpandedUser(userId);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleResetPassword = async (userId: string) => {
    const password = newPassword[userId];
    if (!password) return alert('Please enter a new password');
    const result = await resetPassword(userId, password);
    if (result) {
      setSuccessMessage('Password reset successfully');
      setNewPassword({ ...newPassword, [userId]: '' });
      await loadUsers();
      setExpandedUser(userId);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteUser = async (userId: string, userName?: string) => {
    if (confirm(`Are you sure you want to delete ${userName || 'this user'}?`)) {
      const success = await deleteUser(userId);
      if (success) {
        setSuccessMessage('User deleted successfully');
        await loadUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleViewUser = async (userId: string) => {
    const user = await getUserById(userId);
    if (user) {
      alert(
        `User: ${user.firstName ?? ''} ${user.lastName ?? ''}\nEmail: ${user.email ?? ''}\nBalance: $${(
          user.balance ?? 0
        ).toFixed(2)}\nEarnings: $${(user.totalEarnings ?? 0).toFixed(2)}`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Success & Error Messages */}
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

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search by name or email"
          className="flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="w-full sm:w-auto" onClick={() => setOffset(0)}>Refresh</Button>
      </div>

      {/* Users Table */}
      <Card className="bg-slate-800 border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-slate-900/60 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-200">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-200">Email</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-200">Balance</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-200">Earnings</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-200">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {filteredUsers.map((user) => {
              if (!user) return null;
              const userId = user.id ?? 'unknown';
              const userBalance = user.balance ?? 0;
              const userEarnings = user.totalEarnings ?? 0;
              const firstName = user.firstName ?? '';
              const lastName = user.lastName ?? '';
              const email = user.email ?? '';

              return (
                <tr key={userId} className="hover:bg-slate-700/40 transition">
                  <td className="px-4 py-3">
                    <p className="text-slate-100 font-medium">{firstName} {lastName}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[120px]">{userId.slice(0, 8)}...</p>
                  </td>
                  <td className="px-4 py-3 text-slate-300 truncate max-w-[150px]">{email}</td>
                  <td className="px-4 py-3 text-right text-slate-100 font-mono">${userBalance.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-right font-mono font-semibold ${userEarnings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${userEarnings.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-2">
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300" onClick={() => setExpandedUser(userId)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(userId, firstName)}>
                      <Trash2 size={16} />
                    </Button>

                    {/* Inline Override */}
                    <div className="flex flex-col md:flex-row gap-1 w-full md:w-auto mt-2 md:mt-0">
                      <select
                        className="bg-slate-700 border-slate-600 text-slate-100 p-1 rounded text-sm"
                        value={inlineForceOutcome[userId] || ''}
                        onChange={(e) =>
                          setInlineForceOutcome({ ...inlineForceOutcome, [userId]: e.target.value as 'win' | 'lose' | 'null' | '' })
                        }
                      >
                        <option value="">-- Outcome --</option>
                        <option value="win">Win</option>
                        <option value="lose">Lose</option>
                        <option value="null">Random</option>
                      </select>

                      <input
                        type="datetime-local"
                        className="bg-slate-700 border-slate-600 text-slate-100 p-1 rounded text-sm"
                        value={inlineExpiresAt[userId] || ''}
                        onChange={(e) =>
                          setInlineExpiresAt({ ...inlineExpiresAt, [userId]: e.target.value })
                        }
                      />

                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={async () => {
                          const outcome = inlineForceOutcome[userId] === 'null' ? null : (inlineForceOutcome[userId] as 'win' | 'lose');
                          const expires = inlineExpiresAt[userId] ? new Date(inlineExpiresAt[userId]).toISOString() : undefined;
                          const result = await setUserOverride(userId, outcome, expires);
                          if (result) {
                            setSuccessMessage(`User ${result.userId} override set to ${result.forceOutcome ?? 'none'}`);
                            setInlineForceOutcome({ ...inlineForceOutcome, [userId]: '' });
                            setInlineExpiresAt({ ...inlineExpiresAt, [userId]: '' });
                            await loadUsers();
                            setTimeout(() => setSuccessMessage(''), 3000);
                          }
                        }}
                        disabled={isLoading}
                      >
                        Apply
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalUsers > limit && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-slate-900/50 border-t border-slate-700 text-slate-200 text-sm gap-2 sm:gap-0">
            <span>
              Page {offset / limit + 1} of {totalPages} ({totalUsers} users)
            </span>
            <div className="flex gap-2">
              <Button size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>
                Previous
              </Button>
              <Button size="sm" disabled={offset + limit >= totalUsers} onClick={() => setOffset(offset + limit)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal for Expanded User */}
      {expandedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <Card className="w-full max-w-md sm:max-w-2xl bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">User Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Adjust Balance */}
              <Card className="p-4 bg-slate-900 border-slate-700">
                <h4 className="text-slate-100 font-semibold flex items-center gap-2 mb-3">
                  <DollarSign size={16} /> Adjust Balance
                </h4>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  value={balanceAmount[expandedUser] || ''}
                  onChange={(e) => setBalanceAmount({ ...balanceAmount, [expandedUser]: e.target.value })}
                />
                <Input
                  placeholder="Reason"
                  className="mt-2 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  value={balanceReason[expandedUser] || ''}
                  onChange={(e) => setBalanceReason({ ...balanceReason, [expandedUser]: e.target.value })}
                />
                <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700" onClick={() => handleAdjustBalance(expandedUser)} disabled={isLoading}>
                  Apply
                </Button>
              </Card>

              {/* Reset Password */}
              <Card className="p-4 bg-slate-900 border-slate-700">
                <h4 className="text-slate-100 font-semibold flex items-center gap-2 mb-3">
                  <Lock size={16} /> Reset Password
                </h4>
                <Input
                  type="password"
                  placeholder="New password"
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  value={newPassword[expandedUser] || ''}
                  onChange={(e) => setNewPassword({ ...newPassword, [expandedUser]: e.target.value })}
                />
                <Button className="w-full mt-3 bg-orange-600 hover:bg-orange-700" onClick={() => handleResetPassword(expandedUser)} disabled={isLoading}>
                  Reset
                </Button>
              </Card>
            </div>

            <Button variant="ghost" className="mt-4 text-slate-300 hover:text-black w-full" onClick={() => setExpandedUser(null)}>
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
