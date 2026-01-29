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

// Alien entity definitions - Bright saturated colors
// HP increased by 20% from original values
export const MONSTER_DEFS: Record<string, MonsterDef> = {
  // Dimensions 1-2: Entry-level entities
  B: { char: 'B', name: 'blink moth', color: '#ff44aa', hp: [1, 10], damage: '1d2', armor: 3, exp: 1, minLevel: 1, flags: ['erratic'] },
  E: { char: 'E', name: 'echo stalker', color: '#44ff44', hp: [1, 10], damage: '1d2', armor: 7, exp: 2, minLevel: 1, flags: [] },
  H: { char: 'H', name: 'hiveling', color: '#ff8800', hp: [1, 10], damage: '1d8', armor: 5, exp: 3, minLevel: 1, flags: ['mean'] },
  I: { char: 'I', name: 'ion specter', color: '#00ffff', hp: [1, 10], damage: '0d0', armor: 9, exp: 5, minLevel: 1, flags: ['freeze'] },
  K: { char: 'K', name: 'kinetic sprite', color: '#ffff00', hp: [1, 10], damage: '1d4', armor: 7, exp: 1, minLevel: 1, flags: ['erratic'] },
  S: { char: 'S', name: 'spine crawler', color: '#00ff00', hp: [1, 10], damage: '1d3', armor: 5, exp: 2, minLevel: 1, flags: ['mean'] },

  // Dimensions 3-4: Mid-tier entities
  O: { char: 'O', name: 'obsidian hulk', color: '#00ff88', hp: [1, 10], damage: '1d8', armor: 6, exp: 5, minLevel: 3, flags: ['greedy'] },
  R: { char: 'R', name: 'rift leech', color: '#88ff00', hp: [2, 10], damage: '1d6', armor: 3, exp: 9, minLevel: 3, flags: ['mean', 'drainStr'] },
  Z: { char: 'Z', name: 'zero-point husk', color: '#aa88ff', hp: [2, 10], damage: '1d8', armor: 8, exp: 6, minLevel: 4, flags: ['mean'] },

  // Dimensions 5-6: Dangerous entities
  A: { char: 'A', name: 'acid jelly', color: '#4488ff', hp: [2, 10], damage: '0d0', armor: 2, exp: 15, minLevel: 5, flags: ['mean', 'rustArmor'] },
  T: { char: 'T', name: 'titan polyp', color: '#00aa44', hp: [3, 10], damage: '2d6', armor: 4, exp: 25, minLevel: 5, flags: ['mean', 'regenerate'] },
  P: { char: 'P', name: 'phase walker', color: '#aa88cc', hp: [2, 10], damage: '1d8', armor: 3, exp: 20, minLevel: 6, flags: ['mean', 'invisible'] },
  N: { char: 'N', name: 'nanite swarm', color: '#ff88ff', hp: [2, 10], damage: '0d0', armor: 9, exp: 18, minLevel: 7, flags: ['stealItem'] },

  // Dimensions 8-10: Apex predators
  V: { char: 'V', name: 'void drinker', color: '#ff0044', hp: [3, 10], damage: '1d10', armor: 1, exp: 40, minLevel: 8, flags: ['mean', 'drainHP'] },
  W: { char: 'W', name: 'warp specter', color: '#888888', hp: [2, 10], damage: '1d6', armor: 4, exp: 35, minLevel: 9, flags: ['mean', 'drainXP', 'invisible'] },
};

export function createMonster(def: MonsterDef, x: number, y: number, levelNum: number = 1): Monster {
  const [dice, sides] = def.hp;
  let hp = 0;
  for (let i = 0; i < dice; i++) {
    hp += Math.floor(Math.random() * sides) + 1;
  }

  // Dimension scaling: entities get +1 HP per 2 dimensions beyond their minLevel
  const depthBonus = Math.floor((levelNum - def.minLevel) / 2);
  hp += depthBonus;

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
    flags: [...def.flags], // Copy flags so we can modify per-instance
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
