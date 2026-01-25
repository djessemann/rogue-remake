import type { Player } from '../entities/Player';
import type { Monster } from '../entities/Monster';
import { rollDamage } from '../entities/Monster';
import { getAttackBonus, getDamageBonus } from '../entities/Player';

export interface CombatResult {
  hit: boolean;
  damage: number;
  killed: boolean;
  message: string;
}

export function playerAttack(player: Player, monster: Monster): CombatResult {
  // Hit calculation: d20 + player level + attack bonus vs monster armor
  const roll = Math.floor(Math.random() * 20) + 1;
  const attackBonus = getAttackBonus(player);

  // Need to roll >= monster armor on d20 + level + bonus to hit
  const needed = monster.armor;
  const hit = roll + player.level + attackBonus >= needed;

  if (!hit) {
    return {
      hit: false,
      damage: 0,
      killed: false,
      message: `You miss the ${monster.name}.`,
    };
  }

  // Damage: weapon damage + strength bonus (default 1d4 for unarmed)
  let damage = Math.floor(Math.random() * 4) + 1; // 1d4 base
  damage += getDamageBonus(player);

  // Apply weapon bonus if any
  if (player.weapon && player.weapon.bonus) {
    damage += player.weapon.bonus;
  }

  damage = Math.max(1, damage);
  monster.hp -= damage;

  if (monster.hp <= 0) {
    return {
      hit: true,
      damage,
      killed: true,
      message: `You hit the ${monster.name} for ${damage} damage. The ${monster.name} is killed!`,
    };
  }

  return {
    hit: true,
    damage,
    killed: false,
    message: `You hit the ${monster.name} for ${damage} damage.`,
  };
}

export function monsterAttack(monster: Monster, player: Player): CombatResult {
  // Similar calculation for monster attacking player
  const roll = Math.floor(Math.random() * 20) + 1;
  const monsterLevel = Math.ceil(monster.exp / 3); // Approximate level from exp
  const needed = player.armor;

  const hit = roll + monsterLevel >= needed;

  if (!hit) {
    return {
      hit: false,
      damage: 0,
      killed: false,
      message: `The ${monster.name} misses you.`,
    };
  }

  const damage = Math.max(1, rollDamage(monster.damage));
  player.hp -= damage;

  if (player.hp <= 0) {
    return {
      hit: true,
      damage,
      killed: true,
      message: `The ${monster.name} hits you for ${damage} damage. You die...`,
    };
  }

  return {
    hit: true,
    damage,
    killed: false,
    message: `The ${monster.name} hits you for ${damage} damage.`,
  };
}
