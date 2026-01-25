import { type Tile, createTile, type TileType } from './Tile';
import { COLS, MAP_ROWS } from '../constants';
import type { Item } from '../entities/Item';
import type { Monster } from '../entities/Monster';

export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export class Level {
  tiles: Tile[][];
  rooms: Room[] = [];
  items: Map<string, Item[]> = new Map();
  monsters: Monster[] = [];
  stairsDown: { x: number; y: number } | null = null;
  stairsUp: { x: number; y: number } | null = null;
  width: number;
  height: number;

  constructor(width: number = COLS, height: number = MAP_ROWS) {
    this.width = width;
    this.height = height;
    this.tiles = [];

    // Initialize with void
    for (let y = 0; y < height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < width; x++) {
        this.tiles[y][x] = createTile('void');
      }
    }
  }

  getTile(x: number, y: number): Tile | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.tiles[y][x];
  }

  setTile(x: number, y: number, type: TileType): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[y][x] = createTile(type);
    }
  }

  isPassable(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile !== null && !tile.blocked;
  }

  isTransparent(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile !== null && !tile.blocksLight;
  }

  explore(x: number, y: number): void {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.explored = true;
    }
  }

  addItem(x: number, y: number, item: Item): void {
    const key = `${x},${y}`;
    if (!this.items.has(key)) {
      this.items.set(key, []);
    }
    this.items.get(key)!.push(item);
  }

  getItems(x: number, y: number): Item[] {
    return this.items.get(`${x},${y}`) || [];
  }

  removeItem(x: number, y: number, item: Item): void {
    const key = `${x},${y}`;
    const items = this.items.get(key);
    if (items) {
      const index = items.indexOf(item);
      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }

  addMonster(monster: Monster): void {
    this.monsters.push(monster);
  }

  removeMonster(monster: Monster): void {
    const index = this.monsters.indexOf(monster);
    if (index !== -1) {
      this.monsters.splice(index, 1);
    }
  }

  getMonsterAt(x: number, y: number): Monster | null {
    return this.monsters.find(m => m.x === x && m.y === y) || null;
  }
}
