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

const POTION_COLORS = [
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'white', 'black',
  'brown', 'pink', 'grey', 'clear', 'murky', 'golden', 'silver'
];

const SCROLL_SYLLABLES = [
  'ABJ', 'ACH', 'AIE', 'BLE', 'CHO', 'DIS', 'ENC', 'FID', 'GAN', 'HAR',
  'ION', 'JIK', 'KHO', 'LEM', 'MAN', 'NOR', 'OPS', 'PLA', 'QUE', 'RHO',
  'SIE', 'TIX', 'ULU', 'VAS', 'WEX', 'YOD', 'ZAP'
];

const RING_GEMS = [
  'ruby', 'diamond', 'emerald', 'sapphire', 'opal', 'pearl', 'onyx',
  'jade', 'amethyst', 'topaz', 'garnet', 'turquoise'
];

const WAND_MATERIALS = [
  'oak', 'iron', 'glass', 'silver', 'bone', 'bronze', 'copper',
  'crystal', 'ebony', 'maple', 'brass', 'steel'
];

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

  const shuffledColors = shuffleArray(POTION_COLORS);
  const shuffledGems = shuffleArray(RING_GEMS);
  const shuffledMaterials = shuffleArray(WAND_MATERIALS);

  const potionColors = new Map<PotionEffect, string>();
  potionEffects.forEach((effect, i) => potionColors.set(effect, shuffledColors[i % shuffledColors.length]));

  const scrollTitles = new Map<ScrollEffect, string>();
  scrollEffects.forEach((effect) => {
    const numSyllables = 2 + Math.floor(Math.random() * 2);
    const syllables = [];
    for (let i = 0; i < numSyllables; i++) {
      syllables.push(SCROLL_SYLLABLES[Math.floor(Math.random() * SCROLL_SYLLABLES.length)]);
    }
    scrollTitles.set(effect, syllables.join(' '));
  });

  const ringGems = new Map<RingEffect, string>();
  ringEffects.forEach((effect, i) => ringGems.set(effect, shuffledGems[i % shuffledGems.length]));

  const wandMaterials = new Map<WandEffect, string>();
  wandEffects.forEach((effect, i) => wandMaterials.set(effect, shuffledMaterials[i % shuffledMaterials.length]));

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

// Item effect colors
const POTION_DISPLAY_COLORS: Record<string, string> = {
  red: '#f44', blue: '#44f', green: '#4f4', yellow: '#ff4', orange: '#fa4',
  purple: '#a4f', white: '#fff', black: '#444', brown: '#a64', pink: '#f8a',
  grey: '#888', clear: '#aff', murky: '#654', golden: '#fd4', silver: '#ccc'
};

// === GOLD ===
export function createGold(x: number, y: number, levelNum: number): Item {
  const value = Math.floor(Math.random() * (50 + 10 * levelNum)) + 2;
  return {
    type: 'gold',
    name: `${value} gold pieces`,
    char: '*',
    color: '#ff0',
    x,
    y,
    value,
  };
}

// === FOOD ===
export function createFood(x: number, y: number): Item {
  return {
    type: 'food',
    name: 'some food',
    char: ':',
    color: '#a52',
    x,
    y,
    value: 1,
  };
}

// === WEAPONS ===
export function createWeapon(x: number, y: number, name: string, bonus: number = 0): Item {
  return {
    type: 'weapon',
    name: bonus !== 0 ? `${bonus > 0 ? '+' : ''}${bonus} ${name}` : name,
    char: ')',
    color: '#0af',
    x,
    y,
    value: 0,
    bonus,
  };
}

// === ARMOR ===
export function createArmor(x: number, y: number, name: string, bonus: number = 0): Item {
  return {
    type: 'armor',
    name: bonus !== 0 ? `${bonus > 0 ? '+' : ''}${bonus} ${name}` : name,
    char: '[',
    color: '#0af',
    x,
    y,
    value: bonus,
    bonus,
  };
}

// === POTIONS ===
export function createPotion(x: number, y: number, effect: PotionEffect, appearances: ItemAppearances): Item {
  const color = appearances.potionColors.get(effect) || 'clear';
  const identified = appearances.identified.potions.has(effect);

  return {
    type: 'potion',
    name: identified ? `potion of ${formatEffectName(effect)}` : `${color} potion`,
    char: '!',
    color: POTION_DISPLAY_COLORS[color] || '#f0f',
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

  return {
    type: 'scroll',
    name: identified ? `scroll of ${formatEffectName(effect)}` : `scroll titled "${title}"`,
    char: '?',
    color: '#fff',
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
  const gem = appearances.ringGems.get(effect) || 'plain';
  const identified = appearances.identified.rings.has(effect);
  const cursed = Math.random() < 0.15;
  const actualBonus = cursed ? -Math.abs(bonus || 1) : bonus;

  let name: string;
  if (identified) {
    name = `ring of ${formatEffectName(effect)}`;
    if (actualBonus !== 0) name = `${actualBonus > 0 ? '+' : ''}${actualBonus} ${name}`;
  } else {
    name = `${gem} ring`;
  }

  return {
    type: 'ring',
    name,
    char: '=',
    color: '#fa0',
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
  const material = appearances.wandMaterials.get(effect) || 'wooden';
  const identified = appearances.identified.wands.has(effect);
  const charges = 3 + Math.floor(Math.random() * 8); // 3-10 charges

  return {
    type: 'wand',
    name: identified ? `wand of ${formatEffectName(effect)}` : `${material} wand`,
    char: '/',
    color: '#af0',
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

// === AMULET ===
export function createAmulet(x: number, y: number): Item {
  return {
    type: 'amulet',
    name: 'The Amulet of Yendor',
    char: '"',
    color: '#f0f',
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
    const color = appearances.potionColors.get(item.effect as PotionEffect);
    return `${color} potion`;
  }
  if (item.type === 'scroll' && item.effect) {
    const title = appearances.scrollTitles.get(item.effect as ScrollEffect);
    return `scroll titled "${title}"`;
  }
  if (item.type === 'ring' && item.effect) {
    const gem = appearances.ringGems.get(item.effect as RingEffect);
    return `${gem} ring`;
  }
  if (item.type === 'wand' && item.effect) {
    const material = appearances.wandMaterials.get(item.effect as WandEffect);
    return `${material} wand`;
  }

  return item.name;
}

export function identifyItem(item: Item, appearances: ItemAppearances): void {
  item.identified = true;

  if (item.type === 'potion' && item.effect) {
    appearances.identified.potions.add(item.effect as PotionEffect);
    item.name = `potion of ${formatEffectName(item.effect)}`;
  }
  if (item.type === 'scroll' && item.effect) {
    appearances.identified.scrolls.add(item.effect as ScrollEffect);
    item.name = `scroll of ${formatEffectName(item.effect)}`;
  }
  if (item.type === 'ring' && item.effect) {
    appearances.identified.rings.add(item.effect as RingEffect);
    let name = `ring of ${formatEffectName(item.effect)}`;
    if (item.bonus) name = `${item.bonus > 0 ? '+' : ''}${item.bonus} ${name}`;
    item.name = name;
  }
  if (item.type === 'wand' && item.effect) {
    appearances.identified.wands.add(item.effect as WandEffect);
    item.name = `wand of ${formatEffectName(item.effect)}`;
  }
}

export function getItemChar(item: Item): string {
  return item.char;
}

export function getItemColor(item: Item): string {
  return item.color;
}
