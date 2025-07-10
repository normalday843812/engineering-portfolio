# Pig Follower Datapack

This is just a copy of the README for the [github repository](https://github.com/normalday843812/minecraft-pig-datapack)

A small Minecraft Java-Edition datapack that spawns a flying pig enemy for every player. It uses special attacks to try and kill you whenever possible. A bit overpowered. The only way it can be killed is with an 'angel pig', which can be summoed with a netherite ingot and nether star.

## Features

- A pig automatically appears ~10 blocks above each player when they join/whenever theirs is missing.
- The pig hovers, tracks the player’s Y-level, and slowly moves toward the player.
- Every ~4 seconds it rolls a random ability (19 in total) including:
  - Lightning & charged creepers
  - Explosive grenades/guided fireballs
  - Lasers, poison clouds, frost bombs
  - Water tsunami, lava flood, spinning vortex
  - Piglin & creeper minions, shadow clones, ninja teleport
  - Defensive shield, stomp attack, ground-bore, and more
- Temporary light blocks so night fights remain visible.
- Automatically despawns or hides when the owner is far away to save resources.

## Installation

1. Download/copy the `pig` folder (or zip) into the world’s `datapacks` directory.
2. Reload the world with `/reload` or re-enter the world.

## Commands & Administration

- `/function pig_follow:init`   Hard reset.
- `/tag <player> add disabled`  Temporarily stop the pig from respawning for that player.  
- `/kill @e[tag=pig]`           Manual emergency kill.