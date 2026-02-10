'use client';

import { useState } from 'react';
import { useAdminMethods } from '@/lib/use-admin-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Settings } from 'lucide-react';

interface BetConfig {
  expirationTime: number;
  profitPercent: number;
  lossPercent: number;
}

interface BetConfigManagerProps {
  onSettingsUpdate?: () => void;
}

export function BetConfigManager({ onSettingsUpdate }: BetConfigManagerProps) {
  const adminMethods = useAdminMethods();

  // Default configs for all timeframes
  const defaultConfigs: BetConfig[] = [
    { expirationTime: 30, profitPercent: 25, lossPercent: 75 },
    { expirationTime: 60, profitPercent: 20, lossPercent: 80},
    { expirationTime: 120, profitPercent: 35, lossPercent: 65 },
    { expirationTime: 180, profitPercent: 30, lossPercent: 70 },
    { expirationTime: 240, profitPercent: 10, lossPercent: 90 },
    { expirationTime: 300, profitPercent: 45, lossPercent: 55},
    { expirationTime: 360, profitPercent: 15, lossPercent: 85},
  ];

  const [configs] = useState<BetConfig[]>(defaultConfigs);
  const [selectedConfig, setSelectedConfig] = useState<BetConfig>(configs[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateConfig = async () => {
    setIsLoading(true);
    setMessage(null);

    const result = await adminMethods.updateBetConfig(
      selectedConfig.expirationTime,
      selectedConfig.profitPercent,
      selectedConfig.lossPercent
    );

    if (result?.success) {
      setMessage({ type: 'success', text: 'Bet configuration updated' });
      onSettingsUpdate?.();
    } else {
      setMessage({ type: 'error', text: 'Failed to update bet configuration' });
    }

    setIsLoading(false);
  };

  const handleConfigChange = (field: keyof BetConfig, value: number) => {
    setSelectedConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="text-orange-400" size={20} />
          <h3 className="text-lg font-semibold text-slate-100">Bet Configuration</h3>
        </div>

        <p className="text-sm text-slate-400">
          Configure profit and loss percentages for different bet timeframes
        </p>

        {/* Timeframe selection buttons */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {configs.map((config) => (
            <Button
              key={config.expirationTime}
              onClick={() => setSelectedConfig(config)}
              className={`${
                selectedConfig.expirationTime === config.expirationTime
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {config.expirationTime}s
            </Button>
          ))}
        </div>

        {/* Configuration editor */}
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-4">
          <div>
  <label className="block text-sm font-medium text-slate-200 mb-2">
    Expiration Time (seconds)
  </label>
  <input
    type="number"
    value={selectedConfig.expirationTime}
    readOnly // <-- make this field non-editable
    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 cursor-not-allowed"
  />
</div>


          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Win Profit Percentage
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={selectedConfig.profitPercent}
                onChange={(e) =>
                  handleConfigChange('profitPercent', parseInt(e.target.value, 10))
                }
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <span className="text-slate-400">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Loss Percentage
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={selectedConfig.lossPercent}
                onChange={(e) =>
                  handleConfigChange('lossPercent', parseInt(e.target.value, 10))
                }
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <span className="text-slate-400">%</span>
            </div>
          </div>

          <Button
            onClick={handleUpdateConfig}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? 'Updating...' : 'Update Configuration'}
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
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
