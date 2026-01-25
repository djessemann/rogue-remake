export type TileType = 'floor' | 'wall' | 'corridor' | 'door' | 'stairs_down' | 'stairs_up' | 'void';

export interface Tile {
  type: TileType;
  explored: boolean;
  blocked: boolean;
  blocksLight: boolean;
}

export function createTile(type: TileType): Tile {
  const blockedTypes: TileType[] = ['wall', 'void'];
  const blocksLightTypes: TileType[] = ['wall', 'void', 'door'];

  return {
    type,
    explored: false,
    blocked: blockedTypes.includes(type),
    blocksLight: blocksLightTypes.includes(type),
  };
}

export function getTileChar(tile: Tile): string {
  switch (tile.type) {
    case 'floor': return '.';
    case 'wall': return '#';
    case 'corridor': return '#';
    case 'door': return '+';
    case 'stairs_down': return '>';
    case 'stairs_up': return '<';
    case 'void': return ' ';
    default: return ' ';
  }
}

export function getTileColor(tile: Tile): string {
  switch (tile.type) {
    case 'floor': return '#666';
    case 'wall': return '#964B00';
    case 'corridor': return '#964B00';
    case 'door': return '#8B4513';
    case 'stairs_down': return '#0ff';
    case 'stairs_up': return '#0ff';
    case 'void': return '#000';
    default: return '#aaa';
  }
}
