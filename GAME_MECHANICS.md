# Mobile Rogue - Game Mechanics

A complete guide to how the game works under the hood.

---

## Your Character

### Starting Stats

When you begin a new game, your character starts with:

| Stat | Starting Value |
|------|----------------|
| HP (Hit Points) | 12 |
| Strength | 16 |
| Armor Class | 10 (higher is better) |
| Gold | 0 |
| Level | 1 |
| Experience | 0 |
| Hunger | 1300 turns until starving |

You also start with:
- A **+1 mace** (weapon)
- **+3 ring mail** (armor, gives you AC 10)

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
- Your **current HP increases by the same amount** (instant heal!)
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
Hit if: d20 + monster level >= your armor class
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

### Monster Damage

Each monster has its own damage dice:

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

---

## Monsters

### Monster List

| Symbol | Name | HP | Armor | XP | First Appears | Behavior |
|--------|------|-----|-------|-----|---------------|----------|
| B | Bat | 1d8 | 3 | 1 | Level 1 | Erratic movement |
| E | Emu | 1d8 | 7 | 2 | Level 1 | Normal |
| H | Hobgoblin | 1d8 | 5 | 3 | Level 1 | Aggressive (always awake) |
| I | Ice Monster | 1d8 | 9 | 5 | Level 1 | Freezes you |
| K | Kestrel | 1d8 | 7 | 1 | Level 1 | Erratic movement |
| O | Orc | 1d8 | 6 | 5 | Level 4 | Greedy |
| R | Rattlesnake | 2d8 | 3 | 9 | Level 4 | Aggressive |
| S | Snake | 1d8 | 5 | 2 | Level 1 | Aggressive |
| Z | Zombie | 2d8 | 8 | 6 | Level 5 | Aggressive |

### Monster Behavior

**Sleeping vs Awake:**
- Most monsters start **asleep** and won't move until you get close
- **Aggressive monsters** (marked "mean") start awake and hunt you immediately
- Monsters wake up when you come within 2 tiles

**Movement Patterns:**
- **Normal:** Monsters use pathfinding to chase you intelligently
- **Erratic:** Bats and kestrels move randomly 50% of the time

**Combat:**
- Monsters attack when adjacent to you (including diagonals)
- They get one attack per turn after you move

### Deeper Dungeons = Harder Monsters

As you descend:
- **Levels 1-3:** Bats, emus, snakes, hobgoblins, ice monsters, kestrels
- **Level 4+:** Orcs and rattlesnakes start appearing
- **Level 5+:** Zombies join the mix

The game randomly picks from all monsters that can appear at your current depth, so you might still see weaker monsters on deeper levels.

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

- Food appears randomly in dungeon rooms (15% chance per room)
- Eating food adds **400 turns** to your hunger counter
- Food is consumed immediately when you pick it up (`,` button)

**Tip:** Don't wait until you're starving! Eat when you find food if you're below 1000 hunger.

---

## Items

### Currently Implemented

| Symbol | Item Type | Effect |
|--------|-----------|--------|
| `*` | Gold | Adds to your gold count |
| `:` | Food | Restores 400 hunger |
| `)` | Weapon | Equip for combat bonus |
| `[` | Armor | Equip for defense |

### Picking Up Items

- Stand on an item and press `,` (comma) to pick it up
- **Gold** is added to your total immediately
- **Food** is eaten immediately
- **Other items** go into your inventory (max 23 items)

### Your Starting Equipment

- **+1 Mace:** Adds +1 to hit and +1 to damage
- **+3 Ring Mail:** Gives you armor class 10 (base 7 + 3 bonus)

---

## Dungeon Generation

Each level is randomly generated with:

- **Multiple rooms** connected by corridors
- **Doors** (shown as `+`) that you walk into to open
- **Stairs down** (`>`) in one room
- **Stairs up** (`<`) in another room (except level 1)
- **Gold** spawns in ~50% of rooms
- **Food** spawns in ~15% of rooms
- **Monsters** spawn in ~60% of rooms (not the starting room)

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
| , | Pick up item |
| . | Wait one turn |
| < | Go up stairs |
| > | Go down stairs |
| ? | Help screen |

### Combat

To attack a monster, simply **move into it**. You'll automatically attack instead of moving.

---

## Tips for Survival

1. **Don't rush** - Take your time to explore each level
2. **Watch your hunger** - Eat food before you're starving
3. **Use corridors** - Fight monsters in narrow spaces so they can't surround you
4. **Level up** - The HP boost from leveling is significant
5. **Aggressive monsters are dangerous** - Hobgoblins, snakes, rattlesnakes, and zombies will chase you immediately
6. **Higher armor = better** - Your armor class makes monsters miss more often

---

## Status Bar Reference

```
Lv:1 HP:12/12 Str:16 AC:10 Exp:1/0    Gold:0
```

| Display | Meaning |
|---------|---------|
| Lv | Dungeon level (depth) |
| HP | Current / Maximum hit points |
| Str | Strength |
| AC | Armor class (higher = better) |
| Exp | Character level / experience points |
| Gold | Total gold collected |

Additional status indicators:
- **Hungry** - Hunger below 150
- **Weak** - Hunger below 50

---

## What's Coming Next

The following features are planned for future updates:

- **Potions** - Healing, strength, confusion, and more
- **Scrolls** - Identify, teleport, enchant weapons
- **Rings** - Passive bonuses when worn
- **Wands** - Ranged magic attacks
- **More monsters** - All 26 letters of the alphabet
- **The Glowing Goblet** - The ultimate goal on level 26
- **Save/Load** - Continue your adventure later
