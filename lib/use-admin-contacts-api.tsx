'use client';

import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/admin';

export type Contact = {
  id: string;
  platform: 'telegram' | 'whatsapp';
  value: string;
  createdAt: string;
  updatedAt: string;
};

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useAdminContactsApi(token: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------- Fetch All Contacts --------------------
  const getAllContacts = useCallback(async (): Promise<Contact[] | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized - Invalid token');
        throw new Error(`Failed to fetch contacts: ${res.status}`);
      }
      const data: ApiResponse<Contact[]> = await res.json();
      return data.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch contacts';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // -------------------- Add or Update Contact --------------------
  const saveContact = useCallback(
    async (platform: 'telegram' | 'whatsapp', value: string): Promise<Contact | null> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!platform || !value) throw new Error('Platform and value are required');

        const res = await fetch(`${API_BASE_URL}/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
          body: JSON.stringify({ platform, value }),
        });

        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized - Invalid token');
          throw new Error(`Failed to save contact: ${res.status}`);
        }

        const data: ApiResponse<Contact> = await res.json();
        return data.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to save contact';
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // -------------------- Delete Contact --------------------
  const deleteContact = useCallback(
    async (id: string): Promise<Contact | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token || ''}` },
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized - Invalid token');
          if (res.status === 404) throw new Error('Contact not found');
          throw new Error(`Failed to delete contact: ${res.status}`);
        }
        const data: ApiResponse<Contact> = await res.json();
        return data.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to delete contact';
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return {
    getAllContacts,
    saveContact,
    deleteContact,
    isLoading,
    error,
    setError,
  };
}
