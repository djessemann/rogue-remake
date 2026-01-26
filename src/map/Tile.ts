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
    case 'floor': return '#808080';
    case 'wall': return '#c9a090';
    case 'corridor': return '#c9a090';
    case 'door': return '#b0a090';
    case 'stairs_down': return '#a0e0f0';
    case 'stairs_up': return '#a0e0f0';
    case 'void': return '#000';
    default: return '#b0b0b0';
  }
}
