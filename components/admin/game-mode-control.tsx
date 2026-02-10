'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Zap, Trophy, Dice5 } from 'lucide-react';

interface GameModeState {
  mode: 'RANDOM' | 'ALWAYS_WIN' | 'ALWAYS_LOSE';
  forcedWinUser?: string;
  forcedLoseUser?: string;
  updatedAt: string;
}

export default function GameModeControl() {
  const [gameMode, setGameMode] = useState<GameModeState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState('');

  // Fetch current game mode
  const fetchGameMode = async () => {
    try {
      const response = await fetch('/api/admin/game-mode');
      if (!response.ok) throw new Error('Failed to fetch game mode');
      const data = await response.json();
      setGameMode(data.data);
    } catch (err) {
      console.error('[v0] Error fetching game mode:', err);
      setError('Failed to load game mode');
    }
  };

  useEffect(() => {
    fetchGameMode();
  }, []);

  const updateGameMode = async (mode: 'RANDOM' | 'ALWAYS_WIN' | 'ALWAYS_LOSE', action = 'GLOBAL') => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[v0] Updating game mode:', { mode, action });

      const response = await fetch('/api/admin/game-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          action,
          userId: action === 'GLOBAL' ? undefined : targetUserId,
        }),
      });

      if (!response.ok) throw new Error('Failed to update game mode');

      const data = await response.json();
      setGameMode(data.data);
      console.log('[v0] Game mode updated:', data.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update game mode';
      console.error('[v0] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceWin = () => {
    if (targetUserId) {
      updateGameMode('RANDOM', 'FORCE_WIN');
    } else {
      setError('Please enter a User ID');
    }
  };

  const handleForceLose = () => {
    if (targetUserId) {
      updateGameMode('RANDOM', 'FORCE_LOSE');
    } else {
      setError('Please enter a User ID');
    }
  };

  const handleClearForce = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/game-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLEAR_FORCE',
        }),
      });

      if (!response.ok) throw new Error('Failed to clear forced controls');

      const data = await response.json();
      setGameMode(data.data);
      setTargetUserId('');
      console.log('[v0] Cleared forced controls');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to clear forced controls';
      console.error('[v0] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!gameMode) {
    return <div className="text-slate-400">Loading game mode...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Global Game Mode */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <div className="flex items-start gap-3 mb-6">
          <AlertCircle className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-bold text-slate-100">Global Game Mode</h3>
            <p className="text-sm text-slate-400 mt-1">Control all trades at once</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400">Current Mode:</p>
            <p className="text-2xl font-bold mt-2">
              {gameMode.mode === 'ALWAYS_WIN' && (
                <span className="text-green-400">Always Win</span>
              )}
              {gameMode.mode === 'ALWAYS_LOSE' && (
                <span className="text-red-400">Always Lose</span>
              )}
              {gameMode.mode === 'RANDOM' && (
                <span className="text-blue-400">Random</span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => updateGameMode('ALWAYS_WIN', 'GLOBAL')}
            disabled={isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Trophy size={18} />
            All Win
          </Button>

          <Button
            onClick={() => updateGameMode('ALWAYS_LOSE', 'GLOBAL')}
            disabled={isLoading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <Zap size={18} />
            All Lose
          </Button>

          <Button
            onClick={() => updateGameMode('RANDOM', 'GLOBAL')}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Dice5 size={18} />
            Random
          </Button>
        </div>
      </Card>

      {/* Individual User Control */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <div className="flex items-start gap-3 mb-6">
          <Zap className="text-purple-500 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-bold text-slate-100">Individual User Control</h3>
            <p className="text-sm text-slate-400 mt-1">Force specific user to win or lose</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">User ID</label>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Enter user ID..."
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {gameMode.forcedWinUser && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-sm text-green-400">
                User <span className="font-mono">{gameMode.forcedWinUser}</span> is forced to WIN
              </p>
            </div>
          )}

          {gameMode.forcedLoseUser && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-400">
                User <span className="font-mono">{gameMode.forcedLoseUser}</span> is forced to LOSE
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleForceWin}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              Force Win
            </Button>

            <Button
              onClick={handleForceLose}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              Force Lose
            </Button>
          </div>

          {(gameMode.forcedWinUser || gameMode.forcedLoseUser) && (
            <Button
              onClick={handleClearForce}
              disabled={isLoading}
              variant="outline"
              className="w-full bg-transparent"
            >
              Clear Force Control
            </Button>
          )}
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Info */}
      <Card className="bg-blue-900/20 border-blue-800/50 p-4">
        <p className="text-sm text-blue-300">
          Last updated: {new Date(gameMode.updatedAt).toLocaleTimeString()}
        </p>
      </Card>
    </div>
  );
}
