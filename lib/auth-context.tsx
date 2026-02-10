'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type User = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔐 Restore admin session ONLY
  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    const storedToken = localStorage.getItem('admin_token');

    if (storedUser && storedToken) {
      const parsedUser: User = JSON.parse(storedUser);

      if (parsedUser.role === 'ADMIN') {
        setUser(parsedUser);
        setToken(storedToken);
      } else {
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
      }
    }

    setIsLoading(false);
  }, []);

  // 🔐 ADMIN-ONLY LOGIN
  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    // 🚫 Block non-admins
    if (data.data.user.role !== 'ADMIN') {
      throw new Error('Access denied: Admins only');
    }

    setUser(data.data.user);
    setToken(data.data.token);

    localStorage.setItem('admin_user', JSON.stringify(data.data.user));
    localStorage.setItem('admin_token', data.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
