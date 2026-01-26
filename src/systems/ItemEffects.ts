import type { Player } from '../entities/Player';
import type { Item, PotionEffect, ScrollEffect, ItemAppearances } from '../entities/Item';
import { identifyItem } from '../entities/Item';
import { createMonster, getMonsterForLevel } from '../entities/Monster';
import type { Level } from '../map/Level';

export interface EffectResult {
  message: string;
  success: boolean;
  levelUp?: boolean;
  teleported?: boolean;
  mapped?: boolean;
}

// === POTION EFFECTS ===
export function applyPotionEffect(
  effect: PotionEffect,
  player: Player,
  item: Item,
  appearances: ItemAppearances
): EffectResult {
  // Identify the potion type
  identifyItem(item, appearances);

  switch (effect) {
    case 'healing': {
      const heal = Math.floor(player.maxHp * 0.33);
      player.hp = Math.min(player.maxHp, player.hp + heal);
      return { message: `You feel better. (+${heal} HP)`, success: true };
    }
    case 'extraHealing': {
      const heal = Math.floor(player.maxHp * 0.75);
      player.hp = Math.min(player.maxHp, player.hp + heal);
      if (player.hp < player.maxHp) {
        player.maxHp += 1;
        player.hp = player.maxHp;
      }
      return { message: `You feel much better! (+${heal} HP)`, success: true };
    }
    case 'poison': {
      const damage = Math.floor(player.maxHp * 0.25);
      player.hp -= damage;
      player.strength = Math.max(3, player.strength - 1);
      return { message: `You feel very sick! (-${damage} HP, -1 Str)`, success: true };
    }
    case 'strength': {
      player.strength += 1;
      player.maxStrength = Math.max(player.maxStrength, player.strength);
      return { message: 'You feel stronger! (+1 Str)', success: true };
    }
    case 'restoreStrength': {
      const restored = player.maxStrength - player.strength;
      player.strength = player.maxStrength;
      return { message: restored > 0 ? `You feel your strength return! (+${restored} Str)` : 'You feel warm for a moment.', success: true };
    }
    case 'confusion': {
      // TODO: Add confusion status effect
      return { message: 'You feel confused...', success: true };
    }
    case 'blindness': {
      // TODO: Add blindness status effect
      return { message: 'Your vision goes dark!', success: true };
    }
    case 'seeInvisible': {
      // TODO: Add see invisible status effect
      return { message: 'Your eyes tingle for a moment.', success: true };
    }
    case 'levelUp': {
      const hpGain = Math.floor(Math.random() * 8) + 2;
      player.level += 1;
      player.maxHp += hpGain;
      player.hp = player.maxHp;
      return { message: `You feel more experienced! Welcome to level ${player.level}!`, success: true, levelUp: true };
    }
    case 'paralysis': {
      // TODO: Add paralysis status effect
      return { message: 'You can\'t move!', success: true };
    }
    default:
      return { message: 'Nothing happens.', success: false };
  }
}

// === SCROLL EFFECTS ===
export function applyScrollEffect(
  effect: ScrollEffect,
  player: Player,
  item: Item,
  appearances: ItemAppearances,
  level: Level
): EffectResult {
  // Identify the scroll type
  identifyItem(item, appearances);

  switch (effect) {
    case 'identify': {
      // For now, just identify a random unidentified item
      const unidentified = player.inventory.filter(i => !i.identified && (i.type === 'potion' || i.type === 'scroll' || i.type === 'ring' || i.type === 'wand'));
      if (unidentified.length > 0) {
        const toIdentify = unidentified[Math.floor(Math.random() * unidentified.length)];
        identifyItem(toIdentify, appearances);
        return { message: `Your ${toIdentify.name} glows briefly.`, success: true };
      }
      return { message: 'You feel a strange sense of clarity.', success: true };
    }
    case 'teleport': {
      // Find a random floor tile
      const floors: { x: number; y: number }[] = [];
      for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
          const tile = level.getTile(x, y);
          if (tile && tile.type === 'floor' && !level.getMonsterAt(x, y)) {
            floors.push({ x, y });
          }
        }
      }
      if (floors.length > 0) {
        const dest = floors[Math.floor(Math.random() * floors.length)];
        player.x = dest.x;
        player.y = dest.y;
        return { message: 'You are teleported!', success: true, teleported: true };
      }
      return { message: 'You feel disoriented for a moment.', success: false };
    }
    case 'removeCurse': {
      let removed = 0;
      if (player.weapon?.cursed) {
        player.weapon.cursed = false;
        removed++;
      }
      if (player.wornArmor?.cursed) {
        player.wornArmor.cursed = false;
        removed++;
      }
      for (const ring of player.rings || []) {
        if (ring?.cursed) {
          ring.cursed = false;
          removed++;
        }
      }
      return { message: removed > 0 ? 'You feel as if someone is watching over you.' : 'You feel a momentary sense of peace.', success: true };
    }
    case 'enchantWeapon': {
      if (player.weapon) {
        player.weapon.bonus = (player.weapon.bonus || 0) + 1;
        player.weapon.name = `+${player.weapon.bonus} ${player.weapon.name.replace(/^\+?\d*\s*/, '')}`;
        return { message: `Your ${player.weapon.name} glows blue for a moment.`, success: true };
      }
      return { message: 'You feel a strange sense of loss.', success: false };
    }
    case 'enchantArmor': {
      if (player.wornArmor) {
        player.wornArmor.bonus = (player.wornArmor.bonus || 0) + 1;
        player.armor += 1;
        player.wornArmor.name = `+${player.wornArmor.bonus} ${player.wornArmor.name.replace(/^\+?\d*\s*/, '')}`;
        return { message: `Your ${player.wornArmor.name} glows silver for a moment.`, success: true };
      }
      return { message: 'You feel a strange sense of loss.', success: false };
    }
    case 'sleep': {
      // TODO: Put nearby monsters to sleep
      return { message: 'You hear a faint snoring sound nearby.', success: true };
    }
    case 'scare': {
      // TODO: Scare nearby monsters
      return { message: 'You hear a terrifying scream!', success: true };
    }
    case 'magicMapping': {
      // Reveal entire level
      for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
          level.explore(x, y);
        }
      }
      return { message: 'This level is suddenly familiar to you.', success: true, mapped: true };
    }
    case 'aggravate': {
      // Wake up all monsters
      for (const monster of level.monsters) {
        monster.sleeping = false;
      }
      return { message: 'You hear a high-pitched humming noise.', success: true };
    }
    case 'createMonster': {
      // Create a monster nearby
      const dirs = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
      for (const [dx, dy] of dirs) {
        const nx = player.x + dx;
        const ny = player.y + dy;
        if (level.isPassable(nx, ny) && !level.getMonsterAt(nx, ny)) {
          const def = getMonsterForLevel(Math.max(1, Math.floor(Math.random() * 10) + 1));
          if (def) {
            const monster = createMonster(def, nx, ny);
            level.addMonster(monster);
            return { message: `A ${monster.name} appears!`, success: true };
          }
        }
      }
      return { message: 'You feel a presence near you.', success: false };
    }
    default:
      return { message: 'Nothing happens.', success: false };
  }
}

// Re-export from Monster.ts for convenience
export { identifyItem } from '../entities/Item';
export { createMonster, getMonsterForLevel } from '../entities/Monster';
