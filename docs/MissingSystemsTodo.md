# Missing Systems TODO (Source Audit)

This checklist captures systems that are still stubbed, mocked, or UI-placeholder-only in the current codebase.

## Priority P0 — Core game loop and persistence

- [x] Persist combat history instead of mock response in `server/routes-combat.ts` (`/api/combat/battle-history` now reads from `battles`).
- [x] Implement mining operations persistence currently marked stubbed in `server/storage.ts` (`mining_operations` table auto-created and used).
- [ ] Replace remaining critical `alert(...)` gameplay actions with API-backed mutations for:
  - `client/src/pages/Fleet.tsx` (templates + validation flow)
  - `client/src/pages/Combat.tsx` (error handling UX)
  - `client/src/pages/Colonies.tsx` (colonization action)
  - `client/src/pages/Galaxy.tsx` (scan/message/attack/launch actions)

## Priority P1 — Backend systems marked as stubs

- [ ] Complete research achievement logic in `server/services/achievementService.ts`.
- [ ] Complete custom lab creation and progression in `server/services/customLabService.ts`.
- [ ] Complete multiplayer research bonus logic in `server/services/multiplayerBonusesService.ts`.
- [ ] Replace all trade mocks in `server/services/researchTradingService.ts` with DB-backed flows:
  - listing, details, status updates, cancel/settle, history, rating/reputation,
  - disputes, blocking, bulk accept, eligibility checks, recommendations.
- [ ] Replace asset-management stubs in `server/services/gameAssetsService.ts` with production storage flows:
  - asset CRUD, bundle CRUD, manifest generation/versioning,
  - CDN sync, integrity validation, cache control, rollback, stats/reporting.
- [ ] Replace placeholder DB connection metrics in `server/services/serverStatusService.ts` with real live metrics.

## Priority P1 — Frontend features still placeholder-only

- [ ] Implement alliance diplomacy/chat actions now wired to `alert(...)` in `client/src/pages/Alliance.tsx`.
- [ ] Implement army equipment/deploy workflows in `client/src/pages/Army.tsx`.
- [ ] Implement celestial browser detail/system navigation actions in `client/src/pages/CelestialBrowser.tsx`.
- [ ] Implement exploration anomaly scan and gate capture/jump actions in `client/src/pages/Exploration.tsx`.
- [ ] Implement friend request accept/reject backend actions in `client/src/pages/FriendsList.tsx`.
- [ ] Implement market exchange action in `client/src/pages/Market.tsx`.
- [ ] Implement raid boss challenge action in `client/src/pages/RaidBosses.tsx`.
- [ ] Replace admin panel placeholder actions (`Export CSV`, `View user`) in `client/src/pages/Admin.tsx`.
- [ ] Replace settings admin-tool placeholder actions (`Backup snapshot`, `Reset universe`, `Restart server`) in `client/src/pages/Settings.tsx`.

## Priority P2 — Content/system completeness

- [ ] Replace Galaxy page synthetic data generation with server-side canonical universe data (`client/src/pages/Galaxy.tsx`).
- [ ] Replace static troop roster seed (`MOCK_TROOPS`) with account/fleet-backed unit persistence (`client/src/pages/Army.tsx`).
- [ ] Implement “coming soon” sections:
  - alliance real-time chat (`client/src/pages/Alliance.tsx`)
  - planet defense systems panel (`client/src/pages/PlanetDetail.tsx`)

## Suggested implementation order

1. Combat and mining persistence (P0)
2. Research trading + achievements/custom labs/multiplayer bonuses (P1 backend)
3. Replace gameplay `alert(...)` handlers with API actions (P0/P1 frontend)
4. Asset pipeline and server status hardening (P1)
5. Remaining content completeness tasks (P2)
