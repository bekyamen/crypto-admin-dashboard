'use client';

import { useAuth } from '@/lib/auth-context';
import { useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || 'http://localhost:5000/api/admin';
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export function useApi() {
  const { token } = useAuth();

  const request = useCallback(
    async (endpoint: string, options: FetchOptions = {}) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'API request failed');
      }

      return response.json();
    },
    [token]
  );

  return { request };
}
