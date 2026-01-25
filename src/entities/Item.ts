export type ItemType = 'gold' | 'food' | 'weapon' | 'armor' | 'potion' | 'scroll' | 'ring' | 'wand' | 'amulet';

export interface Item {
  type: ItemType;
  name: string;
  char: string;
  color: string;
  x: number;
  y: number;
  value: number;
  bonus?: number;
  identified?: boolean;
}

export function createGold(x: number, y: number, levelNum: number): Item {
  const value = Math.floor(Math.random() * (50 + 10 * levelNum)) + 2;
  return {
    type: 'gold',
    name: `${value} gold pieces`,
    char: '*',
    color: '#ff0',
    x,
    y,
    value,
  };
}

export function createFood(x: number, y: number): Item {
  return {
    type: 'food',
    name: 'some food',
    char: ':',
    color: '#a52',
    x,
    y,
    value: 1,
  };
}

// Simple weapon definitions for Phase 1
export function createWeapon(x: number, y: number, name: string, bonus: number = 0): Item {
  return {
    type: 'weapon',
    name: bonus !== 0 ? `${bonus > 0 ? '+' : ''}${bonus} ${name}` : name,
    char: ')',
    color: '#0af',
    x,
    y,
    value: 0,
    bonus,
  };
}

export function createArmor(x: number, y: number, name: string, bonus: number = 0): Item {
  return {
    type: 'armor',
    name: bonus !== 0 ? `${bonus > 0 ? '+' : ''}${bonus} ${name}` : name,
    char: '[',
    color: '#0af',
    x,
    y,
    value: bonus,
    bonus,
  };
}

export function getItemChar(item: Item): string {
  return item.char;
}

export function getItemColor(item: Item): string {
  return item.color;
}
