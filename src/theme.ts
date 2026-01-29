// Theme configuration for different game versions
// Set VITE_THEME environment variable to switch themes: 'classic' | 'rift'

export type ThemeType = 'classic' | 'rift';

export interface GameTheme {
  name: string;
  goalItem: string;
  goalItemChar: string;
  goalVerb: string; // "descend" or "drift"
  locationName: string; // "gallery" or "dimensions"
  levelWord: string; // "Level" or "Dimension"
  goldName: string; // "gold" or "credits"
  foodName: string; // "food" or "rations"

  // Monster name mappings
  monsters: Record<string, string>;

  // Item type names
  potionName: string; // "potion" or "compound"
  scrollName: string; // "scroll" or "data chip"
  ringName: string; // "ring" or "implant"
  wandName: string; // "wand" or "emitter"

  // Unidentified item descriptors
  potionDescriptors: string[]; // colors for potions/compounds
  scrollDescriptors: string[]; // syllables for scrolls / codes for data chips
  ringDescriptors: string[]; // gems for rings / materials for implants
  wandDescriptors: string[]; // materials for wands/emitters

  // Weapon names
  weapons: Record<string, string>;

  // Armor names
  armor: Record<string, string>;

  // UI text
  victoryTitle: string;
  victoryMessage: string;
  helpGoalText: string;
}

const classicTheme: GameTheme = {
  name: 'Rogues Gallery',
  goalItem: 'The Glowing Goblet',
  goalItemChar: 'U',
  goalVerb: 'descend',
  locationName: 'gallery',
  levelWord: 'Level',
  goldName: 'gold',
  foodName: 'some food',

  monsters: {
    B: 'bat',
    E: 'emu',
    H: 'hobgoblin',
    I: 'ice monster',
    K: 'kestrel',
    S: 'snake',
    O: 'orc',
    R: 'rattlesnake',
    Z: 'zombie',
    A: 'aquator',
    T: 'troll',
    P: 'phantom',
    N: 'nymph',
    V: 'vampire',
    W: 'wraith',
  },

  potionName: 'potion',
  scrollName: 'scroll',
  ringName: 'ring',
  wandName: 'wand',

  potionDescriptors: [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'white', 'black',
    'brown', 'pink', 'grey', 'clear', 'murky', 'golden', 'silver'
  ],
  scrollDescriptors: [
    'ABJ', 'ACH', 'AIE', 'BLE', 'CHO', 'DIS', 'ENC', 'FID', 'GAN', 'HAR',
    'ION', 'JIK', 'KHO', 'LEM', 'MAN', 'NOR', 'OPS', 'PLA', 'QUE', 'RHO',
    'SIE', 'TIX', 'ULU', 'VAS', 'WEX', 'YOD', 'ZAP'
  ],
  ringDescriptors: [
    'ruby', 'diamond', 'emerald', 'sapphire', 'opal', 'pearl', 'onyx',
    'jade', 'amethyst', 'topaz', 'garnet', 'turquoise'
  ],
  wandDescriptors: [
    'oak', 'iron', 'glass', 'silver', 'bone', 'bronze', 'copper',
    'crystal', 'ebony', 'maple', 'brass', 'steel'
  ],

  weapons: {
    'mace': 'mace',
    'long sword': 'long sword',
    'dagger': 'dagger',
    'two-handed sword': 'two-handed sword',
    'spear': 'spear',
  },

  armor: {
    'leather armor': 'leather armor',
    'ring mail': 'ring mail',
    'scale mail': 'scale mail',
    'chain mail': 'chain mail',
    'plate mail': 'plate mail',
  },

  victoryTitle: 'Victory!',
  victoryMessage: 'You have retrieved the Glowing Goblet and escaped Rogue\'s Gallery!',
  helpGoalText: 'Descend through the gallery, find the Glowing Goblet, and return to the surface.',
};

