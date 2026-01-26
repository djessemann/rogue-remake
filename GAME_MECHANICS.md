# Rogue's Gallery - Game Mechanics

A complete guide to how the game works under the hood.

---

## Your Goal

Descend through 26 levels of the gallery, find **The Glowing Goblet** on level 26, and escape back to the surface (level 1 stairs up) to win!

---

## Your Character

### Starting Stats

When you begin a new game, your character starts with:

| Stat | Starting Value |
|------|----------------|
| HP (Hit Points) | 12 |
| Strength | 16 |
| Defense | 10 (higher is better) |
| Gold | 0 |
| Level | 1 |
| Experience | 0 |
| Hunger | 1300 turns until starving |

You also start with:
- A **+1 mace** (weapon)
- **+3 ring mail** (armor, gives you Def 10)

---

## Leveling Up

### Experience Thresholds

You gain experience by killing monsters. When you reach the threshold for the next level, you level up automatically.

| Level | Total XP Needed |
|-------|-----------------|
| 1 | 0 |
| 2 | 10 |
| 3 | 20 |
| 4 | 40 |
| 5 | 80 |
| 6 | 160 |
| 7 | 320 |
| 8 | 640 |
| 9 | 1280 |
| 10 | 2560 |
| 11 | 5120 |
| 12 | 10240 |

### What Happens When You Level Up

When you reach a new level:
- Your **Max HP increases by 2-9** (random)
- Your **HP is fully restored** to your new maximum!
- Your **attack accuracy improves** (your level is added to hit rolls)

---

## Combat

### How Attacks Work

Combat uses a d20 (20-sided die) system:

**When you attack a monster:**
```
Hit if: d20 + your level + attack bonus >= monster's armor
```

**When a monster attacks you:**
```
Hit if: d20 + monster level >= your defense
```

### Attack Bonus (from Strength)

Your strength gives you a bonus to hit:

| Strength | Attack Bonus |
|----------|--------------|
| 16 or less | +0 |
| 17 | +1 |
| 18 | +2 |
| 19-20 | +3 |
| 21+ | +4 |

Your weapon's bonus (like +1 mace) also adds to this.

### Damage

**Your damage:**
- Base: 1d4 (1-4 random)
- Plus strength bonus (see below)
- Plus weapon bonus

**Strength damage bonus:**

| Strength | Damage Bonus |
|----------|--------------|
| 15 or less | +0 |
| 16 | +1 |
| 17 | +2 |
| 18 | +3 |
| 19-20 | +4 |
| 21+ | +5 |

**Example:** With 16 strength and a +1 mace, you deal 1d4 + 1 (strength) + 1 (weapon) = 3-6 damage per hit.

---

## Monsters

### Monster List

| Symbol | Name | Color | HP | Armor | XP | First Appears | Behavior |
|--------|------|-------|-----|-------|-----|---------------|----------|
| B | Bat | Pink | 1d8 (1-8) | 3 | 1 | Level 1 | Erratic movement |
| E | Emu | Green | 1d8 (1-8) | 7 | 2 | Level 1 | Normal |
| H | Hobgoblin | Orange | 1d8 (1-8) | 5 | 3 | Level 1 | Aggressive |
| I | Ice Monster | Cyan | 1d8 (1-8) | 9 | 5 | Level 1 | Freezes you |
| K | Kestrel | Yellow | 1d8 (1-8) | 7 | 1 | Level 1 | Erratic movement |
| O | Orc | Teal | 1d8 (1-8) | 6 | 5 | Level 4 | Greedy |
| R | Rattlesnake | Lime | 2d8 (2-16) | 3 | 9 | Level 4 | Aggressive |
| S | Snake | Green | 1d8 (1-8) | 5 | 2 | Level 1 | Aggressive |
| Z | Zombie | Purple | 2d8 (2-16) | 8 | 6 | Level 5 | Aggressive |

### Monster Damage

