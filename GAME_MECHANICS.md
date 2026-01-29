# Dimensional Drift - Game Mechanics

A complete guide to how the game works under the hood.

---

## The Story

You are an interdimensional traveler whose ship suffered a catastrophic warp accident. The violent breach scattered you across the fabric of reality, depositing you in **The Verdant Sprawl** - Dimension 1, a strange jungle world that will serve as your home base.

But your ship's **Warp Core** - the only thing that can get you home - was flung through 10 increasingly unstable dimensions. To return to your own reality, you must navigate through each dimension, facing the hostile alien entities that inhabit these strange realms, until you reach **The White Rift** - Dimension 10, the very edge of existence itself, where your Warp Core awaits.

Each dimension is radically different - from the crimson wastelands of Dimension 2, to the violet psychic abyss of Dimension 5, to the glitched silver static of Dimension 7. Your suit's power reserve drains faster in the deeper dimensions, and the entities become increasingly dangerous.

---

## Your Goal

Navigate through **10 dimensions** of reality, find **The Warp Core** in Dimension 10, and return to Dimension 1 to warp home and win!

---

## Your Character

### Starting Stats

When you begin a new game, your character starts with:

| Stat | Starting Value |
|------|----------------|
| HP (Hit Points) | 12 |
| Strength | 16 |
| Defense | 10 (higher is better) |
| Energy Crystals | 0 |
| Level | 1 |
| Experience | 0 |
| Power Reserve | 1300 turns |

You also start with:
- A **+1 stun baton** (weapon)
- **+3 mesh armor** (gives you Def 10)

---

## Leveling Up

### Experience Thresholds

You gain experience by defeating alien entities. When you reach the threshold for the next level, you level up automatically.

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

**When you attack an entity:**
```
Hit if: d20 + your level + attack bonus >= entity's armor
```

