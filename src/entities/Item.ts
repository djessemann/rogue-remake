import { currentTheme, getThemedWeaponName, getThemedArmorName } from '../theme';

export type ItemType = 'gold' | 'food' | 'weapon' | 'armor' | 'potion' | 'scroll' | 'ring' | 'wand' | 'amulet';

export type PotionEffect = 'healing' | 'extraHealing' | 'poison' | 'strength' | 'restoreStrength' |
  'confusion' | 'blindness' | 'seeInvisible' | 'levelUp' | 'paralysis';

export type ScrollEffect = 'identify' | 'teleport' | 'removeCurse' | 'enchantWeapon' | 'enchantArmor' |
  'sleep' | 'scare' | 'magicMapping' | 'aggravate' | 'createMonster';

export type RingEffect = 'protection' | 'strength' | 'sustenance' | 'regeneration' | 'slowDigestion' |
  'searching' | 'seeInvisible' | 'stealth' | 'teleportation' | 'dexterity';

export type WandEffect = 'light' | 'lightning' | 'fire' | 'cold' | 'polymorph' |
  'magicMissile' | 'slow' | 'teleportAway' | 'cancellation' | 'drain';

export interface Item {
  type: ItemType;
  name: string;
  char: string;
  color: string;
  x: number;
  y: number;
  value: number;
  bonus?: number;
  identified?: boolean;
  cursed?: boolean;
  charges?: number;
  effect?: PotionEffect | ScrollEffect | RingEffect | WandEffect;
  equipped?: boolean;
}

// Random appearances for unidentified items (initialized per game)
export interface ItemAppearances {
  potionColors: Map<PotionEffect, string>;
  scrollTitles: Map<ScrollEffect, string>;
  ringGems: Map<RingEffect, string>;
  wandMaterials: Map<WandEffect, string>;
  identified: {
    potions: Set<PotionEffect>;
    scrolls: Set<ScrollEffect>;
    rings: Set<RingEffect>;
    wands: Set<WandEffect>;
  };
}

// Use theme-aware descriptors
const getPotionDescriptors = () => currentTheme.potionDescriptors;
const getScrollDescriptors = () => currentTheme.scrollDescriptors;
const getRingDescriptors = () => currentTheme.ringDescriptors;
const getWandDescriptors = () => currentTheme.wandDescriptors;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function initializeItemAppearances(): ItemAppearances {
  const potionEffects: PotionEffect[] = ['healing', 'extraHealing', 'poison', 'strength', 'restoreStrength',
    'confusion', 'blindness', 'seeInvisible', 'levelUp', 'paralysis'];
  const scrollEffects: ScrollEffect[] = ['identify', 'teleport', 'removeCurse', 'enchantWeapon', 'enchantArmor',
    'sleep', 'scare', 'magicMapping', 'aggravate', 'createMonster'];
  const ringEffects: RingEffect[] = ['protection', 'strength', 'sustenance', 'regeneration', 'slowDigestion',
    'searching', 'seeInvisible', 'stealth', 'teleportation', 'dexterity'];
  const wandEffects: WandEffect[] = ['light', 'lightning', 'fire', 'cold', 'polymorph',
    'magicMissile', 'slow', 'teleportAway', 'cancellation', 'drain'];

  const shuffledDescriptors = shuffleArray(getPotionDescriptors());
  const shuffledRingDesc = shuffleArray(getRingDescriptors());
  const shuffledWandDesc = shuffleArray(getWandDescriptors());
  const scrollDescriptors = getScrollDescriptors();

  const potionColors = new Map<PotionEffect, string>();
  potionEffects.forEach((effect, i) => potionColors.set(effect, shuffledDescriptors[i % shuffledDescriptors.length]));

  const scrollTitles = new Map<ScrollEffect, string>();
  scrollEffects.forEach((effect) => {
    const numParts = 2 + Math.floor(Math.random() * 2);
    const parts = [];
    for (let i = 0; i < numParts; i++) {
      parts.push(scrollDescriptors[Math.floor(Math.random() * scrollDescriptors.length)]);
    }
    scrollTitles.set(effect, parts.join(' '));
  });

  const ringGems = new Map<RingEffect, string>();
  ringEffects.forEach((effect, i) => ringGems.set(effect, shuffledRingDesc[i % shuffledRingDesc.length]));

  const wandMaterials = new Map<WandEffect, string>();
  wandEffects.forEach((effect, i) => wandMaterials.set(effect, shuffledWandDesc[i % shuffledWandDesc.length]));

  return {
    potionColors,
    scrollTitles,
    ringGems,
    wandMaterials,
    identified: {
      potions: new Set(),
      scrolls: new Set(),
      rings: new Set(),
      wands: new Set(),
    },
  };
}

