import { TOWERS } from '@/game/data';
import { GameState, PlacedTower } from '@/game/types';

interface TowerPanelProps {
  state: GameState;
  selectedTower: string | null;
  selectedPlaced: string | null;
  onSelectTower: (id: string | null) => void;
  onUpgrade: (towerId: string) => void;
  onSell: (towerId: string) => void;
}

const TowerPanel = ({ state, selectedTower, selectedPlaced, onSelectTower, onUpgrade, onSell }: TowerPanelProps) => {
  const placedTower = selectedPlaced ? state.towers.find(t => t.id === selectedPlaced) : null;
  const placedDef = placedTower ? TOWERS.find(t => t.id === placedTower.defId) : null;

  return (
    <div className="w-full lg:w-64 space-y-4">
      {/* Tower Selection */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-display text-sm font-bold text-foreground">Wieże</h3>
        <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
          {TOWERS.map(tower => {
            const canAfford = state.gold >= tower.cost;
            const isSelected = selectedTower === tower.id;
            return (
              <button
                key={tower.id}
                onClick={() => onSelectTower(isSelected ? null : tower.id)}
                disabled={!canAfford}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : canAfford
                    ? 'border-border hover:border-primary/50 bg-secondary/30'
                    : 'border-border/50 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-xl lg:text-2xl">{tower.emoji}</span>
                <div className="hidden lg:block flex-1 min-w-0">
                  <div className="text-xs font-bold font-body text-foreground truncate">{tower.name}</div>
                  <div className="text-xs font-body text-primary">{tower.cost} 🪙</div>
                </div>
                <span className="lg:hidden text-[10px] font-body text-primary">{tower.cost}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tower Info */}
      {selectedTower && !selectedPlaced && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          {(() => {
            const def = TOWERS.find(t => t.id === selectedTower)!;
            return (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{def.emoji}</span>
                  <h4 className="font-display text-sm font-bold text-foreground">{def.name}</h4>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs font-body">
                  <span className="text-muted-foreground">Obrażenia:</span><span className="text-foreground">{def.damage}</span>
                  <span className="text-muted-foreground">Zasięg:</span><span className="text-foreground">{def.range}</span>
                  <span className="text-muted-foreground">Szybkość:</span><span className="text-foreground">{def.fireRate}/s</span>
                  {def.splashRadius > 0 && <><span className="text-muted-foreground">Splash:</span><span className="text-foreground">{def.splashRadius}</span></>}
                  {def.slowFactor < 1 && <><span className="text-muted-foreground">Spowolnienie:</span><span className="text-accent">Tak</span></>}
                  {def.dotDamage > 0 && <><span className="text-muted-foreground">DoT:</span><span className="text-fire">{def.dotDamage}/s</span></>}
                </div>
                <p className="text-xs text-muted-foreground font-body">Kliknij na puste pole, aby postawić</p>
              </>
            );
          })()}
        </div>
      )}

      {/* Placed Tower Info */}
      {placedTower && placedDef && (
        <div className="bg-card border border-primary/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{placedDef.emoji}</span>
            <div>
              <h4 className="font-display text-sm font-bold text-foreground">{placedDef.name}</h4>
              <span className="text-xs font-body text-primary">Poziom {placedTower.level + 1}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {placedTower.level < placedDef.upgrades.length && (
              <button
                onClick={() => onUpgrade(placedTower.id)}
                disabled={state.gold < placedDef.upgrades[placedTower.level].cost}
                className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground font-body font-bold text-xs rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Ulepsz ({placedDef.upgrades[placedTower.level].cost} 🪙)
              </button>
            )}
            <button
              onClick={() => onSell(placedTower.id)}
              className="px-3 py-1.5 bg-destructive/20 text-destructive font-body font-bold text-xs rounded-lg hover:bg-destructive/30 transition-colors"
            >
              Sprzedaj
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TowerPanel;
