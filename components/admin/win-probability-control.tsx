'use client';

import { useState, useEffect } from 'react';
import { useAdminMethods } from '@/lib/use-admin-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Percent } from 'lucide-react';

interface ProbabilityControlProps {
  onSettingsUpdate?: () => void;
}

export function WinProbabilityControl({ onSettingsUpdate }: ProbabilityControlProps) {
  const adminMethods = useAdminMethods();
  const [probability, setProbability] = useState(50);
  const [tempValue, setTempValue] = useState('50');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const result = await adminMethods.getSettings();
      if (result?.data?.winProbability) {
        setProbability(result.data.winProbability);
        setTempValue(String(result.data.winProbability));
      }
    };
    loadSettings();
  }, []);

  const handleSetProbability = async () => {
    const value = parseInt(tempValue, 10);

    if (isNaN(value) || value < 0 || value > 100) {
      setMessage({ type: 'error', text: 'Probability must be between 0 and 100' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await adminMethods.setWinProbability(value);

    if (result?.success) {
      setProbability(value);
      setMessage({ type: 'success', text: `Win probability set to ${value}%` });
      onSettingsUpdate?.();
    } else {
      setMessage({ type: 'error', text: 'Failed to set win probability' });
    }

    setIsLoading(false);
  };

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Percent className="text-purple-400" size={20} />
          <h3 className="text-lg font-semibold text-slate-100">Win Probability</h3>
        </div>

        <p className="text-sm text-slate-400">
          Set the percentage chance for users to win in random mode
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="100"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <span className="text-slate-400">%</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSetProbability}
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? 'Setting...' : 'Apply'}
            </Button>
          </div>

          {/* Visual probability bar */}
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Probability visualization</span>
              <span className="text-sm font-mono text-slate-300">{probability}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-purple-500 transition-all duration-300"
                style={{ width: `${probability}%` }}
              />
            </div>
          </div>
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
      </div>
    </Card>
  );
}
