import { TowerDef, EnemyDef, WaveDef, GameMap, CellType } from './types';

// ===== TOWER DEFINITIONS =====
export const TOWERS: TowerDef[] = [
  {
    id: 'archer',
    name: 'Wieża Łuczników',
    emoji: '🏹',
    cost: 50,
    damage: 15,
    range: 3,
    fireRate: 1.5,
    splashRadius: 0,
    slowFactor: 1,
    dotDamage: 0,
    color: 'text-nature',
    upgrades: [
      { cost: 40, damage: 25, range: 3.5, fireRate: 2 },
      { cost: 80, damage: 40, range: 4, fireRate: 2.5 },
    ],
  },
  {
    id: 'arcane',
    name: 'Wieża Magiczna',
    emoji: '🔮',
    cost: 80,
    damage: 25,
    range: 2.5,
    fireRate: 0.8,
    splashRadius: 1.2,
    slowFactor: 1,
    dotDamage: 0,
    color: 'text-epic',
    upgrades: [
      { cost: 60, damage: 40, range: 3, fireRate: 1 },
      { cost: 120, damage: 65, range: 3.5, fireRate: 1.2 },
    ],
  },
  {
    id: 'cannon',
    name: 'Działo Oblężnicze',
    emoji: '💣',
    cost: 120,
    damage: 60,
    range: 3,
    fireRate: 0.4,
    splashRadius: 1.5,
    slowFactor: 1,
    dotDamage: 0,
    color: 'text-fire',
    upgrades: [
      { cost: 80, damage: 90, range: 3.5, fireRate: 0.5 },
      { cost: 160, damage: 140, range: 4, fireRate: 0.6 },
    ],
  },
  {
    id: 'ice',
    name: 'Wieża Lodowa',
    emoji: '❄️',
    cost: 70,
    damage: 10,
    range: 2.5,
    fireRate: 1,
    splashRadius: 1,
    slowFactor: 0.4,
    dotDamage: 0,
    color: 'text-ice',
    upgrades: [
      { cost: 50, damage: 15, range: 3, fireRate: 1.2 },
      { cost: 100, damage: 25, range: 3.5, fireRate: 1.5 },
    ],
  },
  {
    id: 'fire',
    name: 'Wieża Ognia',
    emoji: '🔥',
    cost: 90,
    damage: 20,
    range: 2,
    fireRate: 1.2,
    splashRadius: 0.8,
    slowFactor: 1,
    dotDamage: 8,
    color: 'text-fire',
    upgrades: [
      { cost: 70, damage: 30, range: 2.5, fireRate: 1.5 },
      { cost: 140, damage: 50, range: 3, fireRate: 1.8 },
    ],
  },
];

// ===== ENEMY DEFINITIONS =====
export const ENEMIES: EnemyDef[] = [
  { id: 'goblin', name: 'Goblin', emoji: '👺', hp: 60, speed: 2, reward: 10, isBoss: false },
  { id: 'orc', name: 'Ork', emoji: '👹', hp: 150, speed: 1.2, reward: 20, isBoss: false },
  { id: 'troll', name: 'Troll', emoji: '🧌', hp: 350, speed: 0.7, reward: 35, isBoss: false },
  { id: 'skeleton', name: 'Szkielet', emoji: '💀', hp: 80, speed: 2.5, reward: 12, isBoss: false },
  { id: 'dark_knight', name: 'Mroczny Rycerz', emoji: '🗡️', hp: 500, speed: 0.9, reward: 50, isBoss: false },
  { id: 'spider', name: 'Pająk', emoji: '🕷️', hp: 40, speed: 3.5, reward: 8, isBoss: false },
  { id: 'demon', name: 'Demon', emoji: '👿', hp: 700, speed: 1.0, reward: 60, isBoss: false },
  { id: 'golem', name: 'Golem', emoji: '🗿', hp: 1200, speed: 0.4, reward: 80, isBoss: false },
  { id: 'wraith', name: 'Upiór', emoji: '👻', hp: 200, speed: 3.0, reward: 25, isBoss: false },
  { id: 'necromancer', name: 'Nekromanta', emoji: '☠️', hp: 3000, speed: 0.5, reward: 300, isBoss: true },
  { id: 'dragon', name: 'Smok', emoji: '🐉', hp: 5000, speed: 0.6, reward: 500, isBoss: true },
];

// ===== WAVE DEFINITIONS (12 waves) =====
export const WAVES: WaveDef[] = [
  { enemies: [{ defId: 'goblin', count: 8, interval: 0.8 }], reward: 30 },
  { enemies: [{ defId: 'goblin', count: 10, interval: 0.7 }, { defId: 'skeleton', count: 4, interval: 1 }], reward: 40 },
  { enemies: [{ defId: 'orc', count: 6, interval: 1.2 }], reward: 50 },
  { enemies: [{ defId: 'goblin', count: 12, interval: 0.5 }, { defId: 'orc', count: 4, interval: 1.5 }], reward: 60 },
  { enemies: [{ defId: 'skeleton', count: 15, interval: 0.4 }], reward: 60 },
  { enemies: [{ defId: 'troll', count: 4, interval: 2 }, { defId: 'orc', count: 6, interval: 1 }], reward: 80 },
  { enemies: [{ defId: 'goblin', count: 20, interval: 0.3 }, { defId: 'skeleton', count: 10, interval: 0.5 }], reward: 80 },
  { enemies: [{ defId: 'dark_knight', count: 4, interval: 2.5 }, { defId: 'troll', count: 3, interval: 2 }], reward: 100 },
  { enemies: [{ defId: 'orc', count: 12, interval: 0.6 }, { defId: 'troll', count: 6, interval: 1.5 }], reward: 100 },
  { enemies: [{ defId: 'dark_knight', count: 8, interval: 1.5 }, { defId: 'skeleton', count: 15, interval: 0.3 }], reward: 120 },
  { enemies: [{ defId: 'troll', count: 10, interval: 1 }, { defId: 'dark_knight', count: 6, interval: 2 }], reward: 150 },
  { enemies: [{ defId: 'dark_knight', count: 4, interval: 2 }, { defId: 'necromancer', count: 1, interval: 0 }], reward: 500 },
];

