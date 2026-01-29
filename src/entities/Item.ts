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

// Item effect colors - Bright saturated palette
const POTION_DISPLAY_COLORS: Record<string, string> = {
  red: '#ff3333', blue: '#3366ff', green: '#33ff33', yellow: '#ffff33', orange: '#ff8833',
  purple: '#aa33ff', white: '#ffffff', black: '#666666', brown: '#cc6633', pink: '#ff66aa',
  grey: '#999999', clear: '#66ffff', murky: '#886644', golden: '#ffcc00', silver: '#ccccff'
};

// === ENERGY CRYSTALS (currency) ===
export function createGold(x: number, y: number, levelNum: number): Item {
  const value = Math.floor(Math.random() * (50 + 10 * levelNum)) + 2;
  return {
    type: 'gold',
    name: `${value} energy crystals`,
    char: '*',
    color: '#ffdd00',
    x,
    y,
    value,
  };
}

// === RATION PACK ===
export function createFood(x: number, y: number): Item {
  return {
    type: 'food',
    name: 'ration pack',
    char: ':',
    color: '#cc6633',
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
    color: '#33aaff',
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
    color: '#33aaff',
    x,
    y,
    value: bonus,
    bonus,
  };
}

// === COMPOUNDS (potions) ===
export function createPotion(x: number, y: number, effect: PotionEffect, appearances: ItemAppearances): Item {
  const color = appearances.potionColors.get(effect) || 'clear';
  const identified = appearances.identified.potions.has(effect);

  return {
    type: 'potion',
    name: identified ? formatCompoundName(effect) : `${color} compound`,
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

// === DATA CHIPS (scrolls) ===
export function createScroll(x: number, y: number, effect: ScrollEffect, appearances: ItemAppearances): Item {
  const title = appearances.scrollTitles.get(effect) || 'UNKNOWN';
  const identified = appearances.identified.scrolls.has(effect);

  return {
    type: 'scroll',
    name: identified ? formatChipName(effect) : `data chip "${title}"`,
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

// === IMPLANTS (rings) ===
export function createRing(x: number, y: number, effect: RingEffect, appearances: ItemAppearances, bonus: number = 0): Item {
  const gem = appearances.ringGems.get(effect) || 'plain';
  const identified = appearances.identified.rings.has(effect);
  const cursed = Math.random() < 0.15;
  const actualBonus = cursed ? -Math.abs(bonus || 1) : bonus;

  let name: string;
  if (identified) {
    name = formatImplantName(effect);
    if (actualBonus !== 0) name = `${actualBonus > 0 ? '+' : ''}${actualBonus} ${name}`;
  } else {
    name = `${gem} implant`;
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

// === DEVICES (wands) ===
export function createWand(x: number, y: number, effect: WandEffect, appearances: ItemAppearances): Item {
  const material = appearances.wandMaterials.get(effect) || 'wooden';
  const identified = appearances.identified.wands.has(effect);
  const charges = 3 + Math.floor(Math.random() * 8); // 3-10 charges

  return {
    type: 'wand',
    name: identified ? formatDeviceName(effect) : `${material} device`,
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

// === WARP CORE ===
export function createAmulet(x: number, y: number): Item {
  return {
    type: 'amulet',
    name: 'The Warp Core',
    char: 'U',
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

// Compound (potion) names - sci-fi themed
const COMPOUND_NAMES: Record<PotionEffect, string> = {
  healing: 'med-gel',
  extraHealing: 'trauma patch',
  poison: 'toxic compound',
  strength: 'stim-shot',
  restoreStrength: 'purifier',
  confusion: 'neural disruptor',
  blindness: 'optic scrambler',
  seeInvisible: 'phase lens serum',
  levelUp: 'cognition boost',
  paralysis: 'nerve agent',
};

function formatCompoundName(effect: PotionEffect): string {
  return COMPOUND_NAMES[effect] || formatEffectName(effect);
}

// Data chip (scroll) names - sci-fi themed
const CHIP_NAMES: Record<ScrollEffect, string> = {
  identify: 'analysis chip',
  teleport: 'blink module',
  removeCurse: 'debug patch',
  enchantWeapon: 'weapon mod chip',
  enchantArmor: 'armor mod chip',
  sleep: 'sedation chip',
  scare: 'fear emitter',
  magicMapping: 'zone scanner',
  aggravate: 'signal flare',
  createMonster: 'spawn beacon',
};

function formatChipName(effect: ScrollEffect): string {
  return CHIP_NAMES[effect] || formatEffectName(effect);
}

// Implant (ring) names - sci-fi themed
const IMPLANT_NAMES: Record<RingEffect, string> = {
  protection: 'shield implant',
  strength: 'power implant',
  sustenance: 'metabolism regulator',
  regeneration: 'nano-repair system',
  slowDigestion: 'energy optimizer',
  searching: 'sensor array',
  seeInvisible: 'phase detector',
  stealth: 'cloak module',
  teleportation: 'random blink implant',
  dexterity: 'reflex booster',
};

function formatImplantName(effect: RingEffect): string {
  return IMPLANT_NAMES[effect] || formatEffectName(effect);
}

// Device (wand) names - sci-fi themed
const DEVICE_NAMES: Record<WandEffect, string> = {
  light: 'flare launcher',
  lightning: 'arc caster',
  fire: 'thermal ray',
  cold: 'cryo beam',
  polymorph: 'gene scrambler',
  magicMissile: 'plasma bolt gun',
  slow: 'stasis field emitter',
  teleportAway: 'blink gun',
  cancellation: 'nullifier',
  drain: 'life tap',
};

function formatDeviceName(effect: WandEffect): string {
  return DEVICE_NAMES[effect] || formatEffectName(effect);
}

export function getItemDisplayName(item: Item, appearances?: ItemAppearances): string {
  if (item.identified || !appearances) {
    return item.name;
  }

  // Return unidentified name based on type
  if (item.type === 'potion' && item.effect) {
    const color = appearances.potionColors.get(item.effect as PotionEffect);
    return `${color} compound`;
  }
  if (item.type === 'scroll' && item.effect) {
    const title = appearances.scrollTitles.get(item.effect as ScrollEffect);
    return `data chip "${title}"`;
  }
  if (item.type === 'ring' && item.effect) {
    const gem = appearances.ringGems.get(item.effect as RingEffect);
    return `${gem} implant`;
  }
  if (item.type === 'wand' && item.effect) {
    const material = appearances.wandMaterials.get(item.effect as WandEffect);
    return `${material} device`;
  }

  return item.name;
}

export function identifyItem(item: Item, appearances: ItemAppearances): void {
  item.identified = true;

  if (item.type === 'potion' && item.effect) {
    appearances.identified.potions.add(item.effect as PotionEffect);
    item.name = formatCompoundName(item.effect as PotionEffect);
  }
  if (item.type === 'scroll' && item.effect) {
    appearances.identified.scrolls.add(item.effect as ScrollEffect);
    item.name = formatChipName(item.effect as ScrollEffect);
  }
  if (item.type === 'ring' && item.effect) {
    appearances.identified.rings.add(item.effect as RingEffect);
    let name = formatImplantName(item.effect as RingEffect);
    if (item.bonus) name = `${item.bonus > 0 ? '+' : ''}${item.bonus} ${name}`;
    item.name = name;
  }
  if (item.type === 'wand' && item.effect) {
    appearances.identified.wands.add(item.effect as WandEffect);
    item.name = formatDeviceName(item.effect as WandEffect);
  }
}

export function getItemChar(item: Item): string {
  return item.char;
}

export function getItemColor(item: Item): string {
  return item.color;
}