**When an entity attacks you:**
```
Hit if: d20 + entity level >= your defense
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

Your weapon's bonus (like +1 stun baton) also adds to this.

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

**Example:** With 16 strength and a +1 stun baton, you deal 1d4 + 1 (strength) + 1 (weapon) = 3-6 damage per hit.

---

## Status Effects

Your character can be affected by various status conditions:

| Status | Effect | Duration | Source |
|--------|--------|----------|--------|
| **Confused** | 50% chance to move in a random direction | 10-19 turns | Neural Disruptor compound |
| **Blind** | Can only see the tile you're standing on | 50-99 turns | Optic Scrambler compound |
| **Paralyzed** | Cannot move or act | 2-5 turns | Nerve Agent compound |
| **See Invisible** | Can see phase-shifted entities | Permanent | Phase Lens Serum compound |

When an effect wears off, you'll see a message letting you know.

---

## Alien Entities

### Entity List

Entities have had their HP increased by 20% for added challenge. All entities now use d10 for HP rolls instead of d8.

| Symbol | Name | Color | HP | Armor | XP | First Appears | Special Abilities |
|--------|------|-------|-----|-------|-----|---------------|-------------------|
| B | Blink Moth | Pink | 1d10 (1-10) | 3 | 1 | Dim 1 | Phase-shifting movement |
| E | Echo Stalker | Green | 1d10 (1-10) | 7 | 2 | Dim 1 | None |
| H | Hiveling | Orange | 1d10 (1-10) | 5 | 3 | Dim 1 | Aggressive |
| I | Ion Specter | Cyan | 1d10 (1-10) | 9 | 5 | Dim 1 | Stasis field |
| K | Kinetic Sprite | Yellow | 1d10 (1-10) | 7 | 1 | Dim 1 | Unstable movement |
| S | Spine Crawler | Green | 1d10 (1-10) | 5 | 2 | Dim 1 | Aggressive |
| O | Obsidian Hulk | Teal | 1d10 (1-10) | 6 | 5 | Dim 3 | Hoards energy |
| R | Rift Leech | Lime | 2d10 (2-20) | 3 | 9 | Dim 3 | **Siphons Vitality** |
| Z | Zero-Point Husk | Purple | 2d10 (2-20) | 8 | 6 | Dim 4 | Aggressive |
| A | Acid Jelly | Blue | 2d10 (2-20) | 2 | 15 | Dim 5 | **Corrodes Armor** |
| T | Titan Polyp | Green | 3d10 (3-30) | 4 | 25 | Dim 5 | **Rapid Cell Division** |
| P | Phase Walker | Lavender | 2d10 (2-20) | 3 | 20 | Dim 6 | **Invisible** |
| N | Nanite Swarm | Pink | 2d10 (2-20) | 9 | 18 | Dim 7 | **Disassembles Gear** |
| V | Void Drinker | Red | 3d10 (3-30) | 1 | 40 | Dim 8 | **Drains Life Force** |
| W | Warp Specter | Gray | 2d10 (2-20) | 4 | 35 | Dim 9 | **Erases Memories, Invisible** |

### Entity Damage

| Entity | Damage |
|---------|--------|
| Blink Moth | 1d2 (1-2) |
| Echo Stalker | 1d2 (1-2) |
| Spine Crawler | 1d3 (1-3) |
| Kinetic Sprite | 1d4 (1-4) |
| Rift Leech | 1d6 (1-6) |
| Hiveling | 1d8 (1-8) |
| Obsidian Hulk | 1d8 (1-8) |
| Zero-Point Husk | 1d8 (1-8) |
| Ion Specter | 0 (stasis instead) |
| Acid Jelly | 0 (corrodes armor instead) |
| Titan Polyp | 2d6 (2-12) |
| Phase Walker | 1d8 (1-8) |
| Nanite Swarm | 0 (disassembles gear instead) |
| Void Drinker | 1d10 (1-10) |
| Warp Specter | 1d6 (1-6) |

### Entity Special Abilities

Some entities have devastating special abilities that trigger when they hit you:

| Ability | Effect | Entity |
|---------|--------|--------|
| **Siphon Vitality** | 30% chance to lose 1 Strength | Rift Leech |
| **Corrode Armor** | Reduces your armor bonus by 1 | Acid Jelly |
| **Rapid Cell Division** | Heals 1 HP per turn | Titan Polyp |
| **Invisible** | Cannot see unless adjacent or have Phase Detector | Phase Walker, Warp Specter |
| **Disassemble Gear** | Steals a random item from inventory and vanishes | Nanite Swarm |
| **Drain Life Force** | 25% chance to permanently lose 1 Max HP | Void Drinker |
| **Erase Memories** | 20% chance to lose experience points | Warp Specter |

### Dimension Scaling

Entities become stronger the deeper you travel:
- Entities gain **+1 HP per 2 dimensions** beyond their minimum dimension
- Example: A Blink Moth in Dimension 5 has +2 HP (dimensions 1-2 no bonus, 3-4 +1, 5-6 +2)

### Entity Behavior

**Dormant vs Active:**
- Most entities start **dormant** and won't move until you get close
- **Aggressive entities** (marked "mean") start active and hunt you immediately
- Entities activate when you come within 2 tiles

**Movement Patterns:**
- **Normal:** Entities use pathfinding to chase you intelligently
- **Erratic:** Blink Moths and Kinetic Sprites move randomly 50% of the time (phase-shifting/unstable)

---

## Power Reserve (Life Support)

Your suit has a power reserve that starts at **1300**. Every turn (every action you take), it decreases.

### Dimension Scaling

Power drains faster in deeper, more unstable dimensions:
- **Dimensions 1-3:** -1 power per turn (stable reality)
- **Dimensions 4-6:** -2 power per turn (reality distortion)
- **Dimensions 7-10:** -3 power per turn (reality breakdown)

The unstable dimensional fabric makes ration management more critical in the late game!

### Power Stages

| Power Value | Status | Effect |
|-------------|--------|--------|
| 150+ | Normal | None |
| 50-149 | LOW PWR | Warning message |
| 1-49 | CRITICAL | Warning message |
| 0 or less | FAILING | Lose 1 HP per turn |

### Ration Packs

- Ration packs (`:`) appear randomly in zones throughout each dimension (15% chance per zone)
- Consuming a ration pack adds **400 turns** to your power reserve
- Rations also **restore 25% of your max HP**
- Rations are consumed immediately when you pick them up

---

## Items

### Item Types

| Symbol | Item Type | Color |
|--------|-----------|-------|
| `*` | Energy Crystals | Yellow |
| `:` | Ration Pack | Brown |
| `)` | Weapon | Blue |
| `[` | Armor | Blue |
| `!` | Compound | Various |
| `?` | Data Chip | White |
| `=` | Implant | Orange |
| `/` | Device | Lime |
| `U` | Warp Core | Gold |

### Picking Up Items

- Stand on an item and press **P** to pick it up
- **Energy Crystals** are added to your total immediately
- **Ration Packs** are consumed immediately (restores power + 25% HP)
- **The Warp Core** is picked up and you must return to Dimension 1 to escape!
- **Other items** go into your inventory (max 23 items)

### Using Items

Open your inventory with **I** and tap an item to use it:
- **Compounds** are injected/consumed immediately
- **Data Chips** are activated immediately
- **Weapons/Armor** are equipped (old equipment goes to inventory)
- **Implants** are installed (you can have 2 at once)
- **Devices** are aimed at the nearest visible entity

---

## Compounds

Compounds have randomized colors each game. You won't know what a compound does until you use it (or use an Analysis Chip).

| Effect | Description |
|--------|-------------|
| **Med-Gel** | Restores 33% of max HP |
| **Trauma Patch** | Restores 75% of max HP, may increase max HP by 1 |
| **Toxic Compound** | Deals 25% max HP damage, lose 1 Strength |
| **Stim-Shot** | Gain 1 Strength permanently |
| **Purifier** | Restore Strength to your maximum value |
| **Neural Disruptor** | **Confused for 10-19 turns** - 50% chance to move randomly |
| **Optic Scrambler** | **Blind for 50-99 turns** - can only see your own tile |
| **Phase Lens Serum** | **Permanent** - can see phase-shifted entities |
| **Cognition Boost** | Gain one experience level instantly! |
| **Nerve Agent** | **Paralyzed for 2-5 turns** - cannot move or act |

---

## Data Chips

Data chips have randomized code names (like "ABJ CHO") each game.

| Effect | Description |
|--------|-------------|
| **Analysis Chip** | Reveals the true nature of one random unidentified item |
| **Blink Module** | Instantly teleport to a random floor tile |
| **Debug Patch** | Removes malfunctions from all equipped items |
| **Weapon Mod Chip** | Your weapon gains +1 to hit and damage |
| **Armor Mod Chip** | Your armor gains +1 defense |
| **Sedation Chip** | Puts nearby entities into stasis |
| **Fear Emitter** | Entities flee from you briefly |
| **Zone Scanner** | Reveals the entire dimension layout |
| **Signal Flare** | Activates ALL entities in the dimension! |
| **Spawn Beacon** | Spawns a random entity adjacent to you |

---

## Implants

Implants have randomized gem appearances each game. You can install up to 2 implants at once. Some implants are malfunctioning (negative bonus) - use Debug Patch to remove them.

| Effect | Description |
|--------|-------------|
| **Shield Implant** | Adds bonus to your defense |
| **Power Implant** | Adds bonus to your strength |
| **Metabolism Regulator** | Slows power drain |
| **Nano-Repair System** | Slowly regenerate HP over time |
| **Energy Optimizer** | Greatly slows power drain |
| **Sensor Array** | Better chance to find hidden things |
| **Phase Detector** | Can see phase-shifted entities |
| **Cloak Module** | Entities less likely to notice you |
| **Random Blink Implant** | Randomly teleport (usually malfunctioning!) |
| **Reflex Booster** | Bonus to attack accuracy |

---

## Devices

Devices have randomized materials (oak, iron, glass, etc.) each game. Each device has 3-10 charges.

| Effect | Damage/Effect |
|--------|---------------|
| **Plasma Bolt Gun** | 6-12 reliable single-target damage |
| **Arc Caster** | 10 damage, **chains to up to 2 nearby enemies** (60% damage each chain) |
| **Thermal Ray** | 8-16 damage, **highest single-target damage** |
| **Cryo Beam** | 4-8 damage, **freezes the target** (puts in stasis) |
| **Gene Scrambler** | Transforms entity into a random creature |
| **Stasis Field Emitter** | Slows the target entity |
| **Blink Gun** | Teleports entity to random location in the dimension |
| **Nullifier** | Removes entity's special abilities |
| **Life Tap** | Halves the entity's current HP |
| **Flare Launcher** | Illuminates the current zone |

### Device Strategy Tips

- **Thermal Ray** is best for single tough enemies (Void Drinkers, Titan Polyps)
- **Arc Caster** is excellent against groups of enemies
- **Cryo Beam** is great for neutralizing dangerous entities temporarily
- **Blink Gun** can save your life against late-dimension threats
- **Life Tap** is very effective against high-HP entities like Titan Polyps

---

## The Warp Core

The ultimate goal! It appears in **Dimension 10** at the edge of existence.

- Shown as a pulsing golden `U` symbol
- Pick it up with **P**
- Once you have it, navigate back to Dimension 1 and exit to **warp home and win!**

---

## Dimension Generation

Each dimension is randomly generated with:

- **Multiple pocket reality zones** connected by dimensional tunnels
- **Phase gates** (shown as `+`) that you phase through to open
- **Wormholes forward** (`>`) leading to deeper dimensions
- **Wormholes back** (`<`) leading to previous dimensions (except Dimension 1)

### The 10 Dimensions

| Dimension | Name | Theme Color |
|-----------|------|-------------|
| 1 | The Verdant Sprawl | Deep Forest Green |
| 2 | The Crimson Wastes | Blood Red |
| 3 | The Frozen Void | Ice Blue |
| 4 | The Amber Hive | Honey Gold |
| 5 | The Violet Abyss | Deep Purple |
| 6 | The Molten Core | Volcanic Orange |
| 7 | The Silver Static | Chrome Gray |
| 8 | The Coral Depths | Teal Seafoam |
| 9 | The Golden Citadel | Ancient Gold |
| 10 | The White Rift | Pale Platinum |

### Item Spawn Rates

| Item Type | Chance per Zone |
|-----------|-----------------|
| Energy Crystals | 50% |
| Ration Packs | 15% |
| Compounds | 25% |
| Data Chips | 20% |
| Implants | 8% |
| Devices | 10% |
| Entities | 60% (not starting zone) |

### Field of View

- You can see **10 tiles** in all directions (unless affected by Optic Scrambler)
- Reality membranes and phase gates block your vision
- Areas you've explored stay visible (but darker) even when out of sight
- Entities are only visible when in your line of sight
- **Phase-shifted entities** can only be seen when adjacent or if you have Phase Detector

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
| S | Enter wormhole |
| ? | Help screen |

### Keyboard (Desktop)

- **Arrow keys** - 4-directional movement
- **Numpad** - 8-directional movement
- **Vi keys** (hjklyubn) - 8-directional movement
- **i** - Inventory
- **p** or **g** or **,** - Pick up
- **s** or **<** or **>** - Enter wormhole
- **w** or **.** or **space** - Wait
- **?** - Help

### Combat

To attack an entity, simply **move into it**. You'll automatically attack instead of moving.

---

## Status Bar Reference

```
Dim:1 HP:12/12 Str:16 Def:10 Exp:0    Crys:0
```

| Display | Meaning |
|---------|---------|
| Dim | Current dimension |
| HP | Current / Maximum hit points |
| Str | Strength |
| Def | Defense (higher = better) |
| Exp | Experience points |
| Crys | Total energy crystals collected |

Additional status indicators:
- **LOW PWR** - Power reserve below 150
- **CRITICAL** - Power reserve below 50

---

## Tips for Survival

1. **Don't rush** - Take your time to explore each dimension
2. **Watch your power** - Consume ration packs before your suit fails (especially in deep dimensions!)
3. **Identify compounds carefully** - Neural Disruptors, Optic Scramblers, and Nerve Agents can be deadly
4. **Save analysis chips** - Use them on implants and devices
5. **Use dimensional tunnels** - Fight entities in narrow spaces so they can't surround you
6. **Level up** - The full HP restore from leveling is huge
7. **Devices are powerful** - Save Thermal Rays for Void Drinkers and Titan Polyps
8. **Watch for malfunctioning implants** - Random Blink implants are usually malfunctioning
9. **Beware phase-shifted entities** - Phase Walkers and Warp Specters can attack unseen!
10. **Protect your armor** - Acid Jellies can permanently corrode your defense
11. **Carry Purifier compounds** - Rift Leeches can cripple you with vitality drain

---

## Dangerous Entity Strategies

### Rift Leech (Dimension 3+)
- Siphons vitality on hit - can make you very weak
- Keep Purifier compounds handy

### Acid Jelly (Dimension 5+)
- Corrodes your armor permanently
- Try to kill quickly with devices or avoid entirely

### Titan Polyp (Dimension 5+)
- Regenerates HP every turn (rapid cell division)
- Must deal burst damage - use Thermal Ray devices

### Phase Walker (Dimension 6+)
- Phase-shifted (invisible)! Use Phase Lens Serum or be very careful
- Gets free hits if you can't see it

### Nanite Swarm (Dimension 7+)
- Disassembles your gear and vanishes
- Kill quickly before it touches you!

### Void Drinker (Dimension 8+)
- Drains your MAX HP permanently
- Very dangerous - use devices from range

### Warp Specter (Dimension 9+)
- Phase-shifted AND erases memories (drains XP)
- Most dangerous regular entity - avoid if possible

---

## Version History

- **v2.0** - Complete thematic redesign: Interdimensional traveler theme, 10 distinct dimension palettes, alien entity names, sci-fi item names (compounds, data chips, implants, devices), power reserve system
- **v1.1** - Added status effects, 6 new monsters with special abilities, depth scaling, differentiated wand effects, 20% HP increase
- **v1.0** - Initial release
