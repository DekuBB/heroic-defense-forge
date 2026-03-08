import { useState, useRef, useCallback, useEffect } from 'react';
import { GameState, PlacedTower, ActiveEnemy, Projectile, Explosion, CELL_SIZE } from './types';
import { TOWERS, ENEMIES, WAVES, MAPS } from './data';

let nextId = 0;
const uid = () => `e${++nextId}`;

function getTowerStats(tower: PlacedTower) {
  const def = TOWERS.find(t => t.id === tower.defId)!;
  if (tower.level === 0) return { damage: def.damage, range: def.range, fireRate: def.fireRate, splashRadius: def.splashRadius, slowFactor: def.slowFactor, dotDamage: def.dotDamage };
  const up = def.upgrades[tower.level - 1];
  return { damage: up.damage, range: up.range, fireRate: up.fireRate, splashRadius: def.splashRadius, slowFactor: def.slowFactor, dotDamage: def.dotDamage };
}

export function useGameEngine(mapId: string) {
  const map = MAPS.find(m => m.id === mapId) || MAPS[0];
  
  const [state, setState] = useState<GameState>({
    gold: 200,
    lives: 20,
    wave: 0,
    phase: 'prep',
    towers: [],
    enemies: [],
    projectiles: [],
    explosions: [],
    spawnQueue: [],
    spawnTimer: 0,
    score: 0,
  });

  const [speed, setSpeed] = useState<number>(1);
  const [paused, setPaused] = useState(false);

  const stateRef = useRef(state);
  stateRef.current = state;
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const runningRef = useRef(false);
  const gameLoopRef = useRef<(time: number) => void>(() => {});
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const pathPixels = useCallback((pathIndex: number) => {
    const path = map.path;
    const i = Math.floor(pathIndex);
    const frac = pathIndex - i;
    if (i >= path.length - 1) {
      const [cx, cy] = path[path.length - 1];
      return { x: cx * CELL_SIZE + CELL_SIZE / 2, y: cy * CELL_SIZE + CELL_SIZE / 2 };
    }
    const [x1, y1] = path[i];
    const [x2, y2] = path[Math.min(i + 1, path.length - 1)];
    return {
      x: (x1 + (x2 - x1) * frac) * CELL_SIZE + CELL_SIZE / 2,
      y: (y1 + (y2 - y1) * frac) * CELL_SIZE + CELL_SIZE / 2,
    };
  }, [map.path]);

  const placeTower = useCallback((defId: string, col: number, row: number) => {
    const s = stateRef.current;
    const def = TOWERS.find(t => t.id === defId);
    if (!def || s.gold < def.cost) return false;
    if (s.towers.some(t => t.col === col && t.row === row)) return false;
    if (map.grid[row]?.[col] !== 'buildable') return false;

    const tower: PlacedTower = { id: uid(), defId, col, row, level: 0, lastFired: 0, target: null };
    setState(prev => ({ ...prev, gold: prev.gold - def.cost, towers: [...prev.towers, tower] }));
    return true;
  }, [map.grid]);

  const upgradeTower = useCallback((towerId: string) => {
    const s = stateRef.current;
    const tower = s.towers.find(t => t.id === towerId);
    if (!tower) return false;
    const def = TOWERS.find(t => t.id === tower.defId)!;
    if (tower.level >= def.upgrades.length) return false;
    const cost = def.upgrades[tower.level].cost;
    if (s.gold < cost) return false;

    setState(prev => ({
      ...prev,
      gold: prev.gold - cost,
      towers: prev.towers.map(t => t.id === towerId ? { ...t, level: t.level + 1 } : t),
    }));
    return true;
  }, []);

  const sellTower = useCallback((towerId: string) => {
    const s = stateRef.current;
    const tower = s.towers.find(t => t.id === towerId);
    if (!tower) return;
    const def = TOWERS.find(t => t.id === tower.defId)!;
    let totalCost = def.cost;
    for (let i = 0; i < tower.level; i++) totalCost += def.upgrades[i].cost;
    const refund = Math.floor(totalCost * 0.6);

    setState(prev => ({
      ...prev,
      gold: prev.gold + refund,
      towers: prev.towers.filter(t => t.id !== towerId),
    }));
  }, []);

  const startWave = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== 'prep') return;
    if (s.wave >= WAVES.length) return;

    const waveDef = WAVES[s.wave];
    const queue: { defId: string; delay: number }[] = [];
    let totalDelay = 0;
    
    for (const group of waveDef.enemies) {
      for (let i = 0; i < group.count; i++) {
        queue.push({ defId: group.defId, delay: totalDelay });
        totalDelay += group.interval;
      }
    }

    setState(prev => ({
      ...prev,
      phase: 'combat',
      spawnQueue: queue,
      spawnTimer: 0,
    }));

    runningRef.current = true;
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame((t) => gameLoopRef.current(t));
  }, []);

  const togglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  const setGameSpeed = useCallback((s: number) => {
    setSpeed(s);
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (pausedRef.current) {
      lastTimeRef.current = time;
      if (runningRef.current) {
        rafRef.current = requestAnimationFrame((t) => gameLoopRef.current(t));
      }
      return;
    }
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05) * speedRef.current;
    lastTimeRef.current = time;

    setState(prev => {
      const s = { ...prev };
      s.enemies = [...s.enemies];
      s.projectiles = [...s.projectiles];
      s.towers = [...s.towers];
      s.spawnQueue = [...s.spawnQueue];
      s.explosions = [...s.explosions];

      // Spawn enemies
      s.spawnTimer += dt;
      const toSpawn = s.spawnQueue.filter(sq => sq.delay <= s.spawnTimer);
      s.spawnQueue = s.spawnQueue.filter(sq => sq.delay > s.spawnTimer);

      for (const spawn of toSpawn) {
        const def = ENEMIES.find(e => e.id === spawn.defId);
        if (!def) continue;
        const pos = pathPixels(0);
        s.enemies.push({
          id: uid(),
          defId: def.id,
          hp: def.hp,
          maxHp: def.hp,
          pathIndex: 0,
          speed: def.speed,
          slowTimer: 0,
          dotTimer: 0,
          dotDamage: 0,
          x: pos.x,
          y: pos.y,
        });
      }

      // Move enemies - create new objects to avoid mutation
      const reachedEnd: string[] = [];
      s.enemies = s.enemies.map(enemy => {
        const e = { ...enemy };
        // Apply slow
        let speed = e.speed;
        if (e.slowTimer > 0) {
          speed *= 0.4;
          e.slowTimer -= dt;
        }
        // Apply DOT
        if (e.dotTimer > 0) {
          e.hp -= e.dotDamage * dt;
          e.dotTimer -= dt;
        }

        e.pathIndex += speed * dt;
        const pos = pathPixels(e.pathIndex);
        e.x = pos.x;
        e.y = pos.y;

        if (e.pathIndex >= map.path.length - 1) {
          reachedEnd.push(e.id);
        }
        return e;
      });

      // Remove enemies that reached end
      if (reachedEnd.length > 0) {
        s.lives -= reachedEnd.length;
        s.enemies = s.enemies.filter(e => !reachedEnd.includes(e.id));
      }

      // Tower firing - create new tower objects to preserve immutability
      const now = s.spawnTimer; // use spawnTimer as continuous time
      s.towers = s.towers.map(tower => {
        const stats = getTowerStats(tower);
        const interval = 1 / stats.fireRate;
        if (now - tower.lastFired < interval) return tower;

        // Find closest enemy in range
        const towerX = tower.col * CELL_SIZE + CELL_SIZE / 2;
        const towerY = tower.row * CELL_SIZE + CELL_SIZE / 2;
        const rangePixels = stats.range * CELL_SIZE;

        let closest: ActiveEnemy | null = null;
        let closestDist = Infinity;
        for (const enemy of s.enemies) {
          if (enemy.hp <= 0) continue;
          const dx = enemy.x - towerX;
          const dy = enemy.y - towerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= rangePixels && dist < closestDist) {
            closest = enemy;
            closestDist = dist;
          }
        }

        if (closest) {
          s.projectiles.push({
            id: uid(),
            fromX: towerX,
            fromY: towerY,
            toX: closest.x,
            toY: closest.y,
            progress: 0,
            damage: stats.damage,
            splashRadius: stats.splashRadius,
            slowFactor: stats.slowFactor,
            dotDamage: stats.dotDamage,
            targetId: closest.id,
          });
          return { ...tower, lastFired: now, target: closest.id };
        }
        return tower;
      });

      // Move projectiles
      const hitProjectiles: string[] = [];
      for (const proj of s.projectiles) {
        proj.progress += dt * 5;
        if (proj.progress >= 1) {
          hitProjectiles.push(proj.id);
          // Create explosion effect
          const explType: Explosion['type'] = proj.splashRadius > 0
            ? (proj.slowFactor < 1 ? 'ice' : proj.dotDamage > 0 ? 'fire' : 'splash')
            : 'hit';
          s.explosions.push({
            id: uid(),
            x: proj.toX,
            y: proj.toY,
            radius: proj.splashRadius > 0 ? proj.splashRadius * CELL_SIZE : 16,
            timer: 0.35,
            type: explType,
          });
          // Apply damage
          if (proj.splashRadius > 0) {
            const splashPx = proj.splashRadius * CELL_SIZE;
            s.enemies = s.enemies.map(enemy => {
              const dx = enemy.x - proj.toX;
              const dy = enemy.y - proj.toY;
              if (Math.sqrt(dx * dx + dy * dy) <= splashPx) {
                const e = { ...enemy, hp: enemy.hp - proj.damage };
                if (proj.slowFactor < 1) e.slowTimer = 2;
                if (proj.dotDamage > 0) { e.dotDamage = proj.dotDamage; e.dotTimer = 3; }
                return e;
              }
              return enemy;
            });
          } else {
            s.enemies = s.enemies.map(enemy => {
              if (enemy.id === proj.targetId) {
                const e = { ...enemy, hp: enemy.hp - proj.damage };
                if (proj.slowFactor < 1) e.slowTimer = 2;
                if (proj.dotDamage > 0) { e.dotDamage = proj.dotDamage; e.dotTimer = 3; }
                return e;
              }
              return enemy;
            });
          }
        }
      }
      s.projectiles = s.projectiles.filter(p => !hitProjectiles.includes(p.id));

      // Remove dead enemies (create kill explosions)
      const killed = s.enemies.filter(e => e.hp <= 0);
      for (const dead of killed) {
        const def = ENEMIES.find(e => e.id === dead.defId);
        if (def) {
          s.gold += def.reward;
          s.score += def.reward;
          s.explosions.push({
            id: uid(),
            x: dead.x,
            y: dead.y,
            radius: def.isBoss ? 40 : 24,
            timer: 0.5,
            type: 'kill',
          });
        }
      }
      s.enemies = s.enemies.filter(e => e.hp > 0);

      // Decay explosions
      s.explosions = s.explosions
        .map(e => ({ ...e, timer: e.timer - dt }))
        .filter(e => e.timer > 0);

      // Check wave complete
      if (s.phase === 'combat' && s.spawnQueue.length === 0 && s.enemies.length === 0) {
        const waveDef = WAVES[s.wave];
        s.gold += waveDef?.reward || 0;
        s.wave += 1;
        s.phase = s.wave >= WAVES.length ? 'won' : 'prep';
      }

      // Check game over
      if (s.lives <= 0) {
        s.lives = 0;
        s.phase = 'lost';
      }

      return s;
    });

    if (runningRef.current) {
      rafRef.current = requestAnimationFrame((t) => gameLoopRef.current(t));
    }
  }, [map.path, pathPixels]);

  // Keep gameLoopRef in sync
  gameLoopRef.current = gameLoop;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
    };
  }, []);

  const resetGame = useCallback(() => {
    nextId = 0;
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setState({
      gold: 200,
      lives: 20,
      wave: 0,
      phase: 'prep',
      towers: [],
      enemies: [],
      projectiles: [],
      explosions: [],
      spawnQueue: [],
      spawnTimer: 0,
      score: 0,
    });
  }, []);

  return {
    state,
    map,
    placeTower,
    upgradeTower,
    sellTower,
    startWave,
    resetGame,
    pathPixels,
    speed,
    paused,
    setGameSpeed,
    togglePause,
  };
}
