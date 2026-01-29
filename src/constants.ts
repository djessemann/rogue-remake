// Display dimensions (classic Rogue)
export const COLS = 80;
export const ROWS = 24;
export const MAP_ROWS = 21; // Leave room for status

// Tile characters
export const TILES = {
  FLOOR: '.',
  WALL: '#',
  CORRIDOR: '#',
  DOOR_CLOSED: '+',
  DOOR_OPEN: "'",
  STAIRS_DOWN: '>',
  STAIRS_UP: '<',
  PLAYER: '@',
  GOLD: '*',
  FOOD: ':',
  POTION: '!',
  SCROLL: '?',
  WEAPON: ')',
  ARMOR: '[',
  RING: '=',
  WAND: '/',
  AMULET: '"',
} as const;

// Colors - Interdimensional theme
export const COLORS = {
  FLOOR: '#8a9080',      // Reality membrane floor
  WALL: '#6d8a70',       // Dimensional barrier
  DOOR: '#7a9070',       // Phase gate
  STAIRS: '#90d8b0',     // Wormhole glow
  PLAYER: '#f0f8e0',     // Traveler suit glow
  GOLD: '#ffd700',       // Energy crystals
  ITEM: '#e0b0ff',       // Tech item glow
  FOOD: '#d4a574',       // Ration pack
  POTION: '#b0e0d0',     // Compound canister
  SCROLL: '#f0e8d0',     // Data chip
  DEFAULT: '#a8b8a0',    // Default item
} as const;

// Directions (for movement)
export const DIRECTIONS: Record<string, [number, number]> = {
  NW: [-1, -1],
  N: [0, -1],
  NE: [1, -1],
  W: [-1, 0],
  WAIT: [0, 0],
  E: [1, 0],
  SW: [-1, 1],
  S: [0, 1],
  SE: [1, 1],
};

// Starting stats
export const PLAYER_START = {
  hp: 12,
  maxHp: 12,
  strength: 16,
  maxStrength: 16,
  gold: 0,
  armor: 10, // AC (lower is better in original, we'll use higher is better)
  level: 1,
  exp: 0,
  hunger: 1300,
};

// Experience needed per level
export const EXP_LEVELS = [0, 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240];
