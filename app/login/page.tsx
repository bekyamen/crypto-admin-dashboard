'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allowRedirect, setAllowRedirect] = useState(false); // ✅ new flag

  // Prevent auto-login redirect
  useEffect(() => {
    // Only redirect if we explicitly set allowRedirect
    if (allowRedirect && isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [allowRedirect, isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Clear any leftover tokens first
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      // Attempt login
      await login(email, password);

      // Allow redirect only after successful login
      setAllowRedirect(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur-xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">₿</span>
            </div>
            <span className="text-xl font-bold text-white">CryptoAdmin</span>
          </div>
          <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your admin dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@crypto.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="password" className="text-sm font-medium text-slate-200">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 pr-10"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              Admin access only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
