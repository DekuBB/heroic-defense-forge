import { memo, useCallback, useRef, useEffect, useState } from 'react';
import { GameState, GameMap, CELL_SIZE, PlacedTower, Explosion } from '@/game/types';
import { TOWERS, ENEMIES } from '@/game/data';

interface GameBoardProps {
  map: GameMap;
  state: GameState;
  selectedTower: string | null;
  selectedPlaced: string | null;
  onCellClick: (col: number, row: number) => void;
  onTowerClick: (towerId: string) => void;
}

const TOWER_SELECTED_CLASS = 'ring-2 ring-primary/50 bg-primary/10 animate-pulse';

const CellComponent = memo(({ type, col, row, theme, hasTower, isSelected, isBuildHighlight, onClick }: {
  type: string; col: number; row: number; theme: string; hasTower: boolean; isSelected: boolean;
  isBuildHighlight: boolean; onClick: () => void;
}) => {
  let bg = '';
  const isVolcanic = theme === 'volcanic';
  const isForest = theme === 'forest';
  const isDesert = theme === 'desert';
  switch (type) {
    case 'path':
    case 'start':
    case 'end':
      bg = isVolcanic ? 'bg-orange-900/60' : isForest ? 'bg-amber-900/50' : isDesert ? 'bg-yellow-800/50' : 'bg-slate-400/40';
      break;
    case 'buildable':
      bg = isVolcanic ? 'bg-stone-800/50 hover:bg-stone-700/60' : isForest ? 'bg-emerald-950/50 hover:bg-emerald-900/60' : isDesert ? 'bg-amber-950/40 hover:bg-amber-900/50' : 'bg-sky-950/40 hover:bg-sky-900/50';
      break;
    case 'blocked':
      bg = isVolcanic ? 'bg-stone-900/80' : isForest ? 'bg-green-950/80' : isDesert ? 'bg-yellow-950/60' : 'bg-slate-800/60';
      break;
  }

  const isBuildable = type === 'buildable';

  return (
    <div
      role={isBuildable ? 'button' : undefined}
      tabIndex={isBuildable ? 0 : -1}
      aria-label={isBuildable ? `Pole ${col},${row}` : undefined}
      data-testid={`cell-${col}-${row}`}
      data-cell-type={type}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isBuildable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`${bg} border border-border/20 cursor-pointer transition-colors relative ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isBuildHighlight && !hasTower ? TOWER_SELECTED_CLASS : ''} ${type === 'start' ? 'border-l-2 border-l-nature' : ''} ${type === 'end' ? 'border-r-2 border-r-fire' : ''} ${
        isBuildable ? 'focus:ring-2 focus:ring-primary focus:outline-none' : ''
      }`}
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
    />
  );
});
CellComponent.displayName = 'CellComponent';

