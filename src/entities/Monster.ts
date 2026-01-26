import * as ROT from 'rot-js';
import type { Level } from '../map/Level';
import type { Player } from './Player';

export interface MonsterDef {
  char: string;
  name: string;
  color: string;
  hp: [number, number]; // [dice, sides] e.g., [1, 8] = 1d8
  damage: string; // e.g., "1d4" or "1d6/1d6"
  armor: number;
  exp: number;
  minLevel: number;
  flags: string[];
}

export interface Monster {
  x: number;
  y: number;
  char: string;
  color: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: string;
  armor: number;
  exp: number;
  flags: string[];
  sleeping: boolean;
}

// Monster definitions (subset for Phase 1) - Bright saturated colors
export const MONSTER_DEFS: Record<string, MonsterDef> = {
  B: { char: 'B', name: 'bat', color: '#ff44aa', hp: [1, 8], damage: '1d2', armor: 3, exp: 1, minLevel: 1, flags: ['erratic'] },
  E: { char: 'E', name: 'emu', color: '#44ff44', hp: [1, 8], damage: '1d2', armor: 7, exp: 2, minLevel: 1, flags: [] },
  H: { char: 'H', name: 'hobgoblin', color: '#ff8800', hp: [1, 8], damage: '1d8', armor: 5, exp: 3, minLevel: 1, flags: ['mean'] },
  I: { char: 'I', name: 'ice monster', color: '#00ffff', hp: [1, 8], damage: '0d0', armor: 9, exp: 5, minLevel: 1, flags: ['freeze'] },
  K: { char: 'K', name: 'kestrel', color: '#ffff00', hp: [1, 8], damage: '1d4', armor: 7, exp: 1, minLevel: 1, flags: ['erratic'] },
  O: { char: 'O', name: 'orc', color: '#00ff88', hp: [1, 8], damage: '1d8', armor: 6, exp: 5, minLevel: 4, flags: ['greedy'] },
  R: { char: 'R', name: 'rattlesnake', color: '#88ff00', hp: [2, 8], damage: '1d6', armor: 3, exp: 9, minLevel: 4, flags: ['mean'] },
  S: { char: 'S', name: 'snake', color: '#00ff00', hp: [1, 8], damage: '1d3', armor: 5, exp: 2, minLevel: 1, flags: ['mean'] },
  Z: { char: 'Z', name: 'zombie', color: '#aa88ff', hp: [2, 8], damage: '1d8', armor: 8, exp: 6, minLevel: 5, flags: ['mean'] },
};

export function createMonster(def: MonsterDef, x: number, y: number): Monster {
  const [dice, sides] = def.hp;
  let hp = 0;
  for (let i = 0; i < dice; i++) {
    hp += Math.floor(Math.random() * sides) + 1;
  }

  return {
    x,
    y,
    char: def.char,
    color: def.color,
    name: def.name,
    hp,
    maxHp: hp,
    damage: def.damage,
    armor: def.armor,
    exp: def.exp,
    flags: def.flags,
    sleeping: !def.flags.includes('mean'), // Mean monsters wake up immediately
  };
}

export function rollDamage(damageStr: string): number {
  // Parse "1d8" or "1d6/1d6" format
  const attacks = damageStr.split('/');
  let total = 0;
  for (const attack of attacks) {
    const [dice, sides] = attack.split('d').map(Number);
    for (let i = 0; i < dice; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
  }
  return total;
}

export function getMonsterForLevel(levelNum: number): MonsterDef | null {
  const eligible = Object.values(MONSTER_DEFS).filter(m => m.minLevel <= levelNum);
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export function monsterAct(monster: Monster, player: Player, level: Level): { dx: number; dy: number } | null {
  if (monster.sleeping) {
    // Check if player is nearby to wake up
    const dist = Math.abs(monster.x - player.x) + Math.abs(monster.y - player.y);
    if (dist <= 2) {
      monster.sleeping = false;
    }
    return null;
  }

  // Erratic movement (bat, kestrel)
  if (monster.flags.includes('erratic') && Math.random() < 0.5) {
    const dirs = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
    const nx = monster.x + dx;
    const ny = monster.y + dy;
    if (level.isPassable(nx, ny) && !(nx === player.x && ny === player.y)) {
      return { dx, dy };
    }
  }

  // Chase player using A* pathfinding
  const path: [number, number][] = [];
  const astar = new ROT.Path.AStar(player.x, player.y, (x, y) => {
    if (x === monster.x && y === monster.y) return true;
    if (x === player.x && y === player.y) return true;
    return level.isPassable(x, y);
  }, { topology: 8 });

  astar.compute(monster.x, monster.y, (x, y) => {
    path.push([x, y]);
  });

  // Get next step (index 1, since index 0 is current position)
  if (path.length > 1) {
    const [nextX, nextY] = path[1];
    return { dx: nextX - monster.x, dy: nextY - monster.y };
  }

  return null;
}
