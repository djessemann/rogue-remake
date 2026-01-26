# Original Rogue Research

Reference document for mechanics from the original 1980 Rogue game by Michael Toy, Glenn Wichman, and Ken Arnold.

---

## Complete Monster List (All 26 Letters)

The original Rogue used all 26 letters of the alphabet for monsters:

| Letter | Monster | Special Ability | Notes |
|--------|---------|-----------------|-------|
| **A** | Aquator | **Rusts armor** - reduces armor bonus | Doesn't deal HP damage, just destroys your armor |
| **B** | Bat | Erratic movement, Flying | Moves unpredictably, harder to hit |
| **C** | Centaur | None | Mid-tier monster |
| **D** | Dragon | **Fire breath**, high damage | One of the hardest monsters |
| **E** | Emu | None | Weak early monster |
| **F** | Venus Flytrap | **Holds you in place** | Immobile, but traps you until one dies |
| **G** | Griffin | Flying, Regenerates, Mean, **Hasted** | Extremely dangerous - moves twice as fast |
| **H** | Hobgoblin | Mean (always aggressive) | Early threat |
| **I** | Ice Monster | **Freezes you** (can't move) | You're stuck until it's dead |
| **J** | Jabberwock | Multiple attacks | Very high damage |
| **K** | Kestrel | Erratic movement, Flying | Like bat but slightly stronger |
| **L** | Leprechaun | **Steals gold** and teleports away | Annoying but not deadly |
| **M** | Medusa | **Confusing gaze** | Looking at her confuses you |
| **N** | Nymph | **Steals magic items** | Takes a random item and vanishes |
| **O** | Orc | Greedy (guards gold) | Will pick up gold before fighting |
| **P** | Phantom | **Invisible** | Can't see it until adjacent |
| **Q** | Quagga | None | Horse-like creature |
| **R** | Rattlesnake | **Drains strength** on hit | Very dangerous - weakens your attacks |
| **S** | Snake | Mean | Basic aggressive monster |
| **T** | Troll | **Regenerates HP** | Heals over time during combat |
| **U** | Ur-vile | Mean, high damage | One of the toughest |
| **V** | Vampire | **Drains max HP** permanently | The HP you lose is gone forever |
| **W** | Wraith | **Drains experience levels** | Can de-level you! |
| **X** | Xeroc | **Mimics items** | Looks like an item until you step on it |
| **Y** | Yeti | None | Strong but straightforward |
| **Z** | Zombie | Mean | Undead, always aggressive |

### Monster Flags in Original Rogue
- **Mean**: Always awake and aggressive
- **Flying**: Harder to hit, moves faster
- **Regenerating**: Heals HP over time
- **Greedy**: Prioritizes picking up gold
- **Invisible**: Can't be seen until adjacent

---

## Complete Scroll List

| Scroll | Effect | Good/Bad |
|--------|--------|----------|
| **Identify** | Reveals true nature of one item | Good |
| **Magic Mapping** | Shows entire level layout | Good |
| **Enchant Weapon** | +1 to hit and damage on wielded weapon | Good |
| **Enchant Armor** | +1 defense on worn armor | Good |
| **Remove Curse** | Allows removal of cursed items | Good |
| **Protect Armor** | Armor immune to Aquator rust | Good |
| **Vorpalize Weapon** | Weapon becomes super-effective vs one monster type, can instant-kill once | Good (rare) |
| **Hold Monster** | Freezes nearby monsters | Good |
| **Scare Monster** | **Drop it and stand on it** - monsters won't attack you | Good (unique mechanic!) |
| **Teleportation** | Random teleport (can be dangerous) | Mixed |
| **Food Detection** | Shows food on the level | Situational |
| **Gold Detection** | Shows gold on the level | Situational |
| **Create Monster** | Spawns a monster next to you | Bad |
| **Aggravate Monster** | Wakes up ALL monsters on level | Bad |
| **Sleep** | Puts YOU to sleep | Bad |
| **Blank Paper** | Does nothing | Useless |

### Unique Mechanic: Scare Monster Scroll
This is one of the most interesting items in Rogue:
- You **don't read it** - you drop it and stand on it
- While standing on it, no monster will attack you
- When you pick it up, it crumbles
- **Exploit**: If your inventory is full, you can step on/off it repeatedly without it being destroyed!

---

## Complete Potion List

| Potion | Effect | Good/Bad |
|--------|--------|----------|
| **Healing** | Restores some HP | Good |
| **Extra Healing** | Restores lots of HP | Good |
| **Gain Strength** | +1 permanent strength | Good |
| **Restore Strength** | Restores strength to max (after Rattlesnake drain) | Good |
| **Raise Level** | Gain one experience level | Good (very rare) |
| **Haste Self** | Move/attack twice as fast temporarily | Good |
| **See Invisible** | Can see Phantoms | Good |
| **Monster Detection** | Shows all monsters on level | Good |
| **Magic Detection** | Shows all magic items on level | Good |
| **Levitation** | Float over traps | Mixed |
| **Blindness** | Can't see anything | Bad |
| **Confusion** | Move in random directions | Bad |
| **Paralysis** | Can't move for several turns | Bad |
| **Poison** | Lose strength | Bad |
| **Hallucination** | Monsters appear as random letters | Bad |

---

## Complete Ring List

Rings **drain hunger faster** while worn (except Slow Digestion). Some can be cursed (-1 instead of +1).

| Ring | Effect |
|------|--------|
| **Protection** | +1 to +3 defense |
| **Add Strength** | +1 to +3 strength |
| **Dexterity** | +1 to +3 to-hit bonus |
| **Regeneration** | Slowly heal HP over time |
| **Slow Digestion** | Reduces food consumption by 50% |
| **Sustain Strength** | Immune to strength drain |
| **Maintain Armor** | Armor immune to Aquator rust |
| **Stealth** | Monsters less likely to wake up |
| **See Invisible** | Can see Phantoms |
| **Searching** | Auto-search for traps/secrets |
| **Teleportation** | Randomly teleport (usually cursed!) |
| **Aggravate Monster** | Monsters always wake up (cursed) |
| **Adornment** | Does nothing, just looks pretty |

---

## Complete Staff/Wand List

Staves have limited charges (typically 3-10).

| Staff | Effect |
|-------|--------|
| **Light** | Illuminates the room |
| **Striking** | Melee attack that does extra damage |
| **Lightning** | Bolt of lightning, bounces off walls |
| **Fire** | Fire bolt |
| **Cold** | Cold bolt |
| **Magic Missile** | Reliable damage |
| **Polymorph** | Transforms monster into random creature |
| **Slow Monster** | Monster moves at half speed |
| **Haste Monster** | Monster moves twice as fast (bad!) |
| **Teleport Away** | Sends monster to random location |
| **Teleport To** | Pulls monster adjacent to you (bad!) |
| **Cancellation** | **Removes monster's special ability** |
| **Drain Life** | Halves monster's current HP |
| **Nothing** | Does nothing (trick wand) |

### Key Item: Staff of Cancellation
This is crucial for dealing with special monsters:
- Cancels Aquator's rust attack
- Cancels Rattlesnake's strength drain
- Cancels Vampire's HP drain
- Cancels Wraith's level drain
- Makes dangerous monsters into simple damage-dealers

---

## Weapons in Original Rogue

| Weapon | Damage | Notes |
|--------|--------|-------|
| Mace | 2d4 | Starting weapon |
| Long Sword | 3d4 | Good upgrade |
| Two-Handed Sword | 4d4 | Best melee weapon |
| Spear | 2d3 | Can be thrown |
| Dagger | 1d6 | Weak but common |
| Short Bow + Arrows | 1d1 | Ranged attacks |

Weapons have two bonuses: **+hit,+damage** (e.g., "+1,+2 mace")

---

## Armor in Original Rogue

| Armor | Base AC | Notes |
|-------|---------|-------|
| Leather | 8 | Weak but Aquator-proof |
| Ring Mail | 7 | Starting armor |
| Studded Leather | 7 | |
| Scale Mail | 6 | |
| Chain Mail | 5 | |
| Splint Mail | 4 | |
| Banded Mail | 4 | |
| Plate Mail | 3 | Best armor |

**Note**: In original Rogue, **lower AC is better** (D&D style). We use higher = better.

---

## Key Mechanics from Original

### 1. Traps
Original Rogue had hidden traps:
- **Trap Door**: Fall to next level
- **Bear Trap**: Stuck for several turns
- **Sleep Gas**: Fall asleep
- **Arrow Trap**: Take damage
- **Teleport Trap**: Random teleport
- **Dart Trap**: Poison dart, lose strength

### 2. Wandering Monsters
- If you stay on a level too long, new monsters spawn and hunt you
- Creates pressure to keep moving

### 3. Throwing Items
- Weapons can be thrown for ranged damage
- Potions can be thrown at monsters (blind them, confuse them, etc.)

### 4. The Amulet Changes Everything
- Once you pick up the Amulet, you can't go deeper
- Stairs down become stairs up
- Must ascend back through all 26 levels
- Creates a tense "escape" phase

### 5. Dungeon Layout
- 3x3 grid of potential rooms per level
- Some "rooms" are just maze sections or dead ends
- Deeper levels have more mazes

### 6. Combat Formula
```
to_hit_threshold = (21 - character_level) - opponent_armor_class
hit if: roll("1d20") + weapon_hit_bonus + str_bonus >= to_hit_threshold
```

---

## Priority Implementation List

Based on research, these features would make the game feel most like original Rogue:

1. **Implement missing status effects** (confusion, blindness, paralysis)
2. **Add depth scaling to monsters** - makes late game challenging
3. **Differentiate wand effects** - more interesting choices
4. **Add 5-6 more monsters** for deeper levels
5. **Rebalance hunger** - creates more tension
6. **Add invisible monsters** - makes See Invisible useful

---

## Sources

- [Wikipedia - Rogue](https://en.wikipedia.org/wiki/Rogue_(video_game))
- [StrategyWiki - Rogue Monsters](https://strategywiki.org/wiki/Rogue/Monsters)
- [StrategyWiki - Rogue Items](https://strategywiki.org/wiki/Rogue/Items)
- [The Rogue's Vade-Mecum](https://userpages.monmouth.com/~colonel/rvm.html)
- [Rogue Archive - Epyx Manual](https://britzl.github.io/roguearchive/)
- [rec.games.roguelike.rogue discussions](https://groups.google.com/g/rec.games.roguelike.rogue)
