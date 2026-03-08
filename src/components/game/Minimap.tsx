import { memo } from 'react';
import { GameState, GameMap, CELL_SIZE } from '@/game/types';

interface MinimapProps {
  map: GameMap;
  state: GameState;
}

const Minimap = memo(({ map, state }: MinimapProps) => {
  const scale = 4;
  const w = map.cols * scale;
  const h = map.rows * scale;

  return (
    <div className="bg-card border border-border rounded-lg p-2">
      <p className="font-body text-[10px] text-muted-foreground mb-1 text-center">Minimapa</p>
      <div className="relative mx-auto" style={{ width: w, height: h }}>
        {/* Grid */}
        <svg width={w} height={h} className="absolute inset-0">
          {map.grid.map((row, r) =>
            row.map((cell, c) => {
              let fill = '#1a1a2e';
              if (cell === 'path' || cell === 'start' || cell === 'end') fill = '#6b4c3b';
              else if (cell === 'buildable') fill = '#2a2a3e';
              return <rect key={`${c}-${r}`} x={c * scale} y={r * scale} width={scale} height={scale} fill={fill} />;
            })
          )}
        </svg>
        {/* Towers */}
        {state.towers.map(t => (
          <div
            key={t.id}
            className="absolute bg-primary rounded-full"
            style={{
              left: t.col * scale,
              top: t.row * scale,
              width: scale,
              height: scale,
            }}
          />
        ))}
        {/* Enemies */}
        {state.enemies.map(e => (
          <div
            key={e.id}
            className="absolute bg-fire rounded-full"
            style={{
              left: (e.x / CELL_SIZE) * scale - 1,
              top: (e.y / CELL_SIZE) * scale - 1,
              width: 3,
              height: 3,
            }}
          />
        ))}
      </div>
    </div>
  );
});

Minimap.displayName = 'Minimap';
export default Minimap;
