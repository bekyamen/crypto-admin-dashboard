'use client';

import { useState } from 'react';
import { useAdminMethods } from '@/lib/use-admin-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface DangerZoneProps {
  onReset?: () => void;
}

export function DangerZone({ onReset }: DangerZoneProps) {
  const adminMethods = useAdminMethods();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResetClick = () => {
    setShowConfirmation(true);
    setConfirmationText('');
  };

  const handleConfirmReset = async () => {
    if (confirmationText !== 'RESET_ALL_DATA') {
      setMessage({ type: 'error', text: 'Confirmation text does not match' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await adminMethods.resetAllData('RESET_ALL_DATA');

    if (result?.success) {
      setMessage({ type: 'success', text: 'All data has been reset successfully' });
      setShowConfirmation(false);
      setConfirmationText('');
      onReset?.();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setMessage({ type: 'error', text: 'Failed to reset data' });
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmationText('');
    setMessage(null);
  };

  return (
    <Card className="p-6 bg-red-900/10 border-red-700/30">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-400" size={20} />
          <h3 className="text-lg font-semibold text-red-300">Danger Zone</h3>
        </div>

        <p className="text-sm text-red-200/70">
          Irreversible operations that will permanently affect your data
        </p>

        {!showConfirmation ? (
          <Button
            onClick={handleResetClick}
            className="w-full bg-red-600 hover:bg-red-700 text-white border border-red-500"
          >
            Reset All Data
          </Button>
        ) : (
          <div className="space-y-3 p-4 bg-red-900/20 rounded-lg border border-red-700/30">
            <div className="flex items-center gap-2 p-3 bg-red-900/30 rounded text-red-200 text-sm">
              <AlertTriangle size={18} />
              <span>This action is irreversible. All data will be permanently deleted.</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                Type "RESET_ALL_DATA" to confirm:
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="RESET_ALL_DATA"
                className="w-full px-3 py-2 bg-slate-700 border border-red-600 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleConfirmReset}
                disabled={
                  isLoading || confirmationText !== 'RESET_ALL_DATA'
                }
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? 'Resetting...' : 'Confirm Reset'}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

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
