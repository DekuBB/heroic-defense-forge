import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGameEngine } from '@/game/useGameEngine';
import GameBoard from '@/components/game/GameBoard';
import TowerPanel from '@/components/game/TowerPanel';
import GameHUD from '@/components/game/GameHUD';
import Minimap from '@/components/game/Minimap';
import EnemyTooltip from '@/components/game/EnemyTooltip';
import Leaderboard from '@/components/game/Leaderboard';
import Tutorial from '@/components/game/Tutorial';
import NameInput from '@/components/game/NameInput';
import { MAPS } from '@/game/data';
import { Difficulty, DIFFICULTY_SETTINGS, addToLeaderboard } from '@/game/difficulty';
import { motion } from 'framer-motion';
import { playHitSound, playSplashSound, playKillSound, playPlaceSound, playWaveStartSound } from '@/game/audio';

const MapSelect = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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
              <div className="text-4xl mb-3">{map.theme === 'volcanic' ? '🌋' : map.theme === 'forest' ? '🌲' : map.theme === 'desert' ? '🏜️' : '❄️'}</div>
              <h3 className="font-display text-lg font-bold text-foreground">{map.name}</h3>
              <p className="font-body text-sm text-muted-foreground mt-1">
                {map.cols}x{map.rows} • 12 fal • Boss na końcu
              </p>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-6 py-2 bg-secondary text-foreground font-body font-bold text-sm rounded-lg hover:bg-secondary/80 transition-colors border border-border"
          >
            🏆 Ranking
          </button>
          <button
            onClick={() => navigate('/')}
            className="font-body text-sm text-muted-foreground hover:text-primary transition-colors py-2"
          >
            ← Powrót do strony głównej
          </button>
        </div>
      </motion.div>
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
};

const DifficultySelect = ({ onSelect }: { onSelect: (d: Difficulty) => void }) => {
  return (
    <div className="min-h-screen bg-game-gradient flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-lg"
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          Wybierz <span className="text-primary text-glow-gold">Trudność</span>
        </h1>
        <div className="space-y-4">
          {(Object.entries(DIFFICULTY_SETTINGS) as [Difficulty, typeof DIFFICULTY_SETTINGS['easy']][]).map(([key, val]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(key)}
              className="w-full bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 transition-colors flex items-center gap-4"
            >
              <span className="text-3xl">{val.emoji}</span>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-foreground">{val.label}</h3>
                <p className="font-body text-sm text-muted-foreground">
                  🪙 {val.gold} złota • ❤️ {val.lives} żyć • ×{val.scoreMultiplier} pkt
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const GamePlay = ({ mapId, difficulty }: { mapId: string; difficulty: Difficulty }) => {
  const navigate = useNavigate();
  const { state, map, placeTower, upgradeTower, sellTower, startWave, resetGame, speed, paused, setGameSpeed, togglePause } = useGameEngine(mapId, difficulty);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const [selectedPlaced, setSelectedPlaced] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const scoreSubmitted = useRef(false);

  // Track explosion count for audio
  const prevExplosionCount = useRef(0);

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

  // Show name input on game end
  useEffect(() => {
    if ((state.phase === 'won' || state.phase === 'lost') && !scoreSubmitted.current && state.score > 0) {
      setShowNameInput(true);
    }
  }, [state.phase, state.score]);

  const submitScore = useCallback((name: string) => {
    if (scoreSubmitted.current) return;
    scoreSubmitted.current = true;
    setShowNameInput(false);
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const finalScore = Math.floor(state.score * settings.scoreMultiplier);
    addToLeaderboard({
      name,
      score: finalScore,
      map: map.name,
      difficulty,
      wave: state.wave,
      date: new Date().toLocaleDateString('pl-PL'),
    });
  }, [state.score, difficulty, map.name, state.wave]);

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

  const handleReset = useCallback(() => {
    scoreSubmitted.current = false;
    setShowNameInput(false);
    resetGame();
  }, [resetGame]);

  const finalScore = Math.floor(state.score * DIFFICULTY_SETTINGS[difficulty].scoreMultiplier);

  return (
    <div className="min-h-screen bg-game-gradient p-3 md:p-4 space-y-3">
      <GameHUD
        state={state}
        mapName={map.name}
        speed={speed}
        paused={paused}
        onStartWave={handleStartWave}
        onReset={handleReset}
        onBack={() => navigate('/game')}
        onSetSpeed={setGameSpeed}
        onTogglePause={togglePause}
        onShowLeaderboard={() => setShowLeaderboard(true)}
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
        <div className="w-full lg:w-64 space-y-3">
          <TowerPanel
            state={state}
            selectedTower={selectedTower}
            selectedPlaced={selectedPlaced}
            onSelectTower={setSelectedTower}
            onUpgrade={handleUpgrade}
            onSell={handleSell}
          />
          {state.phase === 'combat' && (
            <>
              <Minimap map={map} state={state} />
              <EnemyTooltip enemies={state.enemies} />
            </>
          )}
        </div>
      </div>
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
};

const Game = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mapId = searchParams.get('map');
  const diff = searchParams.get('diff') as Difficulty | null;

  if (!mapId) {
    return <MapSelect onSelect={(id) => setSearchParams({ map: id })} />;
  }

  if (!diff) {
    return <DifficultySelect onSelect={(d) => setSearchParams({ map: mapId, diff: d })} />;
  }

  return <GamePlay mapId={mapId} difficulty={diff} />;
};

export default Game;