// Item effect colors - Bright saturated palette (includes both classic and rift descriptors)
const POTION_DISPLAY_COLORS: Record<string, string> = {
  // Classic colors
  red: '#ff3333', blue: '#3366ff', green: '#33ff33', yellow: '#ffff33', orange: '#ff8833',
  purple: '#aa33ff', white: '#ffffff', black: '#666666', brown: '#cc6633', pink: '#ff66aa',
  grey: '#999999', clear: '#66ffff', murky: '#886644', golden: '#ffcc00', silver: '#ccccff',
  // Rift compound colors
  crimson: '#dc143c', cobalt: '#0047ab', viridian: '#40826d', amber: '#ffbf00', plasma: '#ff00ff',
  violet: '#8f00ff', milky: '#fdfff5', void: '#1a1a2e', rust: '#b7410e', neon: '#39ff14',
  chrome: '#dbe4eb', turbid: '#5a4d41', flux: '#00ffcc', ion: '#7df9ff'
};

// === GOLD ===
export function createGold(x: number, y: number, levelNum: number): Item {
  const value = Math.floor(Math.random() * (50 + 10 * levelNum)) + 2;
  return {
    type: 'gold',
    name: `${value} ${currentTheme.goldName}`,
    char: '*',
    color: '#ffdd00',
    x,
    y,
    value,
  };
}

// === FOOD ===
export function createFood(x: number, y: number): Item {
  return {
    type: 'food',
    name: currentTheme.foodName,
    char: ':',
    color: '#cc6633',
    x,
    y,
    value: 1,
  };
}

// === WEAPONS ===
export function createWeapon(x: number, y: number, name: string, bonus: number = 0): Item {
  const themedName = getThemedWeaponName(name);
  return {
    type: 'weapon',
    name: bonus !== 0 ? `${bonus > 0 ? '+' : ''}${bonus} ${themedName}` : themedName,
    char: ')',
    color: '#33aaff',
    x,
    y,
    value: 0,
    bonus,
  };
}

// === ARMOR ===
export function createArmor(x: number, y: number, name: string, bonus: number = 0): Item {
  const themedName = getThemedArmorName(name);
  return {
    type: 'armor',
    name: bonus !== 0 ? `${bonus > 0 ? '+' : ''}${bonus} ${themedName}` : themedName,
    char: '[',
    color: '#33aaff',
    x,
    y,
    value: bonus,
    bonus,
  };
}

// === POTIONS ===
export function createPotion(x: number, y: number, effect: PotionEffect, appearances: ItemAppearances): Item {
  const descriptor = appearances.potionColors.get(effect) || 'clear';
  const identified = appearances.identified.potions.has(effect);
  const itemName = currentTheme.potionName;

  return {
    type: 'potion',
    name: identified ? `${itemName} of ${formatEffectName(effect)}` : `${descriptor} ${itemName}`,
    char: '!',
    color: POTION_DISPLAY_COLORS[descriptor] || '#f0f',
    x,
    y,
    value: 0,
    effect,
    identified,
  };
}

export function getRandomPotionEffect(): PotionEffect {
  const effects: PotionEffect[] = ['healing', 'extraHealing', 'poison', 'strength', 'restoreStrength',
    'confusion', 'blindness', 'seeInvisible', 'levelUp', 'paralysis'];
  // Weight towards healing potions
  const weights = [20, 5, 8, 8, 10, 7, 5, 3, 2, 5];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < effects.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return effects[i];
  }
  return 'healing';
}

// === SCROLLS ===
export function createScroll(x: number, y: number, effect: ScrollEffect, appearances: ItemAppearances): Item {
  const title = appearances.scrollTitles.get(effect) || 'UNKNOWN';
  const identified = appearances.identified.scrolls.has(effect);
  const itemName = currentTheme.scrollName;

  return {
    type: 'scroll',
    name: identified ? `${itemName} of ${formatEffectName(effect)}` : `${itemName} labeled "${title}"`,
    char: '?',
    color: '#ffffff',
    x,
    y,
    value: 0,
    effect,
    identified,
  };
}

export function getRandomScrollEffect(): ScrollEffect {
  const effects: ScrollEffect[] = ['identify', 'teleport', 'removeCurse', 'enchantWeapon', 'enchantArmor',
    'sleep', 'scare', 'magicMapping', 'aggravate', 'createMonster'];
  const weights = [20, 10, 8, 5, 5, 5, 5, 8, 3, 3];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < effects.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return effects[i];
  }
  return 'identify';
}

