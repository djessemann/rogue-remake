export interface Entity {
  x: number;
  y: number;
  char: string;
  color: string;
  name: string;
}

export function createEntity(
  x: number,
  y: number,
  char: string,
  color: string,
  name: string
): Entity {
  return { x, y, char, color, name };
}
