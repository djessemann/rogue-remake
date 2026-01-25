import * as ROT from 'rot-js';
import { Display } from '../display/Display';
import { Level } from '../map/Level';
import { DungeonGenerator } from '../map/DungeonGenerator';
import { type Player, createPlayer, addExp } from '../entities/Player';
import { type Monster, getMonsterForLevel, createMonster, monsterAct } from '../entities/Monster';
import { createGold, createFood, createWeapon, createArmor } from '../entities/Item';
import { getTileChar, getTileColor } from '../map/Tile';
import { ControlPad, type Direction, type Action } from '../input/ControlPad';
import { KeyboardInput } from '../input/KeyboardInput';
import { playerAttack, monsterAttack } from '../systems/Combat';
import { DIRECTIONS, COLS, MAP_ROWS } from '../constants';

export class Game {
  private display: Display;
  private level: Level;
  private player: Player;
  private dungeonGenerator: DungeonGenerator;
  private currentLevelNum: number = 1;
  private messages: string[] = [];
  private fov!: InstanceType<typeof ROT.FOV.PreciseShadowcasting>;
  private visible: Set<string> = new Set();
  private gameOver: boolean = false;

  // UI elements
  private statusBar: HTMLElement;
  private messageLog: HTMLElement;

  constructor() {
    // Get containers
    const displayContainer = document.getElementById('display')!;
    const dpadContainer = document.getElementById('dpad')!;
    const actionBarContainer = document.getElementById('action-bar')!;
    this.statusBar = document.getElementById('status-bar')!;
    this.messageLog = document.getElementById('message-log')!;

    // Initialize display
    this.display = new Display(displayContainer);

    // Initialize input
    new ControlPad(dpadContainer, actionBarContainer, {
      onDirection: (dir) => this.handleDirection(dir),
      onAction: (action) => this.handleAction(action),
    });

    new KeyboardInput({
      onDirection: (dir) => this.handleDirection(dir),
      onAction: (action) => this.handleAction(action),
    });

    // Initialize game
    this.dungeonGenerator = new DungeonGenerator();
    this.level = this.dungeonGenerator.generate(this.currentLevelNum);

    const startPos = this.dungeonGenerator.getPlayerStartPosition(this.level);
    this.player = createPlayer(startPos.x, startPos.y);

    // Initialize FOV
    this.fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      return this.level.isTransparent(x, y);
    });

    // Spawn initial monsters and items
    this.spawnEntities();

    // Add welcome message
    this.addMessage('Welcome to the Dungeons of Doom!');

    // Initial render
    this.computeFOV();
    this.render();
  }

  private spawnEntities(): void {
    // Spawn monsters in some rooms (not the first)
    for (let i = 1; i < this.level.rooms.length; i++) {
      if (Math.random() < 0.6) { // 60% chance per room
        const room = this.level.rooms[i];
        const x = room.x + Math.floor(Math.random() * room.width);
        const y = room.y + Math.floor(Math.random() * room.height);

        if (this.level.isPassable(x, y) && !(x === this.player.x && y === this.player.y)) {
          const def = getMonsterForLevel(this.currentLevelNum);
          if (def) {
            const monster = createMonster(def, x, y);
            this.level.addMonster(monster);
          }
        }
      }
    }

    // Spawn gold and items in rooms
    for (const room of this.level.rooms) {
      // Gold
      if (Math.random() < 0.5) {
        const x = room.x + Math.floor(Math.random() * room.width);
        const y = room.y + Math.floor(Math.random() * room.height);
        if (this.level.isPassable(x, y)) {
          this.level.addItem(x, y, createGold(x, y, this.currentLevelNum));
        }
      }

      // Food (rarer)
      if (Math.random() < 0.15) {
        const x = room.x + Math.floor(Math.random() * room.width);
        const y = room.y + Math.floor(Math.random() * room.height);
        if (this.level.isPassable(x, y)) {
          this.level.addItem(x, y, createFood(x, y));
        }
      }
    }

    // Starting weapon for level 1
    if (this.currentLevelNum === 1) {
      this.player.weapon = createWeapon(0, 0, 'mace', 1);
      this.player.wornArmor = createArmor(0, 0, 'ring mail', 3);
      this.player.armor = 7 + 3; // Base armor + bonus
    }
  }

  private computeFOV(): void {
    this.visible.clear();
    this.fov.compute(this.player.x, this.player.y, 10, (x: number, y: number, _r: number, visibility: number) => {
      if (visibility > 0) {
        this.visible.add(`${x},${y}`);
        this.level.explore(x, y);
      }
    });
  }

  private handleDirection(dir: Direction): void {
    if (this.gameOver) return;

    const [dx, dy] = DIRECTIONS[dir];

    if (dx === 0 && dy === 0) {
      // Wait action
      this.endTurn();
      return;
    }

    const newX = this.player.x + dx;
    const newY = this.player.y + dy;

    // Check for monster
    const monster = this.level.getMonsterAt(newX, newY);
    if (monster) {
      this.attackMonster(monster);
      return;
    }

    // Check for passable
    if (!this.level.isPassable(newX, newY)) {
      // Check for door
      const tile = this.level.getTile(newX, newY);
      if (tile && tile.type === 'door') {
        // Open door
        this.level.setTile(newX, newY, 'floor');
        this.addMessage('You open the door.');
        this.endTurn();
      }
      return;
    }

    // Move player
    this.player.x = newX;
    this.player.y = newY;

    // Check for items on ground
    const items = this.level.getItems(newX, newY);
    if (items.length > 0) {
      const topItem = items[items.length - 1];
      this.addMessage(`You see ${topItem.name} here.`);
    }

    this.endTurn();
  }

  private handleAction(action: Action): void {
    if (this.gameOver && action !== 'help') return;

    switch (action) {
      case 'inventory':
        this.showInventory();
        break;
      case 'pickup':
        this.pickupItem();
        break;
      case 'wait':
        this.endTurn();
        break;
      case 'stairs_up':
        this.useStairs('up');
        break;
      case 'stairs_down':
        this.useStairs('down');
        break;
      case 'help':
        this.showHelp();
        break;
    }
  }

  private attackMonster(monster: Monster): void {
    const result = playerAttack(this.player, monster);
    this.addMessage(result.message);

    if (result.killed) {
      const leveledUp = addExp(this.player, monster.exp);
      this.level.removeMonster(monster);
      this.addMessage(`You gain ${monster.exp} experience.`);
      if (leveledUp) {
        this.addMessage(`Welcome to level ${this.player.level}!`);
      }
    }

    this.endTurn();
  }

  private pickupItem(): void {
    const items = this.level.getItems(this.player.x, this.player.y);
    if (items.length === 0) {
      this.addMessage('There is nothing here to pick up.');
      return;
    }

    const item = items[items.length - 1];

    if (item.type === 'gold') {
      this.player.gold += item.value;
      this.level.removeItem(this.player.x, this.player.y, item);
      this.addMessage(`You pick up ${item.name}.`);
    } else if (item.type === 'food') {
      this.player.hunger += 400;
      this.level.removeItem(this.player.x, this.player.y, item);
      this.addMessage('You eat the food. Yum!');
    } else {
      // Add to inventory
      if (this.player.inventory.length < 23) {
        this.player.inventory.push(item);
        this.level.removeItem(this.player.x, this.player.y, item);
        this.addMessage(`You pick up ${item.name}.`);
      } else {
        this.addMessage('Your pack is full.');
      }
    }

    this.endTurn();
  }

  private useStairs(direction: 'up' | 'down'): void {
    const tile = this.level.getTile(this.player.x, this.player.y);

    if (direction === 'down') {
      if (!tile || tile.type !== 'stairs_down') {
        this.addMessage('There are no stairs going down here.');
        return;
      }
      this.currentLevelNum++;
      this.addMessage(`You descend to level ${this.currentLevelNum}.`);
    } else {
      if (!tile || tile.type !== 'stairs_up') {
        this.addMessage('There are no stairs going up here.');
        return;
      }
      if (this.currentLevelNum === 1) {
        this.addMessage('You cannot leave the dungeon yet!');
        return;
      }
      this.currentLevelNum--;
      this.addMessage(`You ascend to level ${this.currentLevelNum}.`);
    }

    // Generate new level
    this.level = this.dungeonGenerator.generate(this.currentLevelNum);
    const startPos = this.dungeonGenerator.getPlayerStartPosition(this.level);
    this.player.x = startPos.x;
    this.player.y = startPos.y;
    this.spawnEntities();

    // Update FOV
    this.fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      return this.level.isTransparent(x, y);
    });

    this.computeFOV();
    this.render();
  }

  private endTurn(): void {
    // Monster turns
    for (const monster of this.level.monsters) {
      if (this.gameOver) break;

      const move = monsterAct(monster, this.player, this.level);

      // Check if monster is adjacent to player - attack
      const diagDist = Math.max(Math.abs(monster.x - this.player.x), Math.abs(monster.y - this.player.y));

      if (diagDist <= 1 && !(monster.x === this.player.x && monster.y === this.player.y)) {
        const result = monsterAttack(monster, this.player);
        this.addMessage(result.message);
        if (result.killed) {
          this.gameOver = true;
          this.addMessage('Game Over! Press ? for help.');
        }
      } else if (move) {
        const newX = monster.x + move.dx;
        const newY = monster.y + move.dy;
        if (this.level.isPassable(newX, newY) && !this.level.getMonsterAt(newX, newY)) {
          if (!(newX === this.player.x && newY === this.player.y)) {
            monster.x = newX;
            monster.y = newY;
          }
        }
      }
    }

    // Update hunger
    this.player.hunger--;
    if (this.player.hunger <= 0 && !this.gameOver) {
      this.player.hp -= 1;
      if (this.player.hp <= 0) {
        this.gameOver = true;
        this.addMessage('You starve to death... Game Over!');
      } else if (this.player.hunger === 0) {
        this.addMessage('You are starving!');
      }
    } else if (this.player.hunger === 150) {
      this.addMessage('You are getting hungry.');
    } else if (this.player.hunger === 50) {
      this.addMessage('You are weak from hunger.');
    }

    this.computeFOV();
    this.render();
  }

  private showInventory(): void {
    // Simple inventory display (we'll enhance this later)
    let modal = document.getElementById('inventory-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'inventory-modal';
      modal.innerHTML = `
        <button class="close-btn">&times;</button>
        <h2>Inventory</h2>
        <ul id="inventory-list"></ul>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.close-btn')!.addEventListener('click', () => {
        modal!.classList.remove('open');
      });
    }

    const list = modal.querySelector('#inventory-list')!;
    list.innerHTML = '';

    // Show equipped items
    if (this.player.weapon) {
      const li = document.createElement('li');
      li.textContent = `a) ${this.player.weapon.name} (wielded)`;
      list.appendChild(li);
    }
    if (this.player.wornArmor) {
      const li = document.createElement('li');
      li.textContent = `b) ${this.player.wornArmor.name} (worn)`;
      list.appendChild(li);
    }

    // Show pack items
    this.player.inventory.forEach((item, idx) => {
      const li = document.createElement('li');
      const letter = String.fromCharCode(99 + idx); // Start at 'c'
      li.textContent = `${letter}) ${item.name}`;
      list.appendChild(li);
    });

    if (list.children.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Your pack is empty.';
      list.appendChild(li);
    }

    modal.classList.add('open');
  }

  private showHelp(): void {
    let modal = document.getElementById('help-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'help-modal';
      modal.innerHTML = `
        <button class="close-btn">&times;</button>
        <h2>How to Play</h2>
        <p><strong>Goal:</strong> Descend through the dungeon, find the Amulet of Yendor, and return to the surface.</p>
        <p><strong>D-Pad:</strong> Move in 8 directions. Center button waits.</p>
        <p><strong>Action Buttons:</strong></p>
        <p>I - Inventory</p>
        <p>, - Pick up item</p>
        <p>. - Wait one turn</p>
        <p>&lt; - Go up stairs</p>
        <p>&gt; - Go down stairs</p>
        <p>? - This help</p>
        <p><strong>Keyboard:</strong> Arrow keys, numpad, or vi keys (hjkl) for movement.</p>
        <p><strong>Combat:</strong> Move into monsters to attack.</p>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.close-btn')!.addEventListener('click', () => {
        modal!.classList.remove('open');
      });
    }

    modal.classList.add('open');
  }

  private addMessage(msg: string): void {
    this.messages.unshift(msg);
    if (this.messages.length > 100) {
      this.messages.pop();
    }
    this.renderMessages();
  }

  private renderMessages(): void {
    const recent = this.messages.slice(0, 3);
    this.messageLog.innerHTML = recent
      .map((m) => `<div class="message">${m}</div>`)
      .join('');
  }

  private render(): void {
    this.display.clear();

    // Center camera on player
    this.display.centerOn(this.player.x, this.player.y, COLS, MAP_ROWS);

    // Get viewport bounds for efficient rendering
    const viewport = this.display.getViewportSize();
    const camera = this.display.getCameraPosition();
    const startX = camera.x;
    const startY = camera.y;
    const endX = Math.min(startX + viewport.cols, COLS);
    const endY = Math.min(startY + viewport.rows, MAP_ROWS);

    // Render only visible portion of map
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const tile = this.level.getTile(x, y);
        if (!tile) continue;

        const key = `${x},${y}`;
        const isVisible = this.visible.has(key);

        if (!tile.explored) continue;

        // Check for items
        const items = this.level.getItems(x, y);
        const monster = this.level.getMonsterAt(x, y);

        if (isVisible) {
          if (monster) {
            this.display.drawWorld(x, y, monster.char, monster.color, '#000');
          } else if (items.length > 0) {
            const topItem = items[items.length - 1];
            this.display.drawWorld(x, y, topItem.char, topItem.color, '#000');
          } else {
            this.display.drawWorld(x, y, getTileChar(tile), getTileColor(tile), '#000');
          }
        } else {
          // Explored but not visible - show in darker color
          this.display.drawWorld(x, y, getTileChar(tile), '#333', '#000');
        }
      }
    }

    // Render player
    this.display.drawWorld(this.player.x, this.player.y, '@', '#fff', '#000');

    // Render status bar
    const hungerStatus = this.player.hunger < 50 ? ' Weak' : this.player.hunger < 150 ? ' Hungry' : '';
    this.statusBar.innerHTML = `
      <span>Lv:${this.currentLevelNum} HP:${this.player.hp}/${this.player.maxHp} Str:${this.player.strength} AC:${this.player.armor} Exp:${this.player.level}/${this.player.exp}${hungerStatus}</span>
      <span>Gold:${this.player.gold}</span>
    `;
  }
}
