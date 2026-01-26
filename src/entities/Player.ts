import { PLAYER_START, EXP_LEVELS } from '../constants';
import type { Item } from './Item';

export interface StatusEffects {
  confused: number;    // Turns remaining
  blind: number;       // Turns remaining
  paralyzed: number;   // Turns remaining
  seeInvisible: boolean;
}

export interface Player {
  x: number;
  y: number;
  char: string;
  color: string;
  name: string;
  hp: number;
  maxHp: number;
  strength: number;
  maxStrength: number;
  gold: number;
  armor: number;
  level: number;
  exp: number;
  hunger: number;
  inventory: Item[];
  weapon: Item | null;
  wornArmor: Item | null;
  rings: [Item | null, Item | null];
  hasAmulet: boolean;
  status: StatusEffects;
}

export function createPlayer(x: number, y: number): Player {
  return {
    x,
    y,
    char: '@',
    color: '#fff',
    name: 'Player',
    hp: PLAYER_START.hp,
    maxHp: PLAYER_START.maxHp,
    strength: PLAYER_START.strength,
    maxStrength: PLAYER_START.maxStrength,
    gold: PLAYER_START.gold,
    armor: PLAYER_START.armor,
    level: PLAYER_START.level,
    exp: PLAYER_START.exp,
    hunger: PLAYER_START.hunger,
    inventory: [],
    weapon: null,
    wornArmor: null,
    rings: [null, null],
    hasAmulet: false,
    status: {
      confused: 0,
      blind: 0,
      paralyzed: 0,
      seeInvisible: false,
    },
  };
}

export function addExp(player: Player, amount: number): boolean {
  player.exp += amount;
  const nextLevel = EXP_LEVELS[player.level];
  if (nextLevel && player.exp >= nextLevel) {
    player.level++;
    const hpGain = Math.floor(Math.random() * 8) + 2; // 2-9 HP
    player.maxHp += hpGain;
    player.hp = player.maxHp; // Full HP restore on level up!
    return true; // Level up!
  }
  return false;
}

export function getAttackBonus(player: Player): number {
  // Strength bonus
  let bonus = 0;
  if (player.strength >= 17) bonus = 1;
  if (player.strength >= 18) bonus = 2;
  if (player.strength >= 19) bonus = 3;
  if (player.strength >= 21) bonus = 4;

  // Weapon bonus would go here
  if (player.weapon && player.weapon.bonus) {
    bonus += player.weapon.bonus;
  }

  return bonus;
}

export function getDamageBonus(player: Player): number {
  let bonus = 0;
  if (player.strength >= 16) bonus = 1;
  if (player.strength >= 17) bonus = 2;
  if (player.strength >= 18) bonus = 3;
  if (player.strength >= 19) bonus = 4;
  if (player.strength >= 21) bonus = 5;
  return bonus;
}
