import { getDimensionPalette } from '../theme';

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

export function getTileColor(tile: Tile, levelNum: number = 1): string {
  const palette = getDimensionPalette(levelNum);

  switch (tile.type) {
    case 'floor': return palette.floor;
    case 'wall': return palette.wall;
    case 'corridor': return palette.corridor;
    case 'door': return palette.door;
    case 'stairs_down': return palette.stairs;
    case 'stairs_up': return palette.stairs;
    case 'void': return '#000';
    default: return '#b0b0b0';
  }
}
