import GameModeControl from '@/components/admin/game-mode-control';

export default function GameControlPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Game Control Panel</h1>
        <p className="text-slate-400 mt-2">Manage trading modes and individual user results</p>
      </div>

      <GameModeControl />
    </div>
  );
}
