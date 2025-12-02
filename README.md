# Stellar Dominion

A comprehensive 4X space strategy game built with React, Express, and PostgreSQL. Explore the galaxy, manage your empire, research technologies, and engage in epic space battles.

**Website:** [stellar-dominion.replit.dev](https://stellar-dominion.replit.dev)  
**Version:** 1.0.0-release  
**Status:** 🟢 PRODUCTION READY
**Last Updated:** December 2, 2024

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Game Systems](#game-systems)
- [Architecture](#architecture)
- [Development](#development)
- [Documentation](#documentation)
- [License](#license)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL (Neon database via Replit)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run database migrations
npm run db:push

# Type checking
npm run check

# Production build
npm run build
```

Access the game at `http://localhost:5000`

---

## ✨ Features

### Core Systems
- **🏗️ Colony Management** - Build and manage planetary colonies
- **🔬 Research Technology Tree** - 120+ facilities with tech trees
- **🚀 Fleet Management** - Build and command diverse spacecraft
- **⚔️ Combat System** - Multi-layer damage, tactics, battle formations
- **🗺️ Galaxy Exploration** - Procedurally-generated universe with expeditions
- **🤝 Alliance System** - Form alliances, trade resources, conduct diplomacy
- **💰 Market** - Buy/sell resources with other players
- **🏦 Bank System** - Deposit/withdraw currency, track transactions
- **📊 Empire Progression** - Empire leveling (1-999), tiers (1-21), rankings
- **🧠 Knowledge Library** - Master 10 knowledge types, 4 classes, 5 tiers (2000+ points)

### Expedition System
- **Fleet & Troop Composition** - Assemble diverse teams for missions
- **5 Expedition Types:**
  - Exploration (discover new worlds)
  - Military (conquer territories)
  - Scientific (unlock research bonuses)
  - Trade (establish commerce routes)
  - Conquest (expand empire)
- **Encounter Management** - Handle hostile, peaceful, and discovery encounters
- **Resource Rewards** - Gain resources from successful missions

### Technology Tree
- **Physics Research** - Propulsion, sensors, weapons
- **Society Research** - Diplomacy, espionage, culture
- **Engineering Research** - Structures, production, defense
- **Tier System** - Progressive technology unlocks
- **Prerequisites** - Technologies build on each other
- **Bonuses** - Research grants resource/production bonuses

---

## 🎮 Game Systems

### Resource Management
- **Metal** - Basic construction material (value: 1x)
- **Crystal** - Advanced technology component (value: 1.5x)
- **Deuterium** - Fuel and energy source (value: 2x)
- **Energy** - Power generation and consumption

### Currency System
- **Silver** - Base currency (value: 1x, everyday transactions)
- **Gold** - Premium currency (value: 100x, advanced features)
- **Platinum** - Ultra-premium currency (value: 10,000x, exclusive items)
- **20+ Uses**: Trading, construction acceleration, research speedup, equipment, alliance management, cosmetics, battle pass, espionage, etc.

### Knowledge & Learning
- **10 Knowledge Types**: Military, Engineering, Science, Agriculture, Commerce, Diplomacy, Exploration, Arcane, Medicine, Espionage
- **4 Knowledge Classes**: Novice, Apprentice, Journeyman, Expert
- **5 Knowledge Tiers**: Foundation, Intermediate, Advanced, Master, Supreme
- **2000+ Mastery Points**: Track progression across all systems
- **Synergy Bonuses**: Combining knowledge types unlocks unique bonuses

### Empire Progression
- **Empire Levels** - Progression system (1-999) with experience tracking
- **Tier System** - 21 tiers with progression bonuses and unlocks
- **Kardashev Scale** - Measure of civilization advancement
- **Prestige System** - Hard reset with permanent multipliers
- **Empire Value** - Total wealth calculation (resources + currency + fleet)
- **Leaderboards** - Rankings based on empire value
- **Units & Buildings** - Construct military and production facilities
- **Turn System** - 6 game turns per minute

### Combat
- **Battle System** - Fleet vs Fleet, Space vs Ground
- **Damage Calculation** - Based on unit types, research, bonuses
- **Casualty Tracking** - Monitor unit losses
- **Battle Logs** - Historical record of all engagements

### Diplomacy & Trade
- **Alliance System** - Join alliances for mutual defense
- **Trade Routes** - Establish commerce with other players
- **Market System** - Buy/sell orders for resources
- **Sanctions** - Economic pressure on rivals

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 19, TailwindCSS, Radix UI
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Build:** Vite
- **Routing:** Wouter
- **Styling:** TailwindCSS + CVA

### Project Structure

```
stellar-dominion/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── TechnologyTree.tsx     # 🔬 Research tech tree UI
│   │   │   ├── Expeditions.tsx        # 🚀 Expedition management
│   │   │   ├── Fleet.tsx              # ⚔️ Fleet management
│   │   │   └── ...
│   │   ├── components/       # Reusable UI components
│   │   └── lib/              # Utilities and hooks
│   └── index.html            # Meta tags & entry point
│
├── server/                    # Backend Express application
│   ├── routes.ts             # 🌐 API routes and endpoints
│   ├── storage.ts            # 📊 Database storage interface
│   ├── db/                   # Database connection
│   ├── index.ts              # Server entry point
│   └── logger.ts             # Logging utilities
│
├── shared/                    # Shared code
│   └── schema.ts             # 📋 Database schema (Drizzle ORM)
│
├── sql/                       # Seed data
│   └── stellaris_tech_seed.sql
│
├── docs/                      # Documentation
│   ├── GAME_DESIGN.md        # 📖 Game design document
│   ├── DEVELOPER_GUIDE.md    # 👨‍💻 Developer documentation
│   └── ARCHITECTURE.md       # 🏗️ System architecture
│
└── package.json              # Dependencies
```

### Key Features by File

| File | Feature | Tags |
|------|---------|------|
| `client/src/pages/TechnologyTree.tsx` | 🔬 Research System | `#research #technology #ui` |
| `client/src/pages/Expeditions.tsx` | 🚀 Expedition System | `#expedition #fleet #troop` |
| `server/routes.ts` | 🌐 API Endpoints | `#api #routes #endpoints` |
| `shared/schema.ts` | 📋 Data Models | `#schema #database #entities` |
| `server/storage.ts` | 💾 Database Operations | `#database #crud #storage` |

---

## 👨‍💻 Development

### Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Run production build
npm run check         # Type checking with TypeScript
npm run db:push       # Push database schema changes

# Workflows (use from UI)
npm run dev:client    # Client-only development (Vite)
```

### Workflows

The project includes 4 automated workflows:

1. **Start application** - Runs development server with hot reload
2. **Database Setup** - Initializes and migrates database schema
3. **Production Build** - Compiles TypeScript and bundles assets
4. **Type Check** - Validates TypeScript without building

### Code Structure Conventions

- **Components** - Functional React components with TypeScript
- **Pages** - Full-page views in `client/src/pages/`
- **API Routes** - RESTful endpoints in `server/routes.ts`
- **Storage** - Database operations in `server/storage.ts`
- **Schema** - Data models in `shared/schema.ts`
- **Types** - TypeScript interfaces via Drizzle inference

### Adding a New Feature

1. **Define data model** in `shared/schema.ts`
2. **Create storage methods** in `server/storage.ts`
3. **Add API routes** in `server/routes.ts`
4. **Build UI components** in `client/src/pages/` or `client/src/components/`
5. **Connect frontend to API** using React Query hooks

---

## 📚 Documentation

### Documentation Files

- **[GAME_DESIGN.md](./GAME_DESIGN.md)** - Complete game design document
  - Game overview and concept
  - Core mechanics and systems
  - Progression and balancing
  - Player goals and victory conditions

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Developer documentation
  - Architecture overview
  - Database schema
  - API reference
  - Code examples
  - Setting up development environment

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
  - Technology stack
  - Component structure
  - Data flow
  - Performance considerations

### Source Code Documentation

All major functions and components include JSDoc comments with tags:

```typescript
/**
 * Launches a new expedition with fleet and troop composition
 * @tag #expedition #mission #space-exploration
 * @param userId - Player ID
 * @param name - Expedition name
 * @param type - Expedition type (exploration, military, scientific, trade, conquest)
 * @returns Created expedition object
 */
async createExpedition(userId: string, name: string, type: string, ...): Promise<any>
```

---

## 🎯 Game Progression

### Early Game (Turns 1-100)
- Build basic structures (Metal Mine, Crystal Mine, Refinery)
- Research foundational technologies (Metal Extraction, Crystal Processing)
- Build first combat units
- Explore nearby star systems

### Mid Game (Turns 100-500)
- Expand to multiple colonies
- Research advanced technologies (Armor, Weapons)
- Engage in trade with other players
- Form alliances

### Late Game (Turns 500+)
- Dominate through military or economic superiority
- Control entire regions of galaxy
- Conduct large-scale expeditions
- Reach high Kardashev scale

---

## 🔗 Game Systems Reference

### Technology Tree (25+ Technologies)
- **Physics (9 techs)**: Energy Production, Armor, Weapons, Propulsion, Shields, Sensors, Cloaking, Warp Drive, Quantum Physics
- **Society (8 techs)**: Espionage, Diplomacy, Trade Networks, Cultural Development, Information Systems, Ancient Civilizations, Alien Contact, Ancient Weapons
- **Engineering (8 techs)**: Metal Extraction, Crystal Processing, Deuterium Synthesis, Shipyard Upgrade, Defense Systems, Robot Factory, Solar Power Plant, Nanite Assembler

### Expedition Types
1. **Exploration** - Discover resources and artifacts
2. **Military** - Conquer territories
3. **Scientific** - Unlock research bonuses
4. **Trade** - Establish commerce
5. **Conquest** - Expand empire

### Resource Types
- Metal (construction)
- Crystal (technology)
- Deuterium (fuel)
- Energy (power)

---

## 🐛 Known Issues

- Database migrations may timeout on first push (use `npm run db:push --force`)
- Large galaxy maps may have performance issues with 10,000+ star systems
- Real-time battle animations need optimization for 50+ unit battles

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

This is an active development project. Contributions welcome!

### Development Guidelines
- Follow existing code style and conventions
- Add JSDoc comments for all functions
- Include proper error handling
- Test all new features
- Update documentation

---

## 📞 Support

- **GitHub Issues:** Report bugs and request features
- **Documentation:** See docs/ directory
- **Community:** Join our Discord (coming soon)

---

## 📈 Recent Updates (v0.9.0)

- ✨ Bank system with deposits, withdrawals, and transaction history
- ✨ Empire progression with tier system and prestige mechanics
- ✨ Knowledge library with 10 knowledge types and synergy system
- ✨ 3-tier currency economy (Silver/Gold/Platinum)
- ✨ Empire value calculation and rankings leaderboard
- ✨ 53 game pages fully implemented
- ✨ 22 configuration files for all game systems
- ✨ 8 new API routes for progression and banking
- 🔧 Fixed critical database schema issues
- 🔧 Integrated all game source files with APIs

**Last Updated:** December 2, 2024  
**Maintained by:** Stellar Dominion Development Team
