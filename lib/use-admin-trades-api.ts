'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

const API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || 'http://localhost:5000/api/admin';

// -------------------- Interfaces --------------------
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  totalEarnings: number;
  createdAt: string;
}

export interface BalanceAdjustment {
  userId: string;
  previousBalance: number;
  newBalance: number;
  adjustment: number;
  reason: string;
}

export interface PasswordResetResponse {
  userId: string;
  message: string;
}

export interface UserOverrideResponse {
  userId: string;
  forceOutcome: 'win' | 'lose' | null;
  expiresAt?: string;
  timestamp: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// -------------------- Hook --------------------
export function useAdminTradesApi() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------- Get All Users --------------------
  const getAllUsers = useCallback(
    async (limit = 50, offset = 0): Promise<{ users: User[]; total: number } | null> => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[v0] Admin Trades API: Fetching users', { limit, offset });
        const url = new URL(`${API_BASE_URL}/trades/users`);
        url.searchParams.append('limit', limit.toString());
        url.searchParams.append('offset', offset.toString());

        const response = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
        });



        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized - Invalid token');
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data: ApiResponse<{ users: User[]; total: number; limit: number; offset: number }> =
          await response.json();
        console.log('[v0] Admin Trades API: Got users', data.data.users.length);
        return { users: data.data.users, total: data.data.total };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch users';
        console.error('[v0] Admin Trades API Error:', msg);
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // -------------------- Get User By ID --------------------
  const getUserById = useCallback(
    async (userId: string): Promise<User | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/trades/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error('User not found');
          if (response.status === 401) throw new Error('Unauthorized - Invalid token');
          throw new Error(`Failed to fetch user: ${response.status}`);
        }

        const data: ApiResponse<User> = await response.json();
        return data.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch user';
        console.error('[AdminTradesAPI] getUserById Error:', msg);
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // -------------------- Delete User --------------------
  const deleteUser = useCallback(
    async (userId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/trades/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error('User not found');
          if (response.status === 401) throw new Error('Unauthorized - Invalid token');
          throw new Error(`Failed to delete user: ${response.status}`);
        }

        const data: ApiResponse<{ userId: string }> = await response.json();
        console.log('[AdminTradesAPI] User deleted:', data.data.userId);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to delete user';
        console.error('[AdminTradesAPI] deleteUser Error:', msg);
        setError(msg);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // -------------------- Adjust Balance --------------------
  const adjustBalance = useCallback(
    async (userId: string, amount: number, reason: string): Promise<BalanceAdjustment | null> => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[v0] Admin Trades API: Adjusting balance', { userId, amount, reason });
        const response = await fetch(`${API_BASE_URL}/trades/balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
          body: JSON.stringify({ userId, amount, reason }),
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized - Invalid token');
          if (response.status === 404) throw new Error('User not found');
          throw new Error(`Failed to adjust balance: ${response.status}`);
        }

        const data: ApiResponse<BalanceAdjustment> = await response.json();
        console.log('[v0] Admin Trades API: Balance adjusted');
        return data.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to adjust balance';
        console.error('[v0] Admin Trades API Error:', msg);
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // -------------------- Reset Password --------------------
  const resetPassword = useCallback(
    async (userId: string, newPassword: string): Promise<PasswordResetResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[v0] Admin Trades API: Resetting password for user', userId);

        if (newPassword.length < 8) throw new Error('Password must be at least 8 characters');
        if (!/\d/.test(newPassword)) throw new Error('Password must include at least one number');

        const response = await fetch(`${API_BASE_URL}/trades/password-reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
          body: JSON.stringify({ userId, newPassword }),
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized - Invalid token');
          if (response.status === 404) throw new Error('User not found');
          throw new Error(`Failed to reset password: ${response.status}`);
        }

        const data: ApiResponse<PasswordResetResponse> = await response.json();
        console.log('[v0] Admin Trades API: Password reset successful');
        return data.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to reset password';
        console.error('[v0] Admin Trades API Error:', msg);
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // -------------------- Set User Override --------------------
  const setUserOverride = useCallback(
    async (userId: string, forceOutcome: 'win' | 'lose' | null, expiresAt?: string): Promise<UserOverrideResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/user-override`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
          body: JSON.stringify({ userId, forceOutcome, expiresAt }),
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized - Invalid token');
          throw new Error(`Failed to set user override: ${response.status}`);
        }

        const data: ApiResponse<UserOverrideResponse> = await response.json();
        console.log('[AdminTradesAPI] User override set:', data.data);
        return data.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to set user override';
        console.error('[AdminTradesAPI] setUserOverride Error:', msg);
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // -------------------- Return API --------------------
  return {
    getAllUsers,
    getUserById,
    deleteUser,
    adjustBalance,
    resetPassword,
    setUserOverride,
    isLoading,
    error,
  };
}
