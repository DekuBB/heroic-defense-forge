import { useState, useRef, useCallback, useEffect } from 'react';
import { GameState, PlacedTower, ActiveEnemy, Projectile, CELL_SIZE } from './types';
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
    spawnQueue: [],
    spawnTimer: 0,
    score: 0,
  });

  const stateRef = useRef(state);
  stateRef.current = state;
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const runningRef = useRef(false);
  const gameLoopRef = useRef<(time: number) => void>(() => {});

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

  const gameLoop = useCallback((time: number) => {
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = time;

    setState(prev => {
      const s = { ...prev };
      s.enemies = [...s.enemies];
      s.projectiles = [...s.projectiles];
      s.towers = [...s.towers];
      s.spawnQueue = [...s.spawnQueue];

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

      // Move enemies
      const reachedEnd: string[] = [];
      for (const enemy of s.enemies) {
        // Apply slow
        let speed = enemy.speed;
        if (enemy.slowTimer > 0) {
          speed *= 0.4;
          enemy.slowTimer -= dt;
        }
        // Apply DOT
        if (enemy.dotTimer > 0) {
          enemy.hp -= enemy.dotDamage * dt;
          enemy.dotTimer -= dt;
        }

        enemy.pathIndex += speed * dt;
        const pos = pathPixels(enemy.pathIndex);
        enemy.x = pos.x;
        enemy.y = pos.y;

        if (enemy.pathIndex >= map.path.length - 1) {
          reachedEnd.push(enemy.id);
        }
      }

      // Remove enemies that reached end
      if (reachedEnd.length > 0) {
        s.lives -= reachedEnd.length;
        s.enemies = s.enemies.filter(e => !reachedEnd.includes(e.id));
      }

      // Tower firing
      const now = s.spawnTimer; // use spawnTimer as continuous time
      for (const tower of s.towers) {
        const stats = getTowerStats(tower);
        const interval = 1 / stats.fireRate;
        if (now - tower.lastFired < interval) continue;

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
          tower.lastFired = now;
          tower.target = closest.id;
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
        }
      }

      // Move projectiles
      const hitProjectiles: string[] = [];
      for (const proj of s.projectiles) {
        proj.progress += dt * 5; // speed of projectile
        if (proj.progress >= 1) {
          hitProjectiles.push(proj.id);
          // Apply damage
          if (proj.splashRadius > 0) {
            const splashPx = proj.splashRadius * CELL_SIZE;
            for (const enemy of s.enemies) {
              const dx = enemy.x - proj.toX;
              const dy = enemy.y - proj.toY;
              if (Math.sqrt(dx * dx + dy * dy) <= splashPx) {
                enemy.hp -= proj.damage;
                if (proj.slowFactor < 1) enemy.slowTimer = 2;
                if (proj.dotDamage > 0) { enemy.dotDamage = proj.dotDamage; enemy.dotTimer = 3; }
              }
            }
          } else {
            const target = s.enemies.find(e => e.id === proj.targetId);
            if (target) {
              target.hp -= proj.damage;
              if (proj.slowFactor < 1) target.slowTimer = 2;
              if (proj.dotDamage > 0) { target.dotDamage = proj.dotDamage; target.dotTimer = 3; }
            }
          }
        }
      }
      s.projectiles = s.projectiles.filter(p => !hitProjectiles.includes(p.id));

      // Remove dead enemies
      const killed = s.enemies.filter(e => e.hp <= 0);
      for (const dead of killed) {
        const def = ENEMIES.find(e => e.id === dead.defId);
        if (def) {
          s.gold += def.reward;
          s.score += def.reward;
        }
      }
      s.enemies = s.enemies.filter(e => e.hp > 0);

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
  };
}