| Monster | Damage |
|---------|--------|
| Bat | 1d2 (1-2) |
| Emu | 1d2 (1-2) |
| Snake | 1d3 (1-3) |
| Kestrel | 1d4 (1-4) |
| Rattlesnake | 1d6 (1-6) |
| Hobgoblin | 1d8 (1-8) |
| Orc | 1d8 (1-8) |
| Zombie | 1d8 (1-8) |
| Ice Monster | 0 (freezes instead) |

### Monster Behavior

**Sleeping vs Awake:**
- Most monsters start **asleep** and won't move until you get close
- **Aggressive monsters** (marked "mean") start awake and hunt you immediately
- Monsters wake up when you come within 2 tiles

**Movement Patterns:**
- **Normal:** Monsters use pathfinding to chase you intelligently
- **Erratic:** Bats and kestrels move randomly 50% of the time

---

## Hunger

You have a hunger counter that starts at **1300**. Every turn (every action you take), it decreases by 1.

### Hunger Stages

| Hunger Value | Status | Effect |
|--------------|--------|--------|
| 150+ | Normal | None |
| 50-149 | Hungry | Warning message |
| 1-49 | Weak | Warning message |
| 0 or less | Starving | Lose 1 HP per turn |

### Food

- Food (`:`) appears randomly in dungeon rooms (15% chance per room)
- Eating food adds **400 turns** to your hunger counter
- Food also **restores 25% of your max HP**
- Food is consumed immediately when you pick it up

---

## Items

### Item Types

| Symbol | Item Type | Color |
|--------|-----------|-------|
| `*` | Gold | Yellow |
| `:` | Food | Brown |
| `)` | Weapon | Blue |
| `[` | Armor | Blue |
| `!` | Potion | Various |
| `?` | Scroll | White |
| `=` | Ring | Orange |
| `/` | Wand | Lime |
| `U` | Glowing Goblet | Gold |

### Picking Up Items

- Stand on an item and press **P** to pick it up
- **Gold** is added to your total immediately
- **Food** is eaten immediately (restores hunger + 25% HP)
- **The Glowing Goblet** is picked up and you must escape!
- **Other items** go into your inventory (max 23 items)

### Using Items

Open your inventory with **I** and tap an item to use it:
- **Potions** are drunk immediately
- **Scrolls** are read immediately
- **Weapons/Armor** are equipped (old equipment goes to inventory)
- **Rings** are worn (you can wear 2 at once)
- **Wands** are zapped at the nearest visible monster

---

## Potions

Potions have randomized colors each game. You won't know what a potion does until you drink it (or use a scroll of identify).

| Effect | Description | Rarity |
|--------|-------------|--------|
| Healing | Restores 1-8 HP | Common |
| Extra Healing | Restores 1-16 HP | Rare |
| Poison | Deals 1-6 damage, lose 1-3 strength | Uncommon |
| Strength | Gain 1 strength permanently | Uncommon |
| Restore Strength | Restore strength to maximum (18) | Uncommon |
| Confusion | Become confused (no actual effect yet) | Uncommon |
| Blindness | Become blind (no actual effect yet) | Rare |
| See Invisible | Can see invisible creatures | Rare |
| Level Up | Gain one experience level! | Very Rare |
| Paralysis | Become paralyzed (no actual effect yet) | Rare |

---

## Scrolls

Scrolls have randomized titles (like "ABJ CHO") each game.

| Effect | Description |
|--------|-------------|
| Identify | Reveals the true nature of one item type |
| Teleport | Instantly teleport to a random location |
| Remove Curse | Removes curses from equipped items |
| Enchant Weapon | Your weapon gains +1 to hit and damage |
| Enchant Armor | Your armor gains +1 defense |
| Sleep | Puts nearby monsters to sleep |
| Scare | Monsters flee from you briefly |
| Magic Mapping | Reveals the entire level layout |
| Aggravate | Wakes up all monsters on the level! |
| Create Monster | Spawns a random monster nearby |

---

## Rings

Rings have randomized gem appearances each game. You can wear up to 2 rings at once. Some rings are cursed (negative bonus) - use Remove Curse to take them off.

