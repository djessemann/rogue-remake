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
    case 'floor': return '#8a9080';       // Mossy stone floor
    case 'wall': return '#6d8a70';        // Living bark/wood - green-tinged
    case 'corridor': return '#5a7a60';    // Branch passage - darker bark
    case 'door': return '#7a9070';        // Bark door
    case 'stairs_down': return '#70b890'; // Descending branches - leaf green
    case 'stairs_up': return '#90d8b0';   // Ascending branches - bright leaf
    case 'void': return '#0a1a10';        // Dark tree hollow
    default: return '#7a8a78';
  }
}
