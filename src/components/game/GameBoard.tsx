import { memo, useCallback } from 'react';
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

const CellComponent = memo(({ type, col, row, theme, hasTower, isSelected, onClick }: {
  type: string; col: number; row: number; theme: string; hasTower: boolean; isSelected: boolean;
  onClick: () => void;
}) => {
  const isVolcanic = theme === 'volcanic';
  let bg = '';
  switch (type) {
    case 'path':
    case 'start':
    case 'end':
      bg = isVolcanic ? 'bg-orange-900/60' : 'bg-slate-400/40';
      break;
    case 'buildable':
      bg = isVolcanic ? 'bg-stone-800/50 hover:bg-stone-700/60' : 'bg-sky-950/40 hover:bg-sky-900/50';
      break;
    case 'blocked':
      bg = isVolcanic ? 'bg-stone-900/80' : 'bg-slate-800/60';
      break;
  }

  return (
    <div
      onClick={onClick}
      className={`${bg} border border-border/20 cursor-pointer transition-colors relative ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${type === 'start' ? 'border-l-2 border-l-nature' : ''} ${type === 'end' ? 'border-r-2 border-r-fire' : ''}`}
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
    />
  );
});
CellComponent.displayName = 'CellComponent';

const GameBoard = ({ map, state, selectedTower, selectedPlaced, onCellClick, onTowerClick }: GameBoardProps) => {
  const boardWidth = map.cols * CELL_SIZE;
  const boardHeight = map.rows * CELL_SIZE;

  return (
    <div className="relative overflow-auto rounded-xl border border-border bg-card" style={{ maxWidth: '100%' }}>
      <div className="relative" style={{ width: boardWidth, height: boardHeight, minWidth: boardWidth }}>
        {/* Grid cells */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${map.cols}, ${CELL_SIZE}px)` }}>
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
                  onClick={() => tower ? onTowerClick(tower.id) : onCellClick(c, r)}
                />
              );
            })
          )}
        </div>

        {/* Towers */}
        {state.towers.map(tower => {
          const def = TOWERS.find(t => t.id === tower.defId)!;
          const isSelected = tower.id === selectedPlaced;
          return (
            <div
              key={tower.id}
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

        {/* Enemies */}
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
              {/* HP bar */}
              <div className="absolute -top-1 left-1 right-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    hpPercent > 50 ? 'bg-nature' : hpPercent > 25 ? 'bg-legendary' : 'bg-fire'
                  }`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              {/* Slow indicator */}
              {enemy.slowTimer > 0 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px]">❄️</div>
              )}
            </div>
          );
        })}

        {/* Projectiles */}
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
      </div>
    </div>
  );
};

export default memo(GameBoard);
