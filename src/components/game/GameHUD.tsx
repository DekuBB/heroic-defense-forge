import { GameState } from '@/game/types';
import { WAVES } from '@/game/data';

interface GameHUDProps {
  state: GameState;
  mapName: string;
  speed: number;
  paused: boolean;
  onStartWave: () => void;
  onReset: () => void;
  onBack: () => void;
  onSetSpeed: (speed: number) => void;
  onTogglePause: () => void;
}

const GameHUD = ({ state, mapName, speed, paused, onStartWave, onReset, onBack, onSetSpeed, onTogglePause }: GameHUDProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-xl p-3">
      <button
        onClick={onBack}
        className="px-3 py-1.5 bg-secondary text-secondary-foreground font-body font-bold text-xs rounded-lg hover:opacity-80"
      >
        ← Wróć
      </button>

      <h2 className="font-display text-sm font-bold text-foreground">{mapName}</h2>

      <div className="flex items-center gap-4 ml-auto font-body text-sm">
        <span className="text-primary font-bold">🪙 {state.gold}</span>
        <span className="text-fire font-bold">❤️ {state.lives}</span>
        <span className="text-foreground">
          Fala: <span className="text-accent font-bold">{state.wave + 1}/{WAVES.length}</span>
        </span>
        <span className="text-muted-foreground">
          Wynik: <span className="text-legendary font-bold">{state.score}</span>
        </span>
      </div>

      {/* Speed Controls */}
      {state.phase === 'combat' && (
        <div className="flex items-center gap-1">
          <button
            onClick={onTogglePause}
            className={`px-2 py-1 font-body font-bold text-xs rounded-lg transition-colors ${
              paused ? 'bg-fire/20 text-fire' : 'bg-secondary text-secondary-foreground hover:opacity-80'
            }`}
          >
            {paused ? '▶️' : '⏸️'}
          </button>
          {[1, 2, 3].map(s => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 font-body font-bold text-xs rounded-lg transition-colors ${
                speed === s && !paused
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:opacity-80'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      )}

      {state.phase === 'prep' && state.wave < WAVES.length && (
        <button
          onClick={onStartWave}
          className="px-4 py-1.5 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-opacity border-glow-legendary"
        >
          ⚔️ Rozpocznij Falę {state.wave + 1}
        </button>
      )}

      {(state.phase === 'won' || state.phase === 'lost') && (
        <div className="flex items-center gap-3">
          <span className={`font-display font-bold text-sm ${state.phase === 'won' ? 'text-legendary text-glow-gold' : 'text-fire'}`}>
            {state.phase === 'won' ? '🏆 ZWYCIĘSTWO!' : '💀 PORAŻKA'}
          </span>
          <button
            onClick={onReset}
            className="px-4 py-1.5 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg"
          >
            Zagraj ponownie
          </button>
        </div>
      )}

      {state.phase === 'combat' && (
        <span className="text-fire font-body font-bold text-sm animate-pulse">
          {paused ? '⏸️ Pauza' : '⚔️ Walka!'}
        </span>
      )}
    </div>
  );
};

export default GameHUD;
