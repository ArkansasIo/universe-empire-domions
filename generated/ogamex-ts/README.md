# Generated OGameX TypeScript Output

This folder contains bulk-generated TypeScript files produced by:

- [`script/ogamex_mass_rewrite.py`](../../script/ogamex_mass_rewrite.py)

## What Is In Here

- concrete ports for low-risk enums and constants
- scaffold classes/interfaces for complex PHP files
- a manifest file for batch migration tracking
- a markdown report summarizing rewrite coverage

## Important

Most files in this folder are migration scaffolds, not final hand-reviewed ports.

Use these files as:

- rewrite starters
- symbol inventories
- dependency maps
- migration checkpoints

Prefer the curated handwritten modules in [`shared/ogamex`](../../shared/ogamex) for production-ready shared logic when both versions exist.
