export type CellType = 'path' | 'buildable' | 'blocked' | 'start' | 'end';

export interface MapCell {
  type: CellType;
  x: number;
  y: number;
}

export interface GameMap {
  id: string;
  name: string;
  cols: number;
  rows: number;
  grid: CellType[][];
  path: [number, number][]; // ordered path coordinates [col, row]
  theme: 'volcanic' | 'tundra' | 'forest' | 'desert';
}

export interface TowerDef {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  damage: number;
  range: number; // in cells
  fireRate: number; // shots per second
  splashRadius: number; // 0 = single target
  slowFactor: number; // 1 = no slow, 0.5 = half speed
  dotDamage: number; // damage over time per tick
  color: string; // tailwind color class
  upgrades: TowerUpgrade[];
}

export interface TowerUpgrade {
  cost: number;
  damage: number;
  range: number;
  fireRate: number;
}

export interface PlacedTower {
  id: string;
  defId: string;
  col: number;
  row: number;
  level: number; // 0-2
  lastFired: number;
  target: string | null;
}

export interface EnemyDef {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  speed: number; // cells per second
  reward: number;
  isBoss: boolean;
}

export interface ActiveEnemy {
  id: string;
  defId: string;
  hp: number;
  maxHp: number;
  pathIndex: number; // float - position along path
  speed: number;
  slowTimer: number;
  dotTimer: number;
  dotDamage: number;
  x: number; // pixel position
  y: number;
}

export interface WaveDef {
  enemies: { defId: string; count: number; interval: number }[];
  reward: number;
}

export interface Projectile {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number; // 0-1
  damage: number;
  splashRadius: number;
  slowFactor: number;
  dotDamage: number;
  targetId: string;
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  radius: number; // visual radius
  timer: number; // seconds remaining
  type: 'hit' | 'splash' | 'ice' | 'fire' | 'kill';
}

export interface GameState {
  gold: number;
  lives: number;
  wave: number;
  phase: 'prep' | 'combat' | 'won' | 'lost';
  towers: PlacedTower[];
  enemies: ActiveEnemy[];
  projectiles: Projectile[];
  explosions: Explosion[];
  spawnQueue: { defId: string; delay: number }[];
  spawnTimer: number;
  score: number;
}

export const CELL_SIZE = 48;
