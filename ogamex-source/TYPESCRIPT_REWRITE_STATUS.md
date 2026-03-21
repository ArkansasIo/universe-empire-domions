# OGameX TypeScript Rewrite Status

This folder is a vendored source reference from OGameX. It has not been fully rewritten to TypeScript.

## Scope Reality

- Total files in `ogamex-source`: about `3005`
- PHP files under `ogamex-source/app`: about `288`
- Framework stack: Laravel + PHP + Blade + Composer + Rust FFI helpers

A full rewrite of every file into TypeScript is a major platform migration, not a single-file refactor.

## TypeScript Port Started

The first rewrite foundation now lives in [`shared/ogamex`](../shared/ogamex):

- `universeConstants.ts`
- `enums.ts`
- `coordinateDistance.ts`
- `services/characterClassService.ts`
- `index.ts`

Bulk migration automation now also exists in [`script/ogamex_mass_rewrite.py`](../script/ogamex_mass_rewrite.py).

These files port the first low-risk shared domain pieces from:

- `app/GameConstants/UniverseConstants.php`
- `app/Enums/FleetMissionStatus.php`
- `app/Enums/FleetSpeedType.php`
- `app/Enums/HighscoreTypeEnum.php`
- `app/Enums/CharacterClass.php`
- `app/Services/CoordinateDistanceCalculator.php`
- `app/Services/CharacterClassService.php`

## Current State

- Bulk-generated TypeScript scaffolds were written to [`generated/ogamex-ts`](../generated/ogamex-ts)
- The live server mission math now reuses `shared/ogamex` instead of duplicating travel-distance logic
- `CharacterClassService` now has a typed adapter-based TypeScript port that can be wired into app services incrementally

## Recommended Rewrite Order

1. Core constants, enums, coordinates, and distance math
2. Shared account and character-class domain services
3. Game object catalogs: buildings, research, ships, defenses
4. Queue/build/research domain logic
5. Fleet missions and battle calculation services
6. Player, planet, alliance, and message services
7. Blade/Laravel UI replacement with React pages and API handlers
8. Admin, scheduler, and background job conversion

## Bulk Script

Run the Python bulk script to generate TypeScript ports and scaffolds in bulk:

```bash
python script/ogamex_mass_rewrite.py --write
python script/ogamex_mass_rewrite.py --write --only Enums GameConstants
python script/ogamex_mass_rewrite.py --write --dest generated/ogamex-ts
```

What it does:

- scans the OGameX PHP tree
- classifies files by migration category
- ports enums and constants directly when safe
- emits TypeScript scaffolds for complex PHP classes
- writes a JSON manifest and Markdown report so the migration can continue in batches

## Important Note

If you want the entire `ogamex-source` tree rewritten into TypeScript, the safest path is to migrate it in slices into the existing React + Node codebase instead of trying to mechanically convert every Laravel file one-to-one.