const GameBoard = ({ map, state, selectedTower, selectedPlaced, onCellClick, onTowerClick }: GameBoardProps) => {
  const boardWidth = map.cols * CELL_SIZE;
  const boardHeight = map.rows * CELL_SIZE;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Auto-scale board to fit container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const parentWidth = container.parentElement?.clientWidth || window.innerWidth;
      const maxWidth = parentWidth - 16; // padding
      const maxHeight = window.innerHeight - 180; // HUD + panel space
      const scaleX = maxWidth / boardWidth;
      const scaleY = maxHeight / boardHeight;
      const newScale = Math.min(scaleX, scaleY, 1); // never scale up
      setScale(Math.max(newScale, 0.3)); // minimum 30%
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [boardWidth, boardHeight]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto rounded-xl border border-border bg-card"
      data-testid="game-board"
      style={{ maxWidth: '100%' }}
    >
      <div
        className="relative origin-top-left"
        style={{
          width: boardWidth,
          height: boardHeight,
          minWidth: boardWidth,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Grid cells - z-0, fully interactive */}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${map.cols}, ${CELL_SIZE}px)`, zIndex: 0 }}
        >
          {map.grid.map((row, r) =>
            row.map((cell, c) => {
              const tower = state.towers.find(t => t.col === c && t.row === r);
              return (
                <CellComponent
                  key={`${c}-${r}`}
                  type={cell}
                  col={c}
                  row={r}
                  theme={map.theme}
                  hasTower={!!tower}
                  isSelected={tower?.id === selectedPlaced}
                  isBuildHighlight={!!selectedTower && cell === 'buildable'}
                  onClick={() => tower ? onTowerClick(tower.id) : onCellClick(c, r)}
                />
              );
            })
          )}
        </div>

        {/* Towers - z-10, interactive */}
        {state.towers.map(tower => {
          const def = TOWERS.find(t => t.id === tower.defId)!;
          const isSelected = tower.id === selectedPlaced;
          return (
            <div
              key={tower.id}
              role="button"
              tabIndex={0}
              aria-label={`${def.name} poziom ${tower.level + 1}`}
              data-testid={`tower-${tower.id}`}
              className={`absolute flex items-center justify-center cursor-pointer transition-transform ${
                isSelected ? 'scale-110 z-20' : 'z-10 hover:scale-105'
              }`}
              style={{
                left: tower.col * CELL_SIZE,
                top: tower.row * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
              onClick={(e) => { e.stopPropagation(); onTowerClick(tower.id); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTowerClick(tower.id);
                }
              }}
            >
              <div className="text-2xl drop-shadow-lg">{def.emoji}</div>
              {tower.level > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {tower.level}
                </div>
              )}
              {isSelected && (
                <div
                  className="absolute rounded-full border-2 border-primary/30 pointer-events-none"
                  style={{
                    width: (def.upgrades[tower.level - 1]?.range || def.range) * 2 * CELL_SIZE,
                    height: (def.upgrades[tower.level - 1]?.range || def.range) * 2 * CELL_SIZE,
                    left: -(((def.upgrades[tower.level - 1]?.range || def.range) * 2 * CELL_SIZE - CELL_SIZE) / 2),
                    top: -(((def.upgrades[tower.level - 1]?.range || def.range) * 2 * CELL_SIZE - CELL_SIZE) / 2),
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Enemies - pointer-events-none */}
        {state.enemies.map(enemy => {
          const def = ENEMIES.find(e => e.id === enemy.defId)!;
          const hpPercent = (enemy.hp / enemy.maxHp) * 100;
          return (
            <div
              key={enemy.id}
              className="absolute z-30 pointer-events-none transition-none"
              style={{
                left: enemy.x - CELL_SIZE / 2,
                top: enemy.y - CELL_SIZE / 2,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              <div className={`text-2xl text-center ${def.isBoss ? 'text-3xl animate-pulse' : ''}`}>
                {def.emoji}
              </div>
              <div className="absolute -top-1 left-1 right-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    hpPercent > 50 ? 'bg-nature' : hpPercent > 25 ? 'bg-legendary' : 'bg-fire'
                  }`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              {enemy.slowTimer > 0 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px]">❄️</div>
              )}
            </div>
          );
        })}

        {/* Projectiles - pointer-events-none */}
        {state.projectiles.map(proj => {
          const x = proj.fromX + (proj.toX - proj.fromX) * proj.progress;
          const y = proj.fromY + (proj.toY - proj.fromY) * proj.progress;
          return (
            <div
              key={proj.id}
              className="absolute w-2 h-2 rounded-full bg-primary z-40 pointer-events-none"
              style={{
                left: x - 4,
                top: y - 4,
                boxShadow: '0 0 6px hsl(45 100% 55% / 0.8)',
              }}
            />
          );
        })}

        {/* Explosions - pointer-events-none */}
        {state.explosions.map(expl => {
          const progress = 1 - expl.timer / 0.35;
          const sc = 0.5 + progress * 1.5;
          const opacity = 1 - progress;
          const colors: Record<Explosion['type'], string> = {
            hit: 'hsl(45 100% 55%)',
            splash: 'hsl(15 90% 55%)',
            ice: 'hsl(200 90% 65%)',
            fire: 'hsl(15 90% 45%)',
            kill: 'hsl(45 100% 60%)',
          };
          const glowColors: Record<Explosion['type'], string> = {
            hit: 'hsl(45 100% 55% / 0.6)',
            splash: 'hsl(15 90% 55% / 0.6)',
            ice: 'hsl(200 90% 65% / 0.6)',
            fire: 'hsl(15 90% 45% / 0.6)',
            kill: 'hsl(45 100% 60% / 0.8)',
          };
          const particleCount = expl.type === 'kill' ? 8 : expl.type === 'splash' ? 6 : 4;
          const particles = Array.from({ length: particleCount }, (_, i) => {
            const angle = (i / particleCount) * Math.PI * 2 + (expl.id.charCodeAt(1) || 0);
            const dist = progress * expl.radius * 1.8;
            return {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              size: Math.max(1, (1 - progress) * (expl.type === 'kill' ? 5 : 3)),
            };
          });
          return (
            <div key={expl.id} className="absolute z-50 pointer-events-none" style={{ left: expl.x, top: expl.y }}>
              <div
                className="absolute rounded-full"
                style={{
                  left: -expl.radius,
                  top: -expl.radius,
                  width: expl.radius * 2,
                  height: expl.radius * 2,
                  transform: `scale(${sc})`,
                  opacity,
                  background: `radial-gradient(circle, ${colors[expl.type]} 0%, transparent 70%)`,
                  boxShadow: `0 0 ${expl.radius}px ${glowColors[expl.type]}`,
                }}
              />
              {particles.map((p, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: p.x - p.size / 2,
                    top: p.y - p.size / 2,
                    width: p.size,
                    height: p.size,
                    opacity: opacity * 0.9,
                    backgroundColor: colors[expl.type],
                    boxShadow: `0 0 ${p.size * 2}px ${colors[expl.type]}`,
                  }}
                />
              ))}
              {expl.type === 'kill' && progress < 0.7 && (
                <div
                  className="absolute rounded-full border"
                  style={{
                    left: -(progress * expl.radius * 2.5),
                    top: -(progress * expl.radius * 2.5),
                    width: progress * expl.radius * 5,
                    height: progress * expl.radius * 5,
                    borderColor: `hsl(45 100% 60% / ${(1 - progress / 0.7) * 0.5})`,
                    opacity: 1 - progress / 0.7,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Scaled container needs adjusted height so parent doesn't collapse */}
      <div style={{ width: boardWidth * scale, height: boardHeight * scale, pointerEvents: 'none' }} className="absolute top-0 left-0" />
    </div>
  );
};

export default memo(GameBoard);
