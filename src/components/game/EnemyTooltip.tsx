import { ENEMIES } from '@/game/data';
import { ActiveEnemy } from '@/game/types';

interface EnemyTooltipProps {
  enemies: ActiveEnemy[];
}

const EnemyTooltip = ({ enemies }: EnemyTooltipProps) => {
  // Show unique enemy types currently on the field
  const types = new Map<string, { count: number; minHp: number; maxHp: number }>();
  for (const e of enemies) {
    const existing = types.get(e.defId);
    if (existing) {
      existing.count++;
      existing.minHp = Math.min(existing.minHp, e.hp);
      existing.maxHp = Math.max(existing.maxHp, e.hp);
    } else {
      types.set(e.defId, { count: 1, minHp: e.hp, maxHp: e.hp });
    }
  }

  if (types.size === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-2 space-y-1">
      <p className="font-body text-[10px] text-muted-foreground text-center">Wrogowie na polu</p>
      {Array.from(types.entries()).map(([defId, info]) => {
        const def = ENEMIES.find(e => e.id === defId);
        if (!def) return null;
        return (
          <div key={defId} className="flex items-center gap-2 text-xs font-body">
            <span>{def.emoji}</span>
            <span className="text-foreground font-bold">{def.name}</span>
            <span className="text-muted-foreground">×{info.count}</span>
            <span className={`ml-auto ${def.isBoss ? 'text-fire' : 'text-nature'}`}>
              {Math.floor(info.minHp)}-{Math.floor(info.maxHp)} HP
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default EnemyTooltip;
