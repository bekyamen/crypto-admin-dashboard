'use client';

import { useState, useEffect } from 'react';
import { useAdminMethods } from '@/lib/use-admin-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface ModeControlProps {
  onSettingsUpdate?: () => void;
}

export function GlobalModeControl({ onSettingsUpdate }: ModeControlProps) {
  const adminMethods = useAdminMethods();
  const [currentMode, setCurrentMode] = useState<'win' | 'lose' | 'random'>('random');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const result = await adminMethods.getSettings();
      if (result?.data) {
        setCurrentMode(result.data.globalMode || 'random');
      }
    };
    loadSettings();
  }, []);

  const handleSetMode = async (mode: 'win' | 'lose' | 'random') => {
    setIsLoading(true);
    setMessage(null);

    const result = await adminMethods.setGlobalMode(mode);

    if (result?.success) {
      setCurrentMode(mode);
      setMessage({ type: 'success', text: `Global mode set to ${mode}` });
      onSettingsUpdate?.();
    } else {
      setMessage({ type: 'error', text: 'Failed to set global mode' });
    }

    setIsLoading(false);
  };

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-slate-100">Global Trading Mode</h3>
        </div>

        <p className="text-sm text-slate-400">
          Set the global trading outcome mode that applies to all users
        </p>

        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => handleSetMode('win')}
            disabled={isLoading}
            className={`${
              currentMode === 'win'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            All Win
          </Button>
          <Button
            onClick={() => handleSetMode('lose')}
            disabled={isLoading}
            className={`${
              currentMode === 'lose'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            All Lose
          </Button>
          <Button
            onClick={() => handleSetMode('random')}
            disabled={isLoading}
            className={`${
              currentMode === 'random'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Random
          </Button>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-900/30 text-green-300'
                : 'bg-red-900/30 text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            Current mode: <span className="font-mono text-slate-300">{currentMode}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
