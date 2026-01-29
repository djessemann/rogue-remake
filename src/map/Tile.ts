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
    case 'floor': return '#8a9080';       // Pocket reality floor
    case 'wall': return '#6d8a70';        // Reality membrane barrier
    case 'corridor': return '#5a7a60';    // Dimensional tunnel
    case 'door': return '#7a9070';        // Phase gate
    case 'stairs_down': return '#70b890'; // Wormhole - forward rift
    case 'stairs_up': return '#90d8b0';   // Wormhole - return rift
    case 'void': return '#0a1a10';        // Dimensional void
    default: return '#7a8a78';
  }
}
