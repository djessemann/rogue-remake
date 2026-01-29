import * as ROT from 'rot-js';
import { Display } from '../display/Display';
import { Level } from '../map/Level';
import { DungeonGenerator } from '../map/DungeonGenerator';
import { type Player, createPlayer, addExp } from '../entities/Player';
import { type Monster, getMonsterForLevel, createMonster, monsterAct } from '../entities/Monster';
import {
  type Item, type ItemAppearances, type PotionEffect, type ScrollEffect,
  createGold, createFood, createWeapon, createArmor,
  createPotion, createScroll, createRing, createWand, createAmulet,
  getRandomPotionEffect, getRandomScrollEffect, getRandomRingEffect, getRandomWandEffect,
  initializeItemAppearances, identifyItem
} from '../entities/Item';
import { applyPotionEffect, applyScrollEffect } from '../systems/ItemEffects';
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
  private itemAppearances: ItemAppearances;

  // UI elements
  private statusBar: HTMLElement;
  private messageLog: HTMLElement;

  /**
   * Dimension palettes - each dimension has a distinct, striking color scheme.
   * Each palette: [background, floor, wall]
   */
  private readonly DIMENSION_PALETTES: Record<number, { bg: string; floor: string; wall: string; name: string }> = {
    1:  { bg: '#0a1f0a', floor: '#3d6b4a', wall: '#1a3d1f', name: 'The Verdant Sprawl' },      // Home - overgrown jungle
    2:  { bg: '#2a0a0a', floor: '#8a3030', wall: '#4a1515', name: 'The Crimson Wastes' },      // Mars-like desolation
    3:  { bg: '#0a1525', floor: '#4a7a9a', wall: '#1a3545', name: 'The Frozen Void' },         // Cryo-dimension
    4:  { bg: '#251a05', floor: '#9a7a30', wall: '#4a3a15', name: 'The Amber Hive' },          // Insectoid realm
    5:  { bg: '#150a20', floor: '#6a4a8a', wall: '#351a45', name: 'The Violet Abyss' },        // Psychic dimension
    6:  { bg: '#200a00', floor: '#aa5500', wall: '#551a00', name: 'The Molten Core' },         // Volcanic hellscape
    7:  { bg: '#151515', floor: '#7a7a7a', wall: '#3a3a3a', name: 'The Silver Static' },       // Glitched reality
    8:  { bg: '#0a1515', floor: '#4a8a7a', wall: '#1a4a40', name: 'The Coral Depths' },        // Underwater alien
    9:  { bg: '#1a1505', floor: '#aa9a40', wall: '#554a1a', name: 'The Golden Citadel' },      // Ancient tech
    10: { bg: '#101520', floor: '#9090a0', wall: '#505060', name: 'The White Rift' },          // Edge of existence
  };

  /**
   * Get the background color for the current dimension.
   */
  private getBackgroundForLevel(level: number): string {
    const l = Math.max(1, Math.min(10, level));
    return this.DIMENSION_PALETTES[l].bg;
  }

  /**
   * Get the floor tile color for the current dimension.
   */
  private getFloorColorForLevel(level: number): string {
    const l = Math.max(1, Math.min(10, level));
    return this.DIMENSION_PALETTES[l].floor;
  }

  /**
   * Get the wall tile color for the current dimension.
   */
  private getWallColorForLevel(level: number): string {
    const l = Math.max(1, Math.min(10, level));
    return this.DIMENSION_PALETTES[l].wall;
  }

  /**
   * Get the dimension name.
   */
  private getDimensionName(level: number): string {
    const l = Math.max(1, Math.min(10, level));
    return this.DIMENSION_PALETTES[l].name;
  }

  /**
   * Get the dimmed background color for explored but not visible areas.
   */
  private getDimmedBackground(level: number): string {
    const bg = this.getBackgroundForLevel(level);
    // Parse and darken by ~40%
    const r = Math.round(parseInt(bg.slice(1, 3), 16) * 0.6);
    const g = Math.round(parseInt(bg.slice(3, 5), 16) * 0.6);
    const b = Math.round(parseInt(bg.slice(5, 7), 16) * 0.6);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Get the dimmed floor/wall color for explored but not visible areas.
   */
  private getDimmedTileColor(color: string): string {
    const r = Math.round(parseInt(color.slice(1, 3), 16) * 0.5);
    const g = Math.round(parseInt(color.slice(3, 5), 16) * 0.5);
    const b = Math.round(parseInt(color.slice(5, 7), 16) * 0.5);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

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

    // Initialize item appearances (randomized per game)
    this.itemAppearances = initializeItemAppearances();

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
    this.addMessage("Dimensional breach detected. Locate your Warp Core to return home.");

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
            const monster = createMonster(def, x, y, this.currentLevelNum);
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

      // Potions
      if (Math.random() < 0.25) {
        const x = room.x + Math.floor(Math.random() * room.width);
        const y = room.y + Math.floor(Math.random() * room.height);
        if (this.level.isPassable(x, y)) {
          this.level.addItem(x, y, createPotion(x, y, getRandomPotionEffect(), this.itemAppearances));
        }
      }

      // Scrolls
      if (Math.random() < 0.2) {
        const x = room.x + Math.floor(Math.random() * room.width);
        const y = room.y + Math.floor(Math.random() * room.height);
        if (this.level.isPassable(x, y)) {
          this.level.addItem(x, y, createScroll(x, y, getRandomScrollEffect(), this.itemAppearances));
        }
      }

      // Rings (rare)
      if (Math.random() < 0.08) {
        const x = room.x + Math.floor(Math.random() * room.width);
        const y = room.y + Math.floor(Math.random() * room.height);
        if (this.level.isPassable(x, y)) {
          const bonus = Math.floor(Math.random() * 3); // 0-2 bonus
          this.level.addItem(x, y, createRing(x, y, getRandomRingEffect(), this.itemAppearances, bonus));
        }
      }

      // Wands (rare)
      if (Math.random() < 0.1) {
        const x = room.x + Math.floor(Math.random() * room.width);
        const y = room.y + Math.floor(Math.random() * room.height);
        if (this.level.isPassable(x, y)) {
          this.level.addItem(x, y, createWand(x, y, getRandomWandEffect(), this.itemAppearances));
        }
      }
    }

    // Spawn Warp Core on dimension 10
    if (this.currentLevelNum === 10) {
      const room = this.level.rooms[Math.floor(Math.random() * this.level.rooms.length)];
      const x = room.x + Math.floor(Math.random() * room.width);
      const y = room.y + Math.floor(Math.random() * room.height);
      if (this.level.isPassable(x, y)) {
        this.level.addItem(x, y, createAmulet(x, y));
      }
    }

    // Starting equipment for dimension 1
    if (this.currentLevelNum === 1) {
      this.player.weapon = createWeapon(0, 0, 'stun baton', 1);
      this.player.wornArmor = createArmor(0, 0, 'mesh armor', 3);
      this.player.armor = 7 + 3; // Base armor + bonus
    }
  }

  private computeFOV(): void {
    this.visible.clear();

    // If blind, can only see the tile you're standing on
    if (this.player.status.blind > 0) {
      this.visible.add(`${this.player.x},${this.player.y}`);
      return;
    }

    this.fov.compute(this.player.x, this.player.y, 10, (x: number, y: number, _r: number, visibility: number) => {
      if (visibility > 0) {
        this.visible.add(`${x},${y}`);
        this.level.explore(x, y);
      }
    });
  }

  private handleDirection(dir: Direction): void {
    if (this.gameOver) return;

    // Check if paralyzed
    if (this.player.status.paralyzed > 0) {
      this.addMessage('You are paralyzed and cannot move!');
      this.endTurn();
      return;
    }

    let [dx, dy] = DIRECTIONS[dir];

    if (dx === 0 && dy === 0) {
      // Wait action
      this.endTurn();
      return;
    }

    // Confusion: 50% chance to move in random direction
    if (this.player.status.confused > 0 && Math.random() < 0.5) {
      const dirs = Object.values(DIRECTIONS).filter(([x, y]) => x !== 0 || y !== 0);
      [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
      this.addMessage('You stumble around confused!');
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
      case 'stairs':
        this.useStairsAuto();
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

  private applyMonsterAbility(monster: Monster): void {
    // Strength drain (Rattlesnake)
    if (monster.flags.includes('drainStr') && Math.random() < 0.3) {
      this.player.strength = Math.max(3, this.player.strength - 1);
      this.addMessage(`The ${monster.name}'s bite weakens you! (-1 Str)`);
    }

    // Armor rust (Aquator)
    if (monster.flags.includes('rustArmor') && this.player.wornArmor) {
      if (this.player.wornArmor.bonus && this.player.wornArmor.bonus > 0) {
        this.player.wornArmor.bonus--;
        this.player.armor = Math.max(0, this.player.armor - 1);
        this.player.wornArmor.name = this.player.wornArmor.bonus > 0
          ? `+${this.player.wornArmor.bonus} ${this.player.wornArmor.name.replace(/^\+?\d*\s*/, '')}`
          : this.player.wornArmor.name.replace(/^\+?\d*\s*/, '');
        this.addMessage(`The ${monster.name} corrodes your armor!`);
      }
    }

    // HP drain (Vampire) - permanent max HP loss
    if (monster.flags.includes('drainHP') && Math.random() < 0.25) {
      this.player.maxHp = Math.max(1, this.player.maxHp - 1);
      this.player.hp = Math.min(this.player.hp, this.player.maxHp);
      this.addMessage(`The ${monster.name} drains your life force! (-1 Max HP)`);
    }

    // XP drain (Wraith) - can lose levels
    if (monster.flags.includes('drainXP') && Math.random() < 0.2) {
      if (this.player.level > 1) {
        this.player.exp = Math.max(0, this.player.exp - 10);
        // Check if we should de-level (simplified)
        this.addMessage(`The ${monster.name} drains your experience!`);
      }
    }

    // Item steal (Nymph)
    if (monster.flags.includes('stealItem') && this.player.inventory.length > 0) {
      const idx = Math.floor(Math.random() * this.player.inventory.length);
      const stolen = this.player.inventory.splice(idx, 1)[0];
      this.addMessage(`The ${monster.name} steals your ${stolen.name} and vanishes!`);
      this.level.removeMonster(monster);
    }
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
      // Restore 25% of max HP
      const hpRestore = Math.floor(this.player.maxHp * 0.25);
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + hpRestore);
      this.level.removeItem(this.player.x, this.player.y, item);
      this.addMessage(`You consume the ration pack. (+${hpRestore} HP)`);
    } else if (item.type === 'amulet') {
      this.player.hasAmulet = true;
      this.level.removeItem(this.player.x, this.player.y, item);
      this.gameOver = true;
      this.showVictory();
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

  private useStairsAuto(): void {
    const tile = this.level.getTile(this.player.x, this.player.y);
    if (tile?.type === 'stairs_down') {
      this.climbUp();
    } else {
      this.addMessage('There is no way to climb here.');
    }
  }

  private climbUp(): void {
    const tile = this.level.getTile(this.player.x, this.player.y);

    if (!tile || tile.type !== 'stairs_down') {
      this.addMessage('There is no way to climb here.');
      return;
    }

    this.currentLevelNum++;
    this.addMessage(`You enter the wormhole... ${this.getDimensionName(this.currentLevelNum)} (Dimension ${this.currentLevelNum})`);

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

      // Regenerating monsters heal
      if (monster.flags.includes('regenerate') && monster.hp < monster.maxHp) {
        monster.hp = Math.min(monster.maxHp, monster.hp + 1);
      }

      const move = monsterAct(monster, this.player, this.level);

      // Check if monster is adjacent to player - attack
      const diagDist = Math.max(Math.abs(monster.x - this.player.x), Math.abs(monster.y - this.player.y));

      if (diagDist <= 1 && !(monster.x === this.player.x && monster.y === this.player.y)) {
        const result = monsterAttack(monster, this.player);
        this.addMessage(result.message);

        // Apply special monster abilities on hit
        if (result.hit) {
          this.applyMonsterAbility(monster);
        }

        if (result.killed) {
          this.gameOver = true;
          this.showGameOver('You were slain by the ' + monster.name + '!');
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

    // Update status effects
    if (this.player.status.confused > 0) {
      this.player.status.confused--;
      if (this.player.status.confused === 0) {
        this.addMessage('You feel less confused.');
      }
    }
    if (this.player.status.blind > 0) {
      this.player.status.blind--;
      if (this.player.status.blind === 0) {
        this.addMessage('You can see again!');
      }
    }
    if (this.player.status.paralyzed > 0) {
      this.player.status.paralyzed--;
      if (this.player.status.paralyzed === 0) {
        this.addMessage('You can move again.');
      }
    }

    // Update power reserve (faster drain in deeper dimensions)
    const hungerDrain = 1 + Math.floor(this.currentLevelNum / 4);
    this.player.hunger -= hungerDrain;
    if (this.player.hunger <= 0 && !this.gameOver) {
      this.player.hp -= 1;
      if (this.player.hp <= 0) {
        this.gameOver = true;
        this.showGameOver('Life support failure!');
      } else if (this.player.hunger === 0) {
        this.addMessage('CRITICAL: Life support failing!');
      }
    } else if (this.player.hunger === 150) {
      this.addMessage('Warning: Power reserve low.');
    } else if (this.player.hunger === 50) {
      this.addMessage('ALERT: Suit power critical!');
    }

    this.computeFOV();
    this.render();
  }

  private showInventory(): void {
    let modal = document.getElementById('inventory-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'inventory-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <h2>Inventory</h2>
      <p class="inventory-hint">Tap an item to use it</p>
      <ul id="inventory-list"></ul>
      <button class="modal-close-btn">Close</button>
    `;

    modal.querySelector('.modal-close-btn')!.addEventListener('click', () => {
      modal!.classList.remove('open');
    });

    const list = modal.querySelector('#inventory-list')!;

    // Show equipped items
    if (this.player.weapon) {
      const li = document.createElement('li');
      li.textContent = `a) ${this.player.weapon.name} (wielded)`;
      li.className = 'equipped';
      list.appendChild(li);
    }
    if (this.player.wornArmor) {
      const li = document.createElement('li');
      li.textContent = `b) ${this.player.wornArmor.name} (worn)`;
      li.className = 'equipped';
      list.appendChild(li);
    }

    // Show rings
    this.player.rings.forEach((ring, idx) => {
      if (ring) {
        const li = document.createElement('li');
        li.textContent = `${idx === 0 ? 'L' : 'R'}) ${ring.name} (worn)`;
        li.className = 'equipped';
        list.appendChild(li);
      }
    });

    // Show pack items
    this.player.inventory.forEach((item, idx) => {
      const li = document.createElement('li');
      const letter = String.fromCharCode(99 + idx); // Start at 'c'
      li.textContent = `${letter}) ${item.name}`;
      li.className = 'item-row';
      li.addEventListener('click', () => {
        modal!.classList.remove('open');
        this.useInventoryItem(idx);
      });
      list.appendChild(li);
    });

    if (list.children.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Your pack is empty.';
      list.appendChild(li);
    }

    modal.classList.add('open');
  }

  private useInventoryItem(index: number): void {
    const item = this.player.inventory[index];
    if (!item) return;

    if (item.type === 'potion') {
      const effect = item.effect as PotionEffect;
      const result = applyPotionEffect(effect, this.player, item, this.itemAppearances);
      this.addMessage(result.message);
      this.player.inventory.splice(index, 1);
      if (this.player.hp <= 0) {
        this.gameOver = true;
        this.showGameOver('You died from a poisonous potion!');
      }
      this.endTurn();
    } else if (item.type === 'scroll') {
      const effect = item.effect as ScrollEffect;
      const result = applyScrollEffect(effect, this.player, item, this.itemAppearances, this.level);
      this.addMessage(result.message);
      this.player.inventory.splice(index, 1);
      if (result.teleported || result.mapped) {
        this.computeFOV();
      }
      this.endTurn();
    } else if (item.type === 'weapon') {
      // Swap weapons
      const oldWeapon = this.player.weapon;
      this.player.weapon = item;
      this.player.inventory.splice(index, 1);
      if (oldWeapon) {
        this.player.inventory.push(oldWeapon);
      }
      this.addMessage(`You wield the ${item.name}.`);
      this.render();
    } else if (item.type === 'armor') {
      // Swap armor
      const oldArmor = this.player.wornArmor;
      this.player.wornArmor = item;
      this.player.armor = 7 + (item.bonus || 0);
      this.player.inventory.splice(index, 1);
      if (oldArmor) {
        this.player.inventory.push(oldArmor);
      }
      this.addMessage(`You put on the ${item.name}.`);
      this.render();
    } else if (item.type === 'ring') {
      // Find empty ring slot or swap
      const emptySlot = this.player.rings.findIndex(r => r === null);
      if (emptySlot !== -1) {
        this.player.rings[emptySlot] = item;
        this.player.inventory.splice(index, 1);
        identifyItem(item, this.itemAppearances);
        this.addMessage(`You put on the ${item.name}.`);
      } else {
        // Swap with left ring
        const oldRing = this.player.rings[0];
        this.player.rings[0] = item;
        this.player.inventory.splice(index, 1);
        if (oldRing) {
          this.player.inventory.push(oldRing);
        }
        identifyItem(item, this.itemAppearances);
        this.addMessage(`You put on the ${item.name}.`);
      }
      this.render();
    } else if (item.type === 'wand') {
      if (item.charges && item.charges > 0) {
        // For now, just zap in a random direction at nearest monster
        const nearestMonster = this.findNearestMonster();
        if (nearestMonster) {
          item.charges--;
          identifyItem(item, this.itemAppearances);
          this.addMessage(`You zap the ${item.name} at the ${nearestMonster.name}!`);
          // Apply wand effect
          this.applyWandEffect(item, nearestMonster);
        } else {
          this.addMessage('Nothing happens.');
        }
        this.endTurn();
      } else {
        this.addMessage('The wand has no charges left.');
      }
    } else if (item.type === 'food') {
      this.player.hunger += 400;
      const hpRestore = Math.floor(this.player.maxHp * 0.25);
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + hpRestore);
      this.player.inventory.splice(index, 1);
      this.addMessage(`You consume the ration pack. (+${hpRestore} HP)`);
      this.endTurn();
    }
  }

  private findNearestMonster(): Monster | null {
    let nearest: Monster | null = null;
    let minDist = Infinity;
    for (const monster of this.level.monsters) {
      if (this.visible.has(`${monster.x},${monster.y}`)) {
        const dist = Math.abs(monster.x - this.player.x) + Math.abs(monster.y - this.player.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = monster;
        }
      }
    }
    return nearest;
  }

  private applyWandEffect(wand: Item, monster: Monster): void {
    switch (wand.effect) {
      case 'magicMissile': {
        // Reliable single-target damage
        const damage = Math.floor(Math.random() * 6) + 6; // 6-12 damage
        monster.hp -= damage;
        this.addMessage(`The magic missile hits the ${monster.name} for ${damage} damage!`);
        if (monster.hp <= 0) {
          const leveledUp = addExp(this.player, monster.exp);
          this.level.removeMonster(monster);
          this.addMessage(`The ${monster.name} is killed!`);
          if (leveledUp) {
            this.addMessage(`Welcome to level ${this.player.level}!`);
          }
        }
        break;
      }
      case 'lightning': {
        // Chains to nearby enemies with reduced damage
        const targets = [monster];
        // Find up to 2 more monsters within 3 tiles of the target
        for (const m of this.level.monsters) {
          if (m === monster) continue;
          const dist = Math.abs(m.x - monster.x) + Math.abs(m.y - monster.y);
          if (dist <= 3 && targets.length < 3) {
            targets.push(m);
          }
        }
        let chainDamage = 10; // First target takes most damage
        for (const target of targets) {
          target.hp -= chainDamage;
          this.addMessage(`Lightning strikes the ${target.name} for ${chainDamage} damage!`);
          if (target.hp <= 0) {
            const leveledUp = addExp(this.player, target.exp);
            this.level.removeMonster(target);
            this.addMessage(`The ${target.name} is killed!`);
            if (leveledUp) {
              this.addMessage(`Welcome to level ${this.player.level}!`);
            }
          }
          chainDamage = Math.floor(chainDamage * 0.6); // 60% damage to next target
        }
        break;
      }
      case 'fire': {
        // Burns for high damage
        const damage = Math.floor(Math.random() * 8) + 8; // 8-16 damage
        monster.hp -= damage;
        this.addMessage(`Fire engulfs the ${monster.name} for ${damage} damage!`);
        if (monster.hp <= 0) {
          const leveledUp = addExp(this.player, monster.exp);
          this.level.removeMonster(monster);
          this.addMessage(`The ${monster.name} is incinerated!`);
          if (leveledUp) {
            this.addMessage(`Welcome to level ${this.player.level}!`);
          }
        }
        break;
      }
      case 'cold': {
        // Lower damage but puts the monster to sleep (slows them)
        const damage = Math.floor(Math.random() * 4) + 4; // 4-8 damage
        monster.hp -= damage;
        monster.sleeping = true; // Frozen = sleeping
        this.addMessage(`Cold freezes the ${monster.name} for ${damage} damage! It is slowed.`);
        if (monster.hp <= 0) {
          const leveledUp = addExp(this.player, monster.exp);
          this.level.removeMonster(monster);
          this.addMessage(`The ${monster.name} shatters!`);
          if (leveledUp) {
            this.addMessage(`Welcome to level ${this.player.level}!`);
          }
        }
        break;
      }
      case 'slow':
        this.addMessage(`The ${monster.name} slows down.`);
        break;
      case 'teleportAway':
        // Teleport monster to random location
        const floors: { x: number; y: number }[] = [];
        for (let y = 0; y < this.level.height; y++) {
          for (let x = 0; x < this.level.width; x++) {
            const tile = this.level.getTile(x, y);
            if (tile && tile.type === 'floor' && !this.level.getMonsterAt(x, y)) {
              floors.push({ x, y });
            }
          }
        }
        if (floors.length > 0) {
          const dest = floors[Math.floor(Math.random() * floors.length)];
          monster.x = dest.x;
          monster.y = dest.y;
          this.addMessage(`The ${monster.name} vanishes!`);
        }
        break;
      case 'cancellation':
        this.addMessage(`The ${monster.name} looks disenchanted.`);
        break;
      case 'drain':
        monster.hp = Math.floor(monster.hp / 2);
        this.addMessage(`The ${monster.name} looks weaker.`);
        break;
      case 'polymorph':
        // Transform into a random monster
        const def = getMonsterForLevel(Math.floor(Math.random() * 10) + 1);
        if (def) {
          // Roll HP based on dice definition [dice, sides]
          const [dice, sides] = def.hp;
          let newHp = 0;
          for (let i = 0; i < dice; i++) {
            newHp += Math.floor(Math.random() * sides) + 1;
          }
          monster.name = def.name;
          monster.char = def.char;
          monster.color = def.color;
          monster.hp = newHp;
          monster.maxHp = newHp;
          this.addMessage(`The monster transforms!`);
        }
        break;
      case 'light':
        // Illuminate the area
        this.addMessage('The room is lit up!');
        break;
      default:
        this.addMessage('The wand sparks briefly.');
    }
  }

  private showHelp(): void {
    let modal = document.getElementById('help-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'help-modal';
      modal.innerHTML = `
        <h2>How to Play</h2>
        <p><strong>Goal:</strong> You are stranded between dimensions. Find your Warp Core in Dimension 10 and return home!</p>
        <p><strong>D-Pad:</strong> Move in 8 directions. Center button waits.</p>
        <p><strong>Action Buttons:</strong></p>
        <p>I - Inventory</p>
        <p>P - Pick up item</p>
        <p>S - Enter wormhole</p>
        <p>? - This help</p>
        <p><strong>Keyboard:</strong> Arrow keys, numpad, or vi keys (hjkl) for movement.</p>
        <p><strong>Combat:</strong> Move into entities to attack.</p>
        <p><strong>Rations:</strong> Restores suit power and 25% HP.</p>
        <button class="modal-close-btn">Close</button>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.modal-close-btn')!.addEventListener('click', () => {
        modal!.classList.remove('open');
      });
    }

    modal.classList.add('open');
  }

  private showGameOver(reason: string): void {
    this.addMessage(reason);

    let modal = document.getElementById('gameover-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gameover-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <h2>Mission Failed</h2>
      <p class="death-reason">${reason}</p>
      <div class="stats">
        <p>Dimension Reached: ${this.currentLevelNum}</p>
        <p>Traveler Level: ${this.player.level}</p>
        <p>Crystals Collected: ${this.player.gold}</p>
        <p>Experience: ${this.player.exp}</p>
      </div>
      <button class="restart-btn">Try Again</button>
    `;

    modal.querySelector('.restart-btn')!.addEventListener('click', () => {
      modal!.classList.remove('open');
      this.restartGame();
    });

    modal.classList.add('open');
  }

  private showVictory(): void {
    let modal = document.getElementById('victory-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'victory-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <h2>Mission Complete!</h2>
      <p class="victory-text">You have recovered the Warp Core and can finally return home!</p>
      <div class="stats">
        <p>Traveler Level: ${this.player.level}</p>
        <p>Crystals Collected: ${this.player.gold}</p>
        <p>Experience: ${this.player.exp}</p>
      </div>
      <button class="restart-btn">Drift Again</button>
    `;

    modal.querySelector('.restart-btn')!.addEventListener('click', () => {
      modal!.classList.remove('open');
      this.restartGame();
    });

    modal.classList.add('open');
  }

  private restartGame(): void {
    // Reset game state
    this.currentLevelNum = 1;
    this.messages = [];
    this.visible.clear();
    this.gameOver = false;
    this.itemAppearances = initializeItemAppearances();

    // Generate new level
    this.level = this.dungeonGenerator.generate(this.currentLevelNum);
    const startPos = this.dungeonGenerator.getPlayerStartPosition(this.level);
    this.player = createPlayer(startPos.x, startPos.y);

    // Reset FOV
    this.fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      return this.level.isTransparent(x, y);
    });

    // Spawn entities
    this.spawnEntities();

    // Welcome message
    this.addMessage("Dimensional breach detected. Locate your Warp Core to return home.");

    // Render
    this.computeFOV();
    this.render();
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

    // Get dynamic colors based on current dimension
    const bgColor = this.getBackgroundForLevel(this.currentLevelNum);
    const dimmedBgColor = this.getDimmedBackground(this.currentLevelNum);
    const floorColor = this.getFloorColorForLevel(this.currentLevelNum);
    const wallColor = this.getWallColorForLevel(this.currentLevelNum);
    const dimmedFloorColor = this.getDimmedTileColor(floorColor);
    const dimmedWallColor = this.getDimmedTileColor(wallColor);

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

        // Get the dimension-appropriate tile color
        const tileColor = (tile.type === 'floor' || tile.type === 'corridor') ? floorColor :
                         (tile.type === 'wall') ? wallColor :
                         (tile.type === 'stairs_down' || tile.type === 'stairs_up') ? '#90d8b0' :
                         getTileColor(tile);
        const dimmedTileColor = (tile.type === 'floor' || tile.type === 'corridor') ? dimmedFloorColor :
                               (tile.type === 'wall') ? dimmedWallColor :
                               this.getDimmedTileColor(tileColor);

        if (isVisible) {
          if (monster) {
            // Check if monster is invisible
            const isInvisible = monster.flags.includes('invisible');
            const canSee = !isInvisible ||
                          this.player.status.seeInvisible ||
                          (Math.abs(monster.x - this.player.x) <= 1 && Math.abs(monster.y - this.player.y) <= 1);
            if (canSee) {
              this.display.drawWorld(x, y, monster.char, monster.color, bgColor);
            } else {
              // Monster is invisible - show the floor/items underneath
              if (items.length > 0) {
                const topItem = items[items.length - 1];
                this.display.drawWorld(x, y, topItem.char, topItem.color, bgColor);
              } else {
                this.display.drawWorld(x, y, getTileChar(tile), tileColor, bgColor);
              }
            }
          } else if (items.length > 0) {
            const topItem = items[items.length - 1];
            this.display.drawWorld(x, y, topItem.char, topItem.color, bgColor);
          } else {
            this.display.drawWorld(x, y, getTileChar(tile), tileColor, bgColor);
          }
        } else {
          // Explored but not visible - show in darker/dimmed color
          this.display.drawWorld(x, y, getTileChar(tile), dimmedTileColor, dimmedBgColor);
        }
      }
    }

    // Render player with a slight glow effect (brighter background)
    this.display.drawWorld(this.player.x, this.player.y, '@', '#f0f8e0', bgColor);

    // Render status bar
    const powerStatus = this.player.hunger < 50 ? 'CRITICAL' : this.player.hunger < 150 ? 'LOW PWR' : '';
    this.statusBar.innerHTML = `
      <span>Dim:${this.currentLevelNum}</span>
      <span>HP:${this.player.hp}/${this.player.maxHp}</span>
      <span>Str:${this.player.strength}</span>
      <span>Def:${this.player.armor}</span>
      <span>Exp:${this.player.exp}</span>
      <span>Crys:${this.player.gold}</span>
      ${powerStatus ? `<span class="status-warning">${powerStatus}</span>` : ''}
    `;
  }
}
