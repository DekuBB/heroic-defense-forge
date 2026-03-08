import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGameEngine } from '@/game/useGameEngine';
import GameBoard from '@/components/game/GameBoard';
import TowerPanel from '@/components/game/TowerPanel';
import GameHUD from '@/components/game/GameHUD';
import { MAPS } from '@/game/data';
import { motion } from 'framer-motion';
import { playHitSound, playSplashSound, playKillSound, playPlaceSound, playWaveStartSound } from '@/game/audio';

const MapSelect = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-game-gradient flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-2xl"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Wybierz <span className="text-primary text-glow-gold">Pole Bitwy</span>
        </h1>
        <p className="font-body text-muted-foreground text-lg">
          Strategicznie rozmieszczaj wieże, aby pokonać fale wrogów
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {MAPS.map(map => (
            <motion.button
              key={map.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(map.id)}
              className="bg-card border border-border rounded-xl p-6 text-left hover:border-primary/50 transition-colors"
            >
              <div className="text-4xl mb-3">{map.theme === 'volcanic' ? '🌋' : '❄️'}</div>
              <h3 className="font-display text-lg font-bold text-foreground">{map.name}</h3>
              <p className="font-body text-sm text-muted-foreground mt-1">
                {map.cols}x{map.rows} • 12 fal • Boss na końcu
              </p>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Powrót do strony głównej
        </button>
      </motion.div>
    </div>
  );
};

const GamePlay = ({ mapId }: { mapId: string }) => {
  const navigate = useNavigate();
  const { state, map, placeTower, upgradeTower, sellTower, startWave, resetGame, speed, paused, setGameSpeed, togglePause } = useGameEngine(mapId);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const [selectedPlaced, setSelectedPlaced] = useState<string | null>(null);

  // Track explosion count for audio
  const prevExplosionCount = useRef(0);
  const prevEnemyCount = useRef(0);

  useEffect(() => {
    const newExplosions = state.explosions.length - prevExplosionCount.current;
    if (newExplosions > 0) {
      const hasKill = state.explosions.some(e => e.type === 'kill' && e.timer > 0.45);
      const hasSplash = state.explosions.some(e => (e.type === 'splash' || e.type === 'fire' || e.type === 'ice') && e.timer > 0.3);
      if (hasKill) playKillSound();
      else if (hasSplash) playSplashSound();
      else playHitSound();
    }
    prevExplosionCount.current = state.explosions.length;
  }, [state.explosions.length]);

  const handleCellClick = useCallback((col: number, row: number) => {
    if (selectedTower) {
      const success = placeTower(selectedTower, col, row);
      if (success) {
        setSelectedTower(null);
        playPlaceSound();
      }
    }
    setSelectedPlaced(null);
  }, [selectedTower, placeTower]);

  const handleTowerClick = useCallback((towerId: string) => {
    setSelectedPlaced(prev => prev === towerId ? null : towerId);
    setSelectedTower(null);
  }, []);

  const handleUpgrade = useCallback((towerId: string) => {
    upgradeTower(towerId);
    playPlaceSound();
  }, [upgradeTower]);

  const handleSell = useCallback((towerId: string) => {
    sellTower(towerId);
    setSelectedPlaced(null);
  }, [sellTower]);

  const handleStartWave = useCallback(() => {
    startWave();
    playWaveStartSound();
  }, [startWave]);

  return (
    <div className="min-h-screen bg-game-gradient p-3 md:p-4 space-y-3">
      <GameHUD
        state={state}
        mapName={map.name}
        onStartWave={handleStartWave}
        onReset={resetGame}
        onBack={() => navigate('/game')}
      />
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 overflow-auto">
          <GameBoard
            map={map}
            state={state}
            selectedTower={selectedTower}
            selectedPlaced={selectedPlaced}
            onCellClick={handleCellClick}
            onTowerClick={handleTowerClick}
          />
        </div>
        <TowerPanel
          state={state}
          selectedTower={selectedTower}
          selectedPlaced={selectedPlaced}
          onSelectTower={setSelectedTower}
          onUpgrade={handleUpgrade}
          onSell={handleSell}
        />
      </div>
    </div>
  );
};

const Game = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mapId = searchParams.get('map');

  if (!mapId) {
    return <MapSelect onSelect={(id) => setSearchParams({ map: id })} />;
  }

  return <GamePlay mapId={mapId} />;
};

export default Game;
