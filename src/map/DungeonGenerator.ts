import * as ROT from 'rot-js';
import { Level, type Room } from './Level';
import { COLS, MAP_ROWS } from '../constants';

export class DungeonGenerator {
  generate(levelNumber: number): Level {
    const level = new Level(COLS, MAP_ROWS);

    // Use rot-js Digger for dungeon generation
    const digger = new ROT.Map.Digger(COLS, MAP_ROWS, {
      roomWidth: [4, 9],
      roomHeight: [3, 6],
      corridorLength: [2, 8],
      dugPercentage: 0.25,
    });

    // Generate the map
    digger.create((x, y, wall) => {
      if (wall) {
        level.setTile(x, y, 'wall');
      } else {
        level.setTile(x, y, 'floor');
      }
    });

    // Get rooms from digger
    const rotRooms = digger.getRooms();
    for (const room of rotRooms) {
      const r: Room = {
        x: room.getLeft(),
        y: room.getTop(),
        width: room.getRight() - room.getLeft() + 1,
        height: room.getBottom() - room.getTop() + 1,
        centerX: Math.floor((room.getLeft() + room.getRight()) / 2),
        centerY: Math.floor((room.getTop() + room.getBottom()) / 2),
      };
      level.rooms.push(r);

      // Add doors
      room.getDoors((x, y) => {
        level.setTile(x, y, 'door');
      });
    }

    // Place stairs
    if (level.rooms.length >= 2) {
      // Stairs up in first room (except level 1)
      if (levelNumber > 1) {
        const upRoom = level.rooms[0];
        level.stairsUp = { x: upRoom.centerX, y: upRoom.centerY };
        level.setTile(upRoom.centerX, upRoom.centerY, 'stairs_up');
      }

      // Stairs down in last room
      const downRoom = level.rooms[level.rooms.length - 1];
      level.stairsDown = { x: downRoom.centerX, y: downRoom.centerY };
      level.setTile(downRoom.centerX, downRoom.centerY, 'stairs_down');
    }

    return level;
  }

  getPlayerStartPosition(level: Level): { x: number; y: number } {
    // Start in first room, but not on stairs
    if (level.rooms.length > 0) {
      const room = level.rooms[0];
      // Find a floor tile in the room
      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) {
          const tile = level.getTile(x, y);
          if (tile && tile.type === 'floor') {
            return { x, y };
          }
        }
      }
    }
    // Fallback
    return { x: Math.floor(COLS / 2), y: Math.floor(MAP_ROWS / 2) };
  }
}
