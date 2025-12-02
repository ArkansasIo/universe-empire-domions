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
  username: varchar("username").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
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

// Admin system tables
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").unique().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role").notNull().default("moderator"), // superAdmin, moderator, technician
  permissions: jsonb("permissions").notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;

export const adminLogs = pgTable("admin_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action").notNull(),
  targetUserId: varchar("target_user_id").references(() => users.id, { onDelete: "set null" }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  status: varchar("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AdminLog = typeof adminLogs.$inferSelect;

export const playerSanctions = pgTable("player_sanctions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  adminId: varchar("admin_id").references(() => users.id, { onDelete: "set null" }),
  sanctionType: varchar("sanction_type").notNull(), // ban, mute, kick, etc
  reason: varchar("reason").notNull(),
  banDurationDays: integer("ban_duration_days"),
  isPermanent: boolean("is_permanent").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  liftedAt: timestamp("lifted_at"),
  liftedByAdminId: varchar("lifted_by_admin_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PlayerSanction = typeof playerSanctions.$inferSelect;

export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key").unique().notNull(),
  settingValue: jsonb("setting_value").notNull(),
  description: varchar("description"),
  modifiedByAdminId: varchar("modified_by_admin_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;

export const serverEvents = pgTable("server_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: varchar("event_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  eventStart: timestamp("event_start").notNull(),
  eventEnd: timestamp("event_end"),
  rewardMultiplier: real("reward_multiplier").default(1.0),
  isActive: boolean("is_active").default(true),
  createdByAdminId: varchar("created_by_admin_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ServerEvent = typeof serverEvents.$inferSelect;

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  priority: varchar("priority").default("normal"), // low, normal, high, critical
  isActive: boolean("is_active").default(true),
  createdByAdminId: varchar("created_by_admin_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export type Announcement = typeof announcements.$inferSelect;

export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: varchar("metric_type").notNull(),
  metricValue: real("metric_value").notNull(),
  additionalData: jsonb("additional_data"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export type SystemMetric = typeof systemMetrics.$inferSelect;

export const backupLog = pgTable("backup_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  backupName: varchar("backup_name").notNull(),
  backupSizeMb: real("backup_size_mb"),
  backupLocation: varchar("backup_location"),
  backupType: varchar("backup_type"),
  status: varchar("status").default("pending"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BackupLog = typeof backupLog.$inferSelect;

export const economyAdjustments = pgTable("economy_adjustments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adjustmentType: varchar("adjustment_type").notNull(),
  multiplier: real("multiplier").default(1.0),
  target: varchar("target"),
  reason: varchar("reason"),
  appliedByAdminId: varchar("applied_by_admin_id").references(() => users.id, { onDelete: "set null" }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export type EconomyAdjustment = typeof economyAdjustments.$inferSelect;

export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: varchar("category").notNull(),
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("open"), // open, in-progress, resolved, closed
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  assignedAdminId: varchar("assigned_admin_id").references(() => users.id, { onDelete: "set null" }),
  responseText: text("response_text"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;

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

// Construction/Research Queue (optional - can be stored in playerStates JSON)
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