| Effect | Description |
|--------|-------------|
| Protection | Adds bonus to your defense |
| Strength | Adds bonus to your strength |
| Sustenance | Slows hunger drain |
| Regeneration | Slowly regenerate HP over time |
| Slow Digestion | Greatly slows hunger drain |
| Searching | Better chance to find hidden things |
| See Invisible | Can see invisible creatures |
| Stealth | Monsters less likely to wake up |
| Teleportation | Randomly teleport (usually cursed!) |
| Dexterity | Bonus to attack accuracy |

---

## Wands

Wands have randomized materials (oak, iron, glass, etc.) each game. Each wand has 3-10 charges.

| Effect | Damage/Effect |
|--------|---------------|
| Magic Missile | 6-12 damage |
| Lightning | 6-12 damage |
| Fire | 6-12 damage |
| Cold | 6-12 damage |
| Polymorph | Transforms monster into a random creature |
| Slow | Slows the target monster |
| Teleport Away | Teleports monster to random location |
| Cancellation | Removes monster's special abilities |
| Drain | Halves the monster's current HP |
| Light | Illuminates the room |

---

## The Glowing Goblet

The ultimate treasure! It appears on **level 26** of the gallery.

- Shown as a golden `U` symbol
- Pick it up with **P**
- Once you have it, ascend back to level 1 and use the stairs up to **win the game!**

---

## Dungeon Generation

Each level is randomly generated with:

- **Multiple rooms** connected by corridors
- **Doors** (shown as `+`) that you walk into to open
- **Stairs down** (`>`) in one room
- **Stairs up** (`<`) in another room (except level 1)

### Item Spawn Rates

| Item Type | Chance per Room |
|-----------|-----------------|
| Gold | 50% |
| Food | 15% |
| Potions | 25% |
| Scrolls | 20% |
| Rings | 8% |
| Wands | 10% |
| Monsters | 60% (not starting room) |

### Field of View

- You can see **10 tiles** in all directions
- Walls and doors block your vision
- Areas you've explored stay visible (but darker) even when out of sight
- Monsters are only visible when in your line of sight

---

## Controls

### D-Pad (Movement)
```
↖ ↑ ↗
← · →
↙ ↓ ↘
```
- 8 directions for movement
- Center button (·) waits one turn

### Action Buttons

| Button | Action |
|--------|--------|
| I | Open inventory |
| P | Pick up item |
| S | Use stairs (auto-detects up/down) |
| ? | Help screen |

### Keyboard (Desktop)

- **Arrow keys** - 4-directional movement
- **Numpad** - 8-directional movement
- **Vi keys** (hjklyubn) - 8-directional movement
- **i** - Inventory
- **p** or **g** or **,** - Pick up
- **s** or **<** or **>** - Use stairs
- **w** or **.** or **space** - Wait
- **?** - Help

### Combat

To attack a monster, simply **move into it**. You'll automatically attack instead of moving.

---

## Status Bar Reference

```
Lv:1 HP:12/12 Str:16 Def:10 Exp:1/0    Gold:0
```

| Display | Meaning |
|---------|---------|
| Lv | Dungeon level (depth) |
| HP | Current / Maximum hit points |
| Str | Strength |
| Def | Defense (higher = better) |
| Exp | Character level / experience points |
| Gold | Total gold collected |

Additional status indicators:
- **Hungry** - Hunger below 150
- **Weak** - Hunger below 50

---

## Tips for Survival

1. **Don't rush** - Take your time to explore each level
2. **Watch your hunger** - Eat food before you're starving
3. **Identify potions carefully** - Some are harmful!
4. **Save scrolls of identify** - Use them on rings and wands
5. **Use corridors** - Fight monsters in narrow spaces so they can't surround you
6. **Level up** - The full HP restore from leveling is huge
7. **Wands are powerful** - Save them for tough situations
8. **Watch for cursed rings** - Teleportation rings are usually cursed

---

## What's Coming Next

Future updates may include:
- **More monsters** - All 26 letters of the alphabet
- **Save/Load** - Continue your adventure later
- **More item effects** - Confusion, blindness, paralysis mechanics
- **Special rooms** - Treasure rooms, monster zoos