const riftTheme: GameTheme = {
  name: 'Rogue Rift',
  goalItem: 'The Warp Core',
  goalItemChar: 'W',
  goalVerb: 'drift',
  locationName: 'rift',
  levelWord: 'Dimension',
  goldName: 'credits',
  foodName: 'ration pack',

  monsters: {
    B: 'blink moth',        // bat - erratic flying creature
    E: 'echo stalker',      // emu - alien predator
    H: 'hive soldier',      // hobgoblin - aggressive alien warrior
    I: 'cryo wraith',       // ice monster - freezing entity
    K: 'kill drone',        // kestrel - erratic flying robot
    S: 'spore serpent',     // snake - alien snake
    O: 'ooze hulk',         // orc - alien brute
    R: 'rad viper',         // rattlesnake - venomous, drains strength
    Z: 'zero-g zombie',     // zombie - reanimated spacer
    A: 'acid horror',       // aquator - corrodes armor
    T: 'titan brute',       // troll - regenerating heavy
    P: 'phase specter',     // phantom - invisible
    N: 'nano thief',        // nymph - steals items
    V: 'void drinker',      // vampire - drains HP
    W: 'warp phantom',      // wraith - drains XP, invisible
  },

  potionName: 'compound',
  scrollName: 'data chip',
  ringName: 'implant',
  wandName: 'emitter',

  potionDescriptors: [
    'crimson', 'cobalt', 'viridian', 'amber', 'plasma', 'violet', 'milky', 'void',
    'rust', 'neon', 'chrome', 'clear', 'turbid', 'flux', 'ion'
  ],
  scrollDescriptors: [
    'X7B', 'Q9F', 'Z3R', 'M8K', 'P2V', 'N6J', 'Y4H', 'T1D', 'W5G', 'L0C',
    'A9X', 'R7M', 'K3P', 'V8N', 'F2Z', 'J6Y', 'H4T', 'D1W', 'G5L', 'C0A',
    'U8R', 'B3K', 'S7V', 'E2N', 'I6J', 'O4H', 'Q1D'
  ],
  ringDescriptors: [
    'neural', 'cortex', 'reflex', 'synth', 'quantum', 'pulse', 'flux',
    'plasma', 'ion', 'zero-g', 'phase', 'nano'
  ],
  wandDescriptors: [
    'plasma', 'ion', 'pulse', 'photon', 'quantum', 'zero-point', 'flux',
    'phase', 'warp', 'sonic', 'graviton', 'tachyon'
  ],

  weapons: {
    'mace': 'shock baton',
    'long sword': 'plasma blade',
    'dagger': 'vibro knife',
    'two-handed sword': 'heavy plasma cutter',
    'spear': 'ion lance',
  },

  armor: {
    'leather armor': 'flex suit',
    'ring mail': 'mesh armor',
    'scale mail': 'composite plating',
    'chain mail': 'nano weave',
    'plate mail': 'power armor',
  },

  victoryTitle: 'Rift Sealed!',
  victoryMessage: 'You have secured the Warp Core and escaped the dimensional rift!',
  helpGoalText: 'Drift through the dimensions, find the Warp Core, and return to realspace.',
};

// Determine theme from environment variable or default to classic
function getThemeType(): ThemeType {
  const envTheme = import.meta.env.VITE_THEME as string | undefined;
  if (envTheme === 'rift') return 'rift';
  return 'classic';
}

export const currentTheme: GameTheme = getThemeType() === 'rift' ? riftTheme : classicTheme;

// Helper to get themed monster name
export function getThemedMonsterName(char: string): string {
  return currentTheme.monsters[char] || 'unknown creature';
}

// Helper to translate weapon names
export function getThemedWeaponName(classicName: string): string {
  return currentTheme.weapons[classicName] || classicName;
}

// Helper to translate armor names
export function getThemedArmorName(classicName: string): string {
  return currentTheme.armor[classicName] || classicName;
}

// === DIMENSION COLOR PALETTES (Rift theme only) ===
// Each dimension has a unique color scheme for floor, wall, and accent
export interface DimensionPalette {
  name: string;
  floor: string;
  wall: string;
  corridor: string;
  door: string;
  stairs: string;
}

const dimensionPalettes: DimensionPalette[] = [
  { name: 'Verdant Sprawl',  floor: '#2d5a2d', wall: '#1a3d1a', corridor: '#1a3d1a', door: '#4a7a4a', stairs: '#90ee90' },
  { name: 'Crimson Wastes',  floor: '#8b2500', wall: '#5c1a1a', corridor: '#5c1a1a', door: '#a04040', stairs: '#ff6b6b' },
  { name: 'Frozen Void',     floor: '#4a6a8a', wall: '#2a4a6a', corridor: '#2a4a6a', door: '#6a8aaa', stairs: '#a0e0f0' },
  { name: 'Amber Hive',      floor: '#8b7500', wall: '#5c4a00', corridor: '#5c4a00', door: '#a08520', stairs: '#ffd700' },
  { name: 'Violet Abyss',    floor: '#5a2d6a', wall: '#3a1a4a', corridor: '#3a1a4a', door: '#7a4d8a', stairs: '#da70d6' },
  { name: 'Molten Core',     floor: '#8b4500', wall: '#5c2a00', corridor: '#5c2a00', door: '#a06520', stairs: '#ff8c00' },
  { name: 'Silver Static',   floor: '#606068', wall: '#404048', corridor: '#404048', door: '#808088', stairs: '#c0c0c0' },
  { name: 'Coral Depths',    floor: '#2a6a6a', wall: '#1a4a4a', corridor: '#1a4a4a', door: '#4a8a8a', stairs: '#40e0d0' },
  { name: 'Golden Citadel',  floor: '#8b7a30', wall: '#5c5020', corridor: '#5c5020', door: '#a09040', stairs: '#ffd700' },
  { name: 'White Rift',      floor: '#707080', wall: '#505060', corridor: '#505060', door: '#909098', stairs: '#e0e0f0' },
];

// Classic theme uses static colors
const classicPalette: DimensionPalette = {
  name: 'Gallery',
  floor: '#808080',
  wall: '#c9a090',
  corridor: '#c9a090',
  door: '#b0a090',
  stairs: '#a0e0f0',
};

// Get the palette for a given level number
export function getDimensionPalette(levelNum: number): DimensionPalette {
  if (getThemeType() === 'classic') {
    return classicPalette;
  }
  // Rift theme: cycle through 10 dimensions
  const index = (levelNum - 1) % dimensionPalettes.length;
  return dimensionPalettes[index];
}

// Get dimension name for display
export function getDimensionName(levelNum: number): string {
  if (getThemeType() === 'classic') {
    return `Level ${levelNum}`;
  }
  const palette = getDimensionPalette(levelNum);
  return `${palette.name} (Dimension ${levelNum})`;
}