// ===== MAP DEFINITIONS =====
// B = buildable, P = path, X = blocked, S = start, E = end

function parseMap(rows: string[]): { grid: CellType[][]; path: [number, number][] } {
  const grid: CellType[][] = [];
  const pathCells: [number, number][] = [];
  
  for (let r = 0; r < rows.length; r++) {
    const row: CellType[] = [];
    for (let c = 0; c < rows[r].length; c++) {
      const ch = rows[r][c];
      const type: CellType = ch === 'P' ? 'path' : ch === 'B' ? 'buildable' : ch === 'S' ? 'start' : ch === 'E' ? 'end' : 'blocked';
      row.push(type);
      if (ch === 'S' || ch === 'P' || ch === 'E') {
        pathCells.push([c, r]);
      }
    }
    grid.push(row);
  }

  // Sort path by connectivity (BFS from start)
  const start = pathCells.find(([c, r]) => grid[r][c] === 'start');
  if (!start) return { grid, path: pathCells };

  const visited = new Set<string>();
  const ordered: [number, number][] = [];
  const queue: [number, number][] = [start];
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [cx, cy] = queue.shift()!;
    ordered.push([cx, cy]);

    const neighbors: [number, number][] = [[cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]];
    for (const [nx, ny] of neighbors) {
      const key = `${nx},${ny}`;
      if (!visited.has(key) && ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
        const t = grid[ny][nx];
        if (t === 'path' || t === 'end') {
          visited.add(key);
          queue.push([nx, ny]);
        }
      }
    }
  }

  return { grid, path: ordered };
}

const volcanicRaw = [
  'XBBBBBBBBBBBBBBBX',
  'SPPPBBBBBBBBBBBBX',
  'XBBPBBBBXBBBBBBBX',
  'XBBPPPPPPPBBBBBBX',
  'XBBBBBBBXPBBBBBBX',
  'XBBBBBBBXPPPPPBBX',
  'XBBBBBBBBBBBBPBBX',
  'XBBPPPPPPPPPPPBBX',
  'XBBPBBBBXBBBBBBBX',
  'XBBPPPPPPPPPBBBEX',
  'XBBBBBBBBBBBBBBBX',
];

const tundraRaw = [
  'XBBBBBBBBBBBBBBBX',
  'XBBBBBBBSBBBBBBEX',
  'XBBBBBBBPBBBBBBPX',
  'XBBBPPPPPPBBBBBPX',
  'XBBBPBBBBBBBBBBPX',
  'XBBBPBBBBBBPPPPPX',
  'XBBBPBBBBBBPBBBXX',
  'XBBBPPPPPPPPBBBXX',
  'XBBBBBBBBBBBBBBBX',
  'XBBBBBBBBBBBBBBBX',
  'XBBBBBBBBBBBBBBBX',
];

const forestRaw = [
  'XBBBBBBBBBBBBBBBX',
  'XBBBSPPPPPPBBBBEX',
  'XBBBBBBBBBPBBBBPX',
  'XBBBBBBBBBPBBBBPX',
  'XBBPPPPPPPPPBBBPX',
  'XBBPBBBBBBBBBBPPX',
  'XBBPBBBBBBBBBBBBX',
  'XBBPPPPPPPPPPBBBX',
  'XBBBBBBBBBBBPBBBX',
  'XBBBBBBBBBBBPBBBX',
  'XBBBBBBBBBBBBBBBX',
];

const desertRaw = [
  'XBBBBBBBBBBBBBBBX',
  'SPPPPPBBBBBBBBBBX',
  'XBBBBPBBBBBBBBBBX',
  'XBBBBPPPPPBBBBBBX',
  'XBBBBBBBBPBBBBBBX',
  'XBBBBBBBBPPPPPBBX',
  'XBBBBBBBBBBBBPBBX',
  'XBBBBBBPPPPPPPBBX',
  'XBBBBBBPBBBBBBBBX',
  'XBBBBBBPPPPPPPPEX',
  'XBBBBBBBBBBBBBBBX',
];

const volcanic = parseMap(volcanicRaw);
const tundra = parseMap(tundraRaw);
const forest = parseMap(forestRaw);
const desert = parseMap(desertRaw);

export const MAPS: GameMap[] = [
  {
    id: 'volcanic',
    name: 'Wulkaniczna Pustkowie',
    cols: 18,
    rows: 11,
    grid: volcanic.grid,
    path: volcanic.path,
    theme: 'volcanic',
  },
  {
    id: 'tundra',
    name: 'Śnieżna Tundra',
    cols: 18,
    rows: 11,
    grid: tundra.grid,
    path: tundra.path,
    theme: 'tundra',
  },
  {
    id: 'forest',
    name: 'Mroczny Las',
    cols: 18,
    rows: 11,
    grid: forest.grid,
    path: forest.path,
    theme: 'forest',
  },
  {
    id: 'desert',
    name: 'Pustynne Wydmy',
    cols: 18,
    rows: 11,
    grid: desert.grid,
    path: desert.path,
    theme: 'desert',
  },
];
