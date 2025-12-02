import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,
  serial
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique(),
  passwordHash: varchar("password_hash"),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Player game state - stores all player progression
export const playerStates = pgTable("player_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Setup tracking
  setupComplete: boolean("setup_complete").notNull().default(false),
  
  // Planet Info
  planetName: varchar("planet_name").notNull().default("New Colony"),
  coordinates: varchar("coordinates").notNull().default("[1:1:1]"),
  
  // Resources (stored as JSON for flexibility)
  resources: jsonb("resources").notNull().default({ metal: 1000, crystal: 500, deuterium: 0, energy: 0 }),
  
  // Buildings (JSON object with building levels)
  buildings: jsonb("buildings").notNull().default({ roboticsFactory: 0, shipyard: 0, researchLab: 0 }),
  orbitalBuildings: jsonb("orbital_buildings").notNull().default({}),
  
  // Research (JSON object with tech levels)
  research: jsonb("research").notNull().default({}),
  
  // Units/Fleet (JSON object with unit counts)
  units: jsonb("units").notNull().default({}),
  
  // Commander data
  commander: jsonb("commander").notNull(),
  
  // Government data
  government: jsonb("government").notNull(),
  
  // Artifacts
  artifacts: jsonb("artifacts").notNull().default([]),
  
  // Cron jobs
  cronJobs: jsonb("cron_jobs").notNull().default([]),
  
  // Empire progression
  empireLevel: integer("empire_level").notNull().default(1),
  kardashevProgress: jsonb("kardashev_progress").notNull().default({ metal: 0, crystal: 0, deuterium: 0, research: 0 }),
  
  // Turn system (3-5 turns per minute)
  totalTurns: integer("total_turns").notNull().default(0),
  currentTurns: integer("current_turns").notNull().default(0),
  lastTurnUpdate: timestamp("last_turn_update").defaultNow(),
  
  // Last resource update timestamp
  lastResourceUpdate: timestamp("last_resource_update").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlayerStateSchema = createInsertSchema(playerStates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPlayerState = z.infer<typeof insertPlayerStateSchema>;
export type PlayerState = typeof playerStates.$inferSelect;

// Army Troops System - individual troops/units with full stats
export const troops = pgTable("troops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Identity
  name: varchar("name").notNull(),
  troopType: varchar("troop_type").notNull(), // "infantry", "cavalry", "mage", "archer", "support", "siege"
  troopClass: varchar("troop_class").notNull(), // "warrior", "knight", "berserker", "paladin", "ranger", etc.
  
  // Hierarchy
  rank: varchar("rank").notNull().default("recruit"), // "recruit", "soldier", "veteran", "elite", "commander", "general"
  title: varchar("title"), // "Blade Master", "Dragon Slayer", etc.
  
  // Primary Stats
  health: integer("health").notNull().default(100),
  maxHealth: integer("max_health").notNull().default(100),
  attack: integer("attack").notNull().default(10),
  defense: integer("defense").notNull().default(5),
  speed: integer("speed").notNull().default(8),
  morale: integer("morale").notNull().default(100),
  
  // Sub Stats (JSON for flexibility)
  substats: jsonb("substats").notNull().default({
    critChance: 5,
    critDamage: 50,
    armor: 0,
    magicResist: 0,
    accuracy: 90,
    evasion: 10,
    regeneration: 0,
    lifesteal: 0,
    experience: 0,
    level: 1
  }),
  
  // Combat properties
  weaponType: varchar("weapon_type"), // "sword", "spear", "bow", "staff", "hammer"
  armorType: varchar("armor_type"), // "cloth", "leather", "mail", "plate", "mithril"
  specialAbility: varchar("special_ability"), // Special ability name
  
  // Squad assignment
  squadId: varchar("squad_id"), // Reference to squad grouping
  position: varchar("position"), // "front", "middle", "back"
  
  // Status
  status: varchar("status").notNull().default("active"), // "active", "wounded", "resting", "dead", "captured"
  combatReady: boolean("combat_ready").default(true),
  
  // Metadata
  loyaltyPercent: integer("loyalty_percent").default(100),
  experiencePoints: integer("experience_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Troop = typeof troops.$inferSelect;
export const insertTroopSchema = createInsertSchema(troops).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTroop = z.infer<typeof insertTroopSchema>;

// Army Squads - groups of troops
export const squads = pgTable("squads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  name: varchar("name").notNull(),
  squadType: varchar("squad_type").notNull(), // "strike", "defense", "balanced", "elite"
  commanderId: varchar("commander_id").references(() => troops.id),
  
  morale: integer("morale").default(100),
  combatExperience: integer("combat_experience").default(0),
  victoriesCount: integer("victories_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type Squad = typeof squads.$inferSelect;
export const insertSquadSchema = createInsertSchema(squads).omit({ id: true, createdAt: true });
export type InsertSquad = z.infer<typeof insertSquadSchema>;

// Active missions (fleet movements, attacks, espionage, etc.)
export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type").notNull(), // "attack", "transport", "espionage", "sabotage", "colonize"
  status: varchar("status").notNull().default("outbound"), // "outbound", "return", "completed"
  target: varchar("target").notNull(),
  origin: varchar("origin").notNull(),
  
  units: jsonb("units").notNull(), // Fleet composition
  cargo: jsonb("cargo"), // Resources being transported
  
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  returnTime: timestamp("return_time"),
  
  processed: boolean("processed").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMissionSchema = createInsertSchema(missions).omit({ id: true, createdAt: true });
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;

// Messages (player communications, battle reports, espionage reports)
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  fromUserId: varchar("from_user_id").references(() => users.id, { onDelete: "cascade" }),
  toUserId: varchar("to_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  from: varchar("from").notNull(), // Display name
  to: varchar("to").notNull(), // Display name
  subject: varchar("subject").notNull(),
  body: text("body").notNull(),
  
  type: varchar("type").notNull().default("player"), // "player", "combat", "espionage", "system"
  read: boolean("read").default(false),
  
  battleReport: jsonb("battle_report"),
  espionageReport: jsonb("espionage_report"),
  
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Alliances
export const alliances = pgTable("alliances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  tag: varchar("tag", { length: 10 }).notNull().unique(),
  description: text("description").notNull().default("A new alliance rises."),
  announcement: text("announcement").default("Welcome to the alliance."),
  
  resources: jsonb("resources").notNull().default({ metal: 0, crystal: 0, deuterium: 0 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAllianceSchema = createInsertSchema(alliances).omit({ id: true, createdAt: true });
export type InsertAlliance = z.infer<typeof insertAllianceSchema>;
export type Alliance = typeof alliances.$inferSelect;

// Alliance members
export const allianceMembers = pgTable("alliance_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  allianceId: varchar("alliance_id").notNull().references(() => alliances.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  rank: varchar("rank").notNull().default("recruit"), // "leader", "officer", "member", "recruit"
  points: integer("points").notNull().default(0),
  
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertAllianceMemberSchema = createInsertSchema(allianceMembers).omit({ id: true, joinedAt: true });
export type InsertAllianceMember = z.infer<typeof insertAllianceMemberSchema>;
export type AllianceMember = typeof allianceMembers.$inferSelect;

// Market orders
export const marketOrders = pgTable("market_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type").notNull(), // "buy" or "sell"
  resource: varchar("resource").notNull(), // "metal", "crystal", "deuterium"
  amount: integer("amount").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
  
  status: varchar("status").notNull().default("active"), // "active", "completed", "cancelled"
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertMarketOrderSchema = createInsertSchema(marketOrders).omit({ id: true, createdAt: true, completedAt: true });
export type InsertMarketOrder = z.infer<typeof insertMarketOrderSchema>;
export type MarketOrder = typeof marketOrders.$inferSelect;

// Auction House - Player-to-Player Trading
export const auctionListings = pgTable("auction_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sellerName: varchar("seller_name").notNull(),
  
  // Item details
  itemType: varchar("item_type").notNull(), // "equipment", "material", "resource", "blueprint", "artifact"
  itemId: varchar("item_id").notNull(),
  itemName: varchar("item_name").notNull(),
  itemDescription: text("item_description"),
  itemRarity: varchar("item_rarity").default("common"), // "common", "uncommon", "rare", "epic", "legendary"
  itemData: jsonb("item_data"), // Additional item properties (stats, modifiers, etc.)
  quantity: integer("quantity").notNull().default(1),
  
  // Pricing
  startingPrice: integer("starting_price").notNull(), // In credits/metal
  buyoutPrice: integer("buyout_price"), // Optional instant buy price
  currentBid: integer("current_bid").default(0),
  bidIncrement: integer("bid_increment").notNull().default(10), // Minimum bid increase
  
  // Bidder info
  currentBidderId: varchar("current_bidder_id").references(() => users.id, { onDelete: "set null" }),
  currentBidderName: varchar("current_bidder_name"),
  bidCount: integer("bid_count").notNull().default(0),
  
  // Timing
  duration: integer("duration").notNull().default(24), // Hours
  expiresAt: timestamp("expires_at").notNull(),
  
  // Status
  status: varchar("status").notNull().default("active"), // "active", "sold", "expired", "cancelled"
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertAuctionListingSchema = createInsertSchema(auctionListings).omit({ 
  id: true, 
  currentBid: true, 
  currentBidderId: true, 
  currentBidderName: true, 
  bidCount: true, 
  status: true, 
  createdAt: true, 
  completedAt: true 
});
export type InsertAuctionListing = z.infer<typeof insertAuctionListingSchema>;
export type AuctionListing = typeof auctionListings.$inferSelect;

// Auction bid history
export const auctionBids = pgTable("auction_bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auctionId: varchar("auction_id").notNull().references(() => auctionListings.id, { onDelete: "cascade" }),
  bidderId: varchar("bidder_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bidderName: varchar("bidder_name").notNull(),
  
  bidAmount: integer("bid_amount").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuctionBidSchema = createInsertSchema(auctionBids).omit({ id: true, createdAt: true });
export type InsertAuctionBid = z.infer<typeof insertAuctionBidSchema>;
export type AuctionBid = typeof auctionBids.$inferSelect;

// Player-to-Player Trade Offers (Mail Integrated)
export const tradeOffers = pgTable("trade_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Participants
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  senderName: varchar("sender_name").notNull(),
  receiverId: varchar("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverName: varchar("receiver_name").notNull(),
  
  // What sender offers
  offerMetal: integer("offer_metal").notNull().default(0),
  offerCrystal: integer("offer_crystal").notNull().default(0),
  offerDeuterium: integer("offer_deuterium").notNull().default(0),
  offerItems: jsonb("offer_items").default([]), // Array of item objects
  
  // What sender requests
  requestMetal: integer("request_metal").notNull().default(0),
  requestCrystal: integer("request_crystal").notNull().default(0),
  requestDeuterium: integer("request_deuterium").notNull().default(0),
  requestItems: jsonb("request_items").default([]), // Array of item objects
  
  // Message
  message: text("message"),
  
  // Status
  status: varchar("status").notNull().default("pending"), // "pending", "accepted", "declined", "cancelled", "expired", "countered"
  
  // Associated message IDs for mail integration
  senderMessageId: varchar("sender_message_id"),
  receiverMessageId: varchar("receiver_message_id"),
  
  // Counter offer reference
  counterOfferId: varchar("counter_offer_id"),
  originalOfferId: varchar("original_offer_id"),
  
  // Expiration
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTradeOfferSchema = createInsertSchema(tradeOffers).omit({ 
  id: true, 
  status: true, 
  senderMessageId: true,
  receiverMessageId: true,
  createdAt: true, 
  updatedAt: true, 
  completedAt: true 
});
export type InsertTradeOffer = z.infer<typeof insertTradeOfferSchema>;
export type TradeOffer = typeof tradeOffers.$inferSelect;

// Trade history log
export const tradeHistory = pgTable("trade_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tradeOfferId: varchar("trade_offer_id").notNull(),
  
  // Participants
  senderId: varchar("sender_id").notNull(),
  senderName: varchar("sender_name").notNull(),
  receiverId: varchar("receiver_id").notNull(),
  receiverName: varchar("receiver_name").notNull(),
  
  // What was traded
  senderGave: jsonb("sender_gave").notNull(), // { metal, crystal, deuterium, items }
  receiverGave: jsonb("receiver_gave").notNull(),
  
  // Result
  result: varchar("result").notNull(), // "completed", "cancelled", "expired"
  
  completedAt: timestamp("completed_at").defaultNow(),
});

export type TradeHistory = typeof tradeHistory.$inferSelect;

// Construction/Research Queue
export const queueItems = pgTable("queue_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type").notNull(), // "building", "research", "unit"
  itemId: varchar("item_id").notNull(), // ID of the building/tech/unit
  itemName: varchar("item_name").notNull(),
  amount: integer("amount"), // For units
  
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQueueItemSchema = createInsertSchema(queueItems).omit({ id: true, createdAt: true });
export type InsertQueueItem = z.infer<typeof insertQueueItemSchema>;
export type QueueItem = typeof queueItems.$inferSelect;

// Battle/Combat records
export const battles = pgTable("battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  attackerId: varchar("attacker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  defenderId: varchar("defender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type").notNull(), // "raid", "attack", "spy", "sabotage"
  status: varchar("status").notNull().default("completed"), // "pending", "completed", "failed"
  
  attackerCoordinates: varchar("attacker_coordinates").notNull(),
  defenderCoordinates: varchar("defender_coordinates").notNull(),
  
  winner: varchar("winner"), // "attacker", "defender", "draw", "spy_success", "spy_failed"
  
  attackerFleet: jsonb("attacker_fleet").notNull(),
  defenderFleet: jsonb("defender_fleet").notNull(),
  
  attackerLosses: jsonb("attacker_losses"), // { unitId: count }
  defenderLosses: jsonb("defender_losses"),
  
  loot: jsonb("loot"), // { metal, crystal, deuterium }
  debris: jsonb("debris"), // { metal, crystal }
  
  rounds: integer("rounds").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertBattleSchema = createInsertSchema(battles).omit({ id: true, createdAt: true, completedAt: true });
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Battle = typeof battles.$inferSelect;

// Battle logs
export const battleLogs = pgTable("battle_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  battleId: varchar("battle_id").notNull().references(() => battles.id, { onDelete: "cascade" }),
  
  round: integer("round").notNull(),
  
  attackerDamageDealt: integer("attacker_damage_dealt").default(0),
  defenderDamageDealt: integer("defender_damage_dealt").default(0),
  
  unitsDestroyed: jsonb("units_destroyed"),
  
  log: text("log"),
  
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertBattleLogSchema = createInsertSchema(battleLogs).omit({ id: true, timestamp: true });
export type InsertBattleLog = z.infer<typeof insertBattleLogSchema>;
export type BattleLog = typeof battleLogs.$inferSelect;

// Durability System
export const equipmentDurability = pgTable("equipment_durability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  equipmentId: varchar("equipment_id").notNull(),
  equipmentType: varchar("equipment_type").notNull(),
  currentDurability: real("current_durability").notNull().default(100),
  maxDurability: real("max_durability").notNull().default(100),
  durabilityPercent: integer("durability_percent").default(100),
  degradationRate: real("degradation_rate").default(0.5),
  isBroken: boolean("is_broken").default(false),
  repairCostGold: real("repair_cost_gold").default(0),
  repairCostPlatinum: real("repair_cost_platinum").default(0),
  repairCostResources: jsonb("repair_cost_resources"),
  lastRepairedAt: timestamp("last_repaired_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type EquipmentDurability = typeof equipmentDurability.$inferSelect;

export const fleetDurability = pgTable("fleet_durability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fleetId: varchar("fleet_id").notNull(),
  shipType: varchar("ship_type").notNull(),
  shipCount: integer("ship_count").notNull(),
  currentDurability: real("current_durability").notNull().default(100),
  maxDurability: real("max_durability").notNull().default(100),
  durabilityPercent: integer("durability_percent").default(100),
  healthStatus: varchar("health_status").default("optimal"),
  battleDamage: real("battle_damage").default(0),
  lastRepairedAt: timestamp("last_repaired_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type FleetDurability = typeof fleetDurability.$inferSelect;

export const buildingDurability = pgTable("building_durability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  buildingId: varchar("building_id").notNull(),
  buildingType: varchar("building_type").notNull(),
  buildingLevel: integer("building_level").notNull(),
  currentDurability: real("current_durability").notNull().default(100),
  maxDurability: real("max_durability").notNull().default(100),
  durabilityPercent: integer("durability_percent").default(100),
  structuralIntegrity: varchar("structural_integrity").default("intact"),
  damageFromAttack: real("damage_from_attack").default(0),
  lastRepairedAt: timestamp("last_repaired_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BuildingDurability = typeof buildingDurability.$inferSelect;

export const repairHistory = pgTable("repair_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  itemType: varchar("item_type").notNull(),
  itemId: varchar("item_id").notNull(),
  durabilityBefore: real("durability_before").notNull(),
  durabilityAfter: real("durability_after").notNull(),
  repairCostGold: real("repair_cost_gold").default(0),
  repairCostPlatinum: real("repair_cost_platinum").default(0),
  repairType: varchar("repair_type").notNull(),
  repairedAt: timestamp("repaired_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type RepairHistory = typeof repairHistory.$inferSelect;

export const durabilityDegradationLog = pgTable("durability_degradation_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  itemType: varchar("item_type").notNull(),
  itemId: varchar("item_id").notNull(),
  degradationAmount: real("degradation_amount").notNull(),
  degradationSource: varchar("degradation_source").notNull(),
  durabilityBefore: real("durability_before").notNull(),
  durabilityAfter: real("durability_after").notNull(),
  loggedAt: timestamp("logged_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DurabilityDegradationLog = typeof durabilityDegradationLog.$inferSelect;

// Research areas and technologies
export const researchAreas = pgTable("research_areas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  areaName: varchar("area_name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ResearchArea = typeof researchAreas.$inferSelect;

export const researchSubcategories = pgTable("research_subcategories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  areaId: varchar("area_id").notNull().references(() => researchAreas.id),
  subcategoryName: varchar("subcategory_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ResearchSubcategory = typeof researchSubcategories.$inferSelect;

export const researchTechnologies = pgTable("research_technologies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subcategoryId: varchar("subcategory_id").notNull().references(() => researchSubcategories.id),
  techName: varchar("tech_name").notNull(),
  description: text("description"),
  requirements: jsonb("requirements"),
  effects: jsonb("effects"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ResearchTechnology = typeof researchTechnologies.$inferSelect;

export const playerResearchProgress = pgTable("player_research_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  technologyId: varchar("technology_id").notNull().references(() => researchTechnologies.id),
  status: varchar("status").notNull().default("available"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PlayerResearchProgress = typeof playerResearchProgress.$inferSelect;

// Expeditions
export const expeditions = pgTable("expeditions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  targetCoords: varchar("target_coords").notNull(),
  status: varchar("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Expedition = typeof expeditions.$inferSelect;

export const expeditionTeams = pgTable("expedition_teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expeditionId: varchar("expedition_id").notNull().references(() => expeditions.id),
  unitId: varchar("unit_id").notNull(),
  role: varchar("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExpeditionTeam = typeof expeditionTeams.$inferSelect;

export const expeditionEncounters = pgTable("expedition_encounters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expeditionId: varchar("expedition_id").notNull().references(() => expeditions.id),
  encounterType: varchar("encounter_type").notNull(),
  description: text("description"),
  rewards: jsonb("rewards"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExpeditionEncounter = typeof expeditionEncounters.$inferSelect;

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role").notNull().default("moderator"),
  permissions: jsonb("permissions").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;

// Geography/Worldbuilding tables
export const continents = pgTable("continents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  continentName: varchar("continent_name").notNull(),
  areaSqkm: real("area_sqkm"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Continent = typeof continents.$inferSelect;

export const countries = pgTable("countries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  continentId: varchar("continent_id").notNull().references(() => continents.id, { onDelete: "cascade" }),
  countryName: varchar("country_name").notNull(),
  countryType: varchar("country_type").notNull(),
  ownerPlayerId: varchar("owner_player_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Country = typeof countries.$inferSelect;

export const territories = pgTable("territories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  countryId: varchar("country_id").notNull().references(() => countries.id, { onDelete: "cascade" }),
  territoryName: varchar("territory_name").notNull(),
  territoryType: varchar("territory_type").notNull(),
  areaSqkm: real("area_sqkm"),
  controlledByPlayerId: varchar("controlled_by_player_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Territory = typeof territories.$inferSelect;

export const resourceFields = pgTable("resource_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  territoryId: varchar("territory_id").notNull().references(() => territories.id, { onDelete: "cascade" }),
  fieldName: varchar("field_name").notNull(),
  fieldType: varchar("field_type").notNull(),
  fieldSize: varchar("field_size").notNull(),
  metalPerHour: real("metal_per_hour").default(0),
  crystalPerHour: real("crystal_per_hour").default(0),
  deuteriumPerHour: real("deuterium_per_hour").default(0),
  maxExtractionCapacity: integer("max_extraction_capacity").default(100),
  depletionPercent: integer("depletion_percent").default(0),
  isDepleted: boolean("is_depleted").default(false),
  minedByPlayerId: varchar("mined_by_player_id").references(() => users.id, { onDelete: "set null" }),
  totalMetalExtracted: real("total_metal_extracted").default(0),
  totalCrystalExtracted: real("total_crystal_extracted").default(0),
  totalDeuteriumExtracted: real("total_deuterium_extracted").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ResourceField = typeof resourceFields.$inferSelect;

export const playerColonies = pgTable("player_colonies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planetId: integer("planet_id").notNull(),
  colonyName: varchar("colony_name").notNull(),
  colonyType: varchar("colony_type").notNull(),
  colonyLevel: integer("colony_level").default(1),
  population: integer("population").default(1000),
  builtAt: timestamp("built_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PlayerColony = typeof playerColonies.$inferSelect;

// Starbases - orbital stations for resource gathering and fleet operations
export const starbases = pgTable("starbases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  starbaseType: varchar("starbase_type").notNull(), // "mining", "refining", "shipyard", "research", "trade"
  name: varchar("name").notNull(),
  level: integer("level").notNull().default(1),
  coordinates: varchar("coordinates").notNull(),
  
  // Resources
  metalStorage: integer("metal_storage").default(10000),
  crystalStorage: integer("crystal_storage").default(10000),
  deuteriumStorage: integer("deuterium_storage").default(5000),
  
  // Production rates (per hour)
  metalProductionRate: real("metal_production_rate").default(100),
  crystalProductionRate: real("crystal_production_rate").default(50),
  deuteriumProductionRate: real("deuterium_production_rate").default(25),
  
  // Fleet operations
  hangarSlots: integer("hangar_slots").default(50),
  researchSlots: integer("research_slots").default(5),
  defenseLevel: integer("defense_level").default(1),
  
  // Status
  isActive: boolean("is_active").default(true),
  lastResourceUpdate: timestamp("last_resource_update").defaultNow(),
  builtAt: timestamp("built_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Starbase = typeof starbases.$inferSelect;
export const insertStarbaseSchema = createInsertSchema(starbases).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStarbase = z.infer<typeof insertStarbaseSchema>;

// Moon Bases - lunar settlements for mining and advanced operations
export const moonBases = pgTable("moon_bases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  baseType: varchar("base_type").notNull(), // "mining", "research", "military", "industrial"
  name: varchar("name").notNull(),
  level: integer("level").notNull().default(1),
  coordinates: varchar("coordinates").notNull(),
  moonName: varchar("moon_name").notNull(),
  
  // Resources
  metalReserves: integer("metal_reserves").default(5000),
  crystalReserves: integer("crystal_reserves").default(3000),
  deuteriumReserves: integer("deuterium_reserves").default(1000),
  
  // Mining operations
  miningCapacity: integer("mining_capacity").default(1000),
  activeMiningOps: integer("active_mining_ops").default(0),
  totalMined: integer("total_mined").default(0),
  
  // Scientific research
  researchPoints: real("research_points").default(0),
  researchMultiplier: real("research_multiplier").default(1.0),
  
  // Population and workforce
  population: integer("population").default(500),
  workers: integer("workers").default(100),
  
  // Defense
  shieldLevel: integer("shield_level").default(0),
  turrets: integer("turrets").default(0),
  
  // Status
  isActive: boolean("is_active").default(true),
  discoveredAt: timestamp("discovered_at").defaultNow(),
  builtAt: timestamp("built_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type MoonBase = typeof moonBases.$inferSelect;
export const insertMoonBaseSchema = createInsertSchema(moonBases).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMoonBase = z.infer<typeof insertMoonBaseSchema>;

// Player Profiles - account info with UID
export const playerProfiles = pgTable("player_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  uid: varchar("uid").notNull().unique(), // Unique account identifier
  
  // Profile info
  displayName: varchar("display_name").notNull(),
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Game progression
  level: integer("level").default(1),
  totalExperience: integer("total_experience").default(0),
  prestigeLevel: integer("prestige_level").default(0),
  
  // Rankings & Stats
  galaxyRank: integer("galaxy_rank"),
  fleetPower: integer("fleet_power").default(0),
  empirePower: integer("empire_power").default(0),
  
  // Attributes
  attributes: jsonb("attributes").notNull().default({
    strength: 10,
    intelligence: 10,
    endurance: 10,
    agility: 10,
    wisdom: 10,
    charisma: 10
  }),
  
  // Sub-attributes
  subAttributes: jsonb("sub_attributes").notNull().default({
    critChance: 5,
    critDamage: 50,
    dodge: 10,
    accuracy: 90,
    magicResist: 0,
    lifeSteal: 0
  }),
  
  // Categories & progression
  categories: jsonb("categories").notNull().default({
    military: 1,
    engineering: 1,
    science: 1,
    commerce: 1,
    diplomacy: 1,
    exploration: 1
  }),
  
  // Badges & achievements
  badges: jsonb("badges").notNull().default([]),
  achievements: jsonb("achievements").notNull().default([]),
  
  // Status
  isOnline: boolean("is_online").default(false),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PlayerProfile = typeof playerProfiles.$inferSelect;
export const insertPlayerProfileSchema = createInsertSchema(playerProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPlayerProfile = z.infer<typeof insertPlayerProfileSchema>;

// Mega Structures - massive end-game constructs
export const megaStructures = pgTable("mega_structures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").references(() => playerProfiles.id, { onDelete: "cascade" }),
  
  // Identity & Classification
  name: varchar("name").notNull(),
  structureType: varchar("structure_type").notNull(), // "dyson_sphere", "ring_world", "matrioshka_brain", "megastructure_fleet", "stellar_engine"
  structureClass: varchar("structure_class").notNull(), // "omega", "alpha", "beta", "gamma", "delta"
  kind: varchar("kind").notNull(), // "weapon", "habitation", "research", "industrial", "defense"
  category: varchar("category").notNull(), // "megastructure", "orbital", "interstellar"
  subCategory: varchar("sub_category"), // "partial", "full", "experimental"
  
  // Progression & Status
  level: integer("level").notNull().default(1),
  completionPercent: integer("completion_percent").default(0),
  isOperational: boolean("is_operational").default(false),
  
  // Location
  coordinates: varchar("coordinates").notNull(),
  galaxyId: integer("galaxy_id"),
  
  // Core Stats
  health: integer("health").default(1000000),
  maxHealth: integer("max_health").default(1000000),
  power: integer("power").default(100000),
  efficiency: real("efficiency").default(1.0),
  
  // Sub-stats (JSON for flexibility)
  substats: jsonb("substats").notNull().default({
    productionRate: 1000,
    researchMultiplier: 2.0,
    defenseMultiplier: 1.5,
    capacityMultiplier: 3.0,
    efficiencyRating: 95
  }),
  
  // Attributes
  attributes: jsonb("attributes").notNull().default({
    durability: 100,
    reliability: 95,
    adaptability: 80,
    scalability: 90,
    sustainability: 85
  }),
  
  // Sub-attributes
  subAttributes: jsonb("sub_attributes").notNull().default({
    maintenanceCost: 10000,
    powerConsumption: 50000,
    productionCapacity: 500000,
    storageCapacity: 1000000,
    repairRate: 5000
  }),
  
  // Resource Production & Storage
  resourceProduction: jsonb("resource_production").notNull().default({
    metal: 50000,
    crystal: 25000,
    deuterium: 10000,
    energy: 100000
  }),
  
  resourceStorage: jsonb("resource_storage").notNull().default({
    metal: 5000000,
    crystal: 2500000,
    deuterium: 1000000,
    energy: 10000000
  }),
  
  currentResources: jsonb("current_resources").notNull().default({
    metal: 1000000,
    crystal: 500000,
    deuterium: 250000,
    energy: 5000000
  }),
  
  // Modules & Systems (JSON for flexibility)
  modules: jsonb("modules").notNull().default([]),
  systems: jsonb("systems").notNull().default([]),
  weapons: jsonb("weapons").notNull().default([]),
  defenses: jsonb("defenses").notNull().default([]),
  
  // Details & Information
  description: text("description"),
  about: text("about"),
  details: jsonb("details").notNull().default({
    constructionTime: 0,
    estimatedCompletion: null,
    workforce: 10000,
    researchTeams: 100
  }),
  
  // Menus & Sub-menus (Navigation/management structure)
  menus: jsonb("menus").notNull().default({
    construction: { status: "planning", progress: 0 },
    production: { enabled: false, rates: {} },
    research: { projects: [], completed: [] },
    defense: { shields: true, weapons: true },
    management: { staffing: 100, efficiency: 95 }
  }),
  
  // Game Mechanics
  gameMechanics: jsonb("game_mechanics").notNull().default({
    captureable: false,
    destroyable: true,
    transferable: false,
    scalable: true,
    networked: false,
    effects: []
  }),
  
  // Crew & Population
  population: integer("population").default(100000),
  scientists: integer("scientists").default(1000),
  engineers: integer("engineers").default(5000),
  workers: integer("workers").default(50000),
  soldiers: integer("soldiers").default(20000),
  
  // Combat Stats
  attack: integer("attack").default(10000),
  defense: integer("defense").default(5000),
  damageOutput: real("damage_output").default(15000),
  
  // Metadata
  constructedAt: timestamp("constructed_at"),
  lastOperationalAt: timestamp("last_operational_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type MegaStructure = typeof megaStructures.$inferSelect;
export const insertMegaStructureSchema = createInsertSchema(megaStructures).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMegaStructure = z.infer<typeof insertMegaStructureSchema>;

// Empire Difficulty - progression system linked to Kardashev scale
export const empireDifficulties = pgTable("empire_difficulties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").references(() => playerProfiles.id, { onDelete: "cascade" }),
  
  // Difficulty level (0-5: Peaceful to Impossible)
  difficultyLevel: integer("difficulty_level").notNull().default(2), // 0=Peaceful, 2=Normal, 5=Impossible
  
  // Kardashev scale link
  kardashevLevel: integer("kardashev_level").notNull().default(1),
  kardashevProgress: integer("kardashev_progress").default(0), // 0-100%
  
  // Resource multipliers based on difficulty
  resourceMultiplier: real("resource_multiplier").default(1.0),
  researchMultiplier: real("research_multiplier").default(1.0),
  combatMultiplier: real("combat_multiplier").default(1.0),
  
  // Scaling factors
  scalingFactor: real("scaling_factor").default(1.0),
  difficultyMultiplier: real("difficulty_multiplier").default(1.0),
  
  // Stats & progression
  totalPower: integer("total_power").default(0),
  empirePower: integer("empire_power").default(0),
  galaxyPosition: integer("galaxy_position"),
  
  // Mechanics
  npcDifficulty: varchar("npc_difficulty").default("normal"), // npc difficulty scaling
  enemyStrength: real("enemy_strength").default(1.0),
  resourceScarcity: real("resource_scarcity").default(1.0), // 1.0 = normal, >1.0 = scarce
  
  // Achievements based on difficulty
  achievementsUnlocked: jsonb("achievements_unlocked").notNull().default([]),
  bonusesApplied: jsonb("bonuses_applied").notNull().default([]),
  
  // Challenge information
  challengeDescription: text("challenge_description"),
  challengeRequirements: jsonb("challenge_requirements").notNull().default({}),
  rewardsForCompletion: jsonb("rewards_for_completion").notNull().default({}),
  
  // Status
  isActive: boolean("is_active").default(true),
  startedAt: timestamp("started_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type EmpireDifficulty = typeof empireDifficulties.$inferSelect;
export const insertEmpireDifficultySchema = createInsertSchema(empireDifficulties).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEmpireDifficulty = z.infer<typeof insertEmpireDifficultySchema>;

// System Settings table for game configuration
export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").unique().notNull(),
  value: jsonb("value").notNull(),
  description: text("description"),
  category: varchar("category").default("general"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSystemSettingsSchema = createInsertSchema(systemSettings).omit({ id: true, updatedAt: true });
export type InsertSystemSettings = z.infer<typeof insertSystemSettingsSchema>;
export type SystemSettings = typeof systemSettings.$inferSelect;