// === RINGS ===
export function createRing(x: number, y: number, effect: RingEffect, appearances: ItemAppearances, bonus: number = 0): Item {
  const descriptor = appearances.ringGems.get(effect) || 'plain';
  const identified = appearances.identified.rings.has(effect);
  const cursed = Math.random() < 0.15;
  const actualBonus = cursed ? -Math.abs(bonus || 1) : bonus;
  const itemName = currentTheme.ringName;

  let name: string;
  if (identified) {
    name = `${itemName} of ${formatEffectName(effect)}`;
    if (actualBonus !== 0) name = `${actualBonus > 0 ? '+' : ''}${actualBonus} ${name}`;
  } else {
    name = `${descriptor} ${itemName}`;
  }

  return {
    type: 'ring',
    name,
    char: '=',
    color: '#ff8800',
    x,
    y,
    value: 0,
    effect,
    bonus: actualBonus,
    identified,
    cursed,
  };
}

export function getRandomRingEffect(): RingEffect {
  const effects: RingEffect[] = ['protection', 'strength', 'sustenance', 'regeneration', 'slowDigestion',
    'searching', 'seeInvisible', 'stealth', 'teleportation', 'dexterity'];
  return effects[Math.floor(Math.random() * effects.length)];
}

// === WANDS ===
export function createWand(x: number, y: number, effect: WandEffect, appearances: ItemAppearances): Item {
  const descriptor = appearances.wandMaterials.get(effect) || 'standard';
  const identified = appearances.identified.wands.has(effect);
  const charges = 3 + Math.floor(Math.random() * 8); // 3-10 charges
  const itemName = currentTheme.wandName;

  return {
    type: 'wand',
    name: identified ? `${itemName} of ${formatEffectName(effect)}` : `${descriptor} ${itemName}`,
    char: '/',
    color: '#88ff00',
    x,
    y,
    value: 0,
    effect,
    charges,
    identified,
  };
}

export function getRandomWandEffect(): WandEffect {
  const effects: WandEffect[] = ['light', 'lightning', 'fire', 'cold', 'polymorph',
    'magicMissile', 'slow', 'teleportAway', 'cancellation', 'drain'];
  return effects[Math.floor(Math.random() * effects.length)];
}

// === GOAL ITEM ===
export function createAmulet(x: number, y: number): Item {
  return {
    type: 'amulet',
    name: currentTheme.goalItem,
    char: currentTheme.goalItemChar,
    color: '#ffcc00',
    x,
    y,
    value: 0,
    identified: true,
  };
}

// === HELPERS ===
function formatEffectName(effect: string): string {
  // Convert camelCase to readable: "extraHealing" -> "extra healing"
  return effect.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
}

export function getItemDisplayName(item: Item, appearances?: ItemAppearances): string {
  if (item.identified || !appearances) {
    return item.name;
  }

  // Return unidentified name based on type
  if (item.type === 'potion' && item.effect) {
    const descriptor = appearances.potionColors.get(item.effect as PotionEffect);
    return `${descriptor} ${currentTheme.potionName}`;
  }
  if (item.type === 'scroll' && item.effect) {
    const title = appearances.scrollTitles.get(item.effect as ScrollEffect);
    return `${currentTheme.scrollName} labeled "${title}"`;
  }
  if (item.type === 'ring' && item.effect) {
    const descriptor = appearances.ringGems.get(item.effect as RingEffect);
    return `${descriptor} ${currentTheme.ringName}`;
  }
  if (item.type === 'wand' && item.effect) {
    const descriptor = appearances.wandMaterials.get(item.effect as WandEffect);
    return `${descriptor} ${currentTheme.wandName}`;
  }

  return item.name;
}

export function identifyItem(item: Item, appearances: ItemAppearances): void {
  item.identified = true;

  if (item.type === 'potion' && item.effect) {
    appearances.identified.potions.add(item.effect as PotionEffect);
    item.name = `${currentTheme.potionName} of ${formatEffectName(item.effect)}`;
  }
  if (item.type === 'scroll' && item.effect) {
    appearances.identified.scrolls.add(item.effect as ScrollEffect);
    item.name = `${currentTheme.scrollName} of ${formatEffectName(item.effect)}`;
  }
  if (item.type === 'ring' && item.effect) {
    appearances.identified.rings.add(item.effect as RingEffect);
    let name = `${currentTheme.ringName} of ${formatEffectName(item.effect)}`;
    if (item.bonus) name = `${item.bonus > 0 ? '+' : ''}${item.bonus} ${name}`;
    item.name = name;
  }
  if (item.type === 'wand' && item.effect) {
    appearances.identified.wands.add(item.effect as WandEffect);
    item.name = `${currentTheme.wandName} of ${formatEffectName(item.effect)}`;
  }
}

export function getItemChar(item: Item): string {
  return item.char;
}

export function getItemColor(item: Item): string {
  return item.color;
}
