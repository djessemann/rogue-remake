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
