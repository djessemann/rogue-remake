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

// Colors
export const COLORS = {
  FLOOR: '#666',
  WALL: '#964B00',
  DOOR: '#8B4513',
  STAIRS: '#0ff',
  PLAYER: '#fff',
  GOLD: '#ff0',
  ITEM: '#f0f',
  FOOD: '#a52',
  POTION: '#f0f',
  SCROLL: '#fff',
  DEFAULT: '#aaa',
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
