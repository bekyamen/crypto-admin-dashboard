'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTrading } from '@/lib/use-trading';
import { PROFIT_LOSS_RATES } from '@/lib/trade-utils';
import { ArrowUp, ArrowDown, Clock, DollarSign } from 'lucide-react';

export default function TradePanel() {
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState(100);
  const [timeframe, setTimeframe] = useState(60);
  const [expectedProfit, setExpectedProfit] = useState(18);
  const [isExecuting, setIsExecuting] = useState(false);

  const { placeTrade, isLoading, error } = useTrading();

  useEffect(() => {
    const profitRate = PROFIT_LOSS_RATES[timeframe] || 0.18;
    setExpectedProfit(Math.round(profitRate * 100));
  }, [timeframe]);

  const handleExecuteTrade = async () => {
    setIsExecuting(true);
    try {
      const result = await placeTrade(tradeType, amount, timeframe);
      if (result) {
        // Reset form
        setAmount(100);
        // Show success message via UI
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-100">Place Trade</h2>

      {/* Trade Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">Direction</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTradeType('BUY')}
            className={`p-4 rounded-lg border-2 transition-all ${
              tradeType === 'BUY'
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowUp size={20} />
              <span className="font-semibold">BUY (UP)</span>
            </div>
            <p className="text-xs mt-1 opacity-75">Price goes UP</p>
          </button>

          <button
            onClick={() => setTradeType('SELL')}
            className={`p-4 rounded-lg border-2 transition-all ${
              tradeType === 'SELL'
                ? 'border-red-500 bg-red-500/10 text-red-400'
                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowDown size={20} />
              <span className="font-semibold">SELL (DOWN)</span>
            </div>
            <p className="text-xs mt-1 opacity-75">Price goes DOWN</p>
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">Bet Amount ($)</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="number"
            min="10"
            max="10000"
            value={amount}
            onChange={(e) => setAmount(Math.max(10, parseInt(e.target.value) || 0))}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">Duration</label>
        <div className="grid grid-cols-3 gap-2">
          {[30, 60, 90, 180, 300].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`p-2 rounded-lg border transition-all text-sm ${
                timeframe === tf
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Clock size={16} className="mx-auto mb-1" />
              {tf}s
            </button>
          ))}
        </div>
      </div>

      {/* Profit/Loss Display */}
      <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Potential Profit (Win)</span>
          <span className="text-lg font-bold text-green-400">
            +${Math.round((amount * expectedProfit) / 100 * 100) / 100}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Potential Loss (Lose)</span>
          <span className="text-lg font-bold text-red-400">
            -${Math.round((amount * expectedProfit) / 100 * 100) / 100}
          </span>
        </div>
        <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-300">Return on Win</span>
          <span className="text-lg font-bold text-blue-400">{expectedProfit}%</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Execute Button */}
      <Button
        onClick={handleExecuteTrade}
        disabled={isLoading || isExecuting}
        className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
      >
        {isLoading || isExecuting ? 'Executing...' : 'Execute Trade'}
      </Button>
    </div>
  );
}
