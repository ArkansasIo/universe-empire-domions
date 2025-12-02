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

// User permission system tables
export const userTiers = pgTable("user_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tierKey: varchar("tier_key").unique().notNull(),
  tierName: varchar("tier_name").notNull(),
  tierLevel: integer("tier_level").notNull(),
  description: text("description"),
  permissions: jsonb("permissions").notNull().default([]),
  restrictions: jsonb("restrictions").notNull().default({}),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserTier = typeof userTiers.$inferSelect;

export const userAccountStatus = pgTable("user_account_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").unique().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status").default("active"), // active, restricted, muted, suspended, banned
  tierId: varchar("tier_id").notNull().references(() => userTiers.id),
  permissions: jsonb("permissions").notNull().default([]),
  restrictions: jsonb("restrictions").notNull().default({}),
  flags: jsonb("flags").default({}),
  lastStatusChange: timestamp("last_status_change"),
  statusReason: varchar("status_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserAccountStatus = typeof userAccountStatus.$inferSelect;

export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeKey: varchar("badge_key").notNull(),
  badgeName: varchar("badge_name").notNull(),
  badgeDescription: text("badge_description"),
  earnedAt: timestamp("earned_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserBadge = typeof userBadges.$inferSelect;

export const userPermissions = pgTable("user_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  permission: varchar("permission").notNull(),
  allowed: boolean("allowed").default(true),
  grantedByAdminId: varchar("granted_by_admin_id").references(() => users.id, { onDelete: "set null" }),
  grantedAt: timestamp("granted_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  reason: varchar("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserPermission = typeof userPermissions.$inferSelect;

export const userRestrictions = pgTable("user_restrictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  restrictionType: varchar("restriction_type").notNull(),
  reason: varchar("reason").notNull(),
  severity: varchar("severity").default("warning"), // warning, moderate, severe
  imposedByAdminId: varchar("imposed_by_admin_id").references(() => users.id, { onDelete: "set null" }),
  imposedAt: timestamp("imposed_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  autoLift: boolean("auto_lift").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserRestriction = typeof userRestrictions.$inferSelect;

export const userActivityLog = pgTable("user_activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  activityType: varchar("activity_type").notNull(),
  activityData: jsonb("activity_data"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserActivityLog = typeof userActivityLog.$inferSelect;

export const userRateLimits = pgTable("user_rate_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  limitType: varchar("limit_type").notNull(),
  count: integer("count").default(0),
  resetAt: timestamp("reset_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserRateLimit = typeof userRateLimits.$inferSelect;

// Resources and Equipment System
export const playerResources = pgTable("player_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resourceType: varchar("resource_type").notNull(),
  quantity: real("quantity").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PlayerResource = typeof playerResources.$inferSelect;

export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemKey: varchar("item_key").unique().notNull(),
  itemName: varchar("item_name").notNull(),
  itemType: varchar("item_type").notNull(),
  rarity: varchar("rarity").notNull(),
  level: integer("level").notNull(),
  stats: jsonb("stats").notNull().default({}),
  bonuses: jsonb("bonuses").notNull().default({}),
  durability: integer("durability"),
  maxDurability: integer("max_durability"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Equipment = typeof equipment.$inferSelect;

export const playerInventory = pgTable("player_inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  equipmentId: varchar("equipment_id").notNull().references(() => equipment.id),
  quantity: integer("quantity").default(1),
  equipped: boolean("equipped").default(false),
  durability: integer("durability"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PlayerInventoryItem = typeof playerInventory.$inferSelect;

export const miningOperations = pgTable("mining_operations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  unitId: varchar("unit_id").references(() => units.id),
  location: varchar("location").notNull(),
  resourceType: varchar("resource_type").notNull(),
  yieldAmount: real("yield_amount").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MiningOperation = typeof miningOperations.$inferSelect;

// Units System
export const units = pgTable("units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  unitName: varchar("unit_name").notNull(),
  unitType: varchar("unit_type").notNull(),
  class: varchar("class").notNull(),
  job: varchar("job"),
  rank: varchar("rank").notNull().default("apprentice"),
  level: integer("level").notNull().default(1),
  rarity: varchar("rarity").default("common"),
  status: varchar("status").default("untrained"),
  
  // Attributes
  strength: integer("strength").default(10),
  constitution: integer("constitution").default(10),
  dexterity: integer("dexterity").default(10),
  intelligence: integer("intelligence").default(10),
  wisdom: integer("wisdom").default(10),
  charisma: integer("charisma").default(10),
  
  // Derived stats
  health: integer("health"),
  maxHealth: integer("max_health"),
  mana: integer("mana"),
  maxMana: integer("max_mana"),
  experience: integer("experience").default(0),
  
  // Sustenance
  hungerLevel: real("hunger_level").default(100),
  thirstLevel: real("thirst_level").default(100),
  lastFed: timestamp("last_fed"),
  
  // Equipment
  weaponId: varchar("weapon_id").references(() => equipment.id),
  armorId: varchar("armor_id").references(() => equipment.id),
  toolId: varchar("tool_id").references(() => equipment.id),
  
  // Location and assignment
  assignedLocation: varchar("assigned_location"),
  currentTask: varchar("current_task"),
  taskProgress: real("task_progress").default(0),
  
  // Bonuses
  areaBonuses: jsonb("area_bonuses").default({}),
  classBonuses: jsonb("class_bonuses").default({}),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Unit = typeof units.$inferSelect;

export const unitTrainingQueue = pgTable("unit_training_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: varchar("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  trainingType: varchar("training_type").notNull(),
  newLevel: integer("new_level").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  durationSeconds: integer("duration_seconds").notNull(),
  cost: jsonb("cost").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UnitTraining = typeof unitTrainingQueue.$inferSelect;

export const unitProgression = pgTable("unit_progression", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: varchar("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  skillType: varchar("skill_type").notNull(),
  skillLevel: integer("skill_level").default(1),
  skillExperience: integer("skill_experience").default(0),
  proficiency: real("proficiency").default(0.0),
  lastPracticed: timestamp("last_practiced"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UnitProgression = typeof unitProgression.$inferSelect;

export const sustenanceLog = pgTable("sustenance_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: varchar("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  resourceType: varchar("resource_type").notNull(),
  amountConsumed: real("amount_consumed").notNull(),
  currentLevel: real("current_level").notNull(),
  consumedAt: timestamp("consumed_at").defaultNow(),
});

export type SustenanceLog = typeof sustenanceLog.$inferSelect;

export const areaBonuses = pgTable("area_bonuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  areaKey: varchar("area_key").unique().notNull(),
  areaName: varchar("area_name").notNull(),
  description: text("description"),
  bonuses: jsonb("bonuses").notNull().default({}),
  resources: jsonb("resources").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AreaBonus = typeof areaBonuses.$inferSelect;

export const unitLoadouts = pgTable("unit_loadouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: varchar("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  loadoutName: varchar("loadout_name").notNull(),
  weaponId: varchar("weapon_id").references(() => equipment.id),
  armorId: varchar("armor_id").references(() => equipment.id),
  toolId: varchar("tool_id").references(() => equipment.id),
  accessory1Id: varchar("accessory_1_id").references(() => equipment.id),
  accessory2Id: varchar("accessory_2_id").references(() => equipment.id),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UnitLoadout = typeof unitLoadouts.$inferSelect;

export const unitStatistics = pgTable("unit_statistics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: varchar("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  resourceMined: real("resource_mined").default(0),
  tasksCompleted: integer("tasks_completed").default(0),
  battlesFought: integer("battles_fought").default(0),
  enemiesDefeated: integer("enemies_defeated").default(0),
  totalDamageDealt: real("total_damage_dealt").default(0),
  totalDamageTaken: real("total_damage_taken").default(0),
  promotions: integer("promotions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UnitStatistics = typeof unitStatistics.$inferSelect;

// Unit Research System
export const unitResearchDefinitions = pgTable("unit_research_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  researchKey: varchar("research_key").unique().notNull(),
  researchName: varchar("research_name").notNull(),
  category: varchar("category").notNull(),
  tier: integer("tier").notNull(),
  cost: jsonb("cost").notNull().default({}),
  researchTime: integer("research_time").notNull(),
  description: text("description"),
  unlocks: jsonb("unlocks").notNull().default([]),
  prerequisites: jsonb("prerequisites").notNull().default([]),
  bonuses: jsonb("bonuses").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UnitResearchDefinition = typeof unitResearchDefinitions.$inferSelect;

export const playerUnitResearch = pgTable("player_unit_research", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  researchId: varchar("research_id").notNull().references(() => unitResearchDefinitions.id),
  status: varchar("status").default("locked"), // locked, available, in_progress, completed
  progress: real("progress").default(0),
  completedAt: timestamp("completed_at"),
  startedAt: timestamp("started_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PlayerUnitResearch = typeof playerUnitResearch.$inferSelect;

export const unitResearchQueue = pgTable("unit_research_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").unique().references(() => users.id, { onDelete: "cascade" }),
  researchId: varchar("research_id").notNull().references(() => unitResearchDefinitions.id),
  startedAt: timestamp("started_at").defaultNow(),
  completionTime: timestamp("completion_time").notNull(),
  researchPointsInvested: real("research_points_invested").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UnitResearchQueue = typeof unitResearchQueue.$inferSelect;

export const unitClassificationUpgrades = pgTable("unit_classification_upgrades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: varchar("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  upgradeType: varchar("upgrade_type").notNull(),
  upgradeKey: varchar("upgrade_key").notNull(),
  tier: integer("tier"),
  status: varchar("status").default("active"),
  appliedAt: timestamp("applied_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UnitClassificationUpgrade = typeof unitClassificationUpgrades.$inferSelect;

export const playerUnlockedUnits = pgTable("player_unlocked_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  unitType: varchar("unit_type").notNull(),
  unitClass: varchar("unit_class"),
  unitJob: varchar("unit_job"),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PlayerUnlockedUnit = typeof playerUnlockedUnits.$inferSelect;

export const researchPointsLog = pgTable("research_points_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  pointsEarned: real("points_earned").notNull(),
  source: varchar("source").notNull(),
  unitId: varchar("unit_id").references(() => units.id),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export type ResearchPointsLog = typeof researchPointsLog.$inferSelect;

export const activeResearchBonuses = pgTable("active_research_bonuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  researchId: varchar("research_id").notNull().references(() => unitResearchDefinitions.id),
  bonusType: varchar("bonus_type").notNull(),
  bonusValue: real("bonus_value").notNull(),
  isActive: boolean("is_active").default(true),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export type ActiveResearchBonus = typeof activeResearchBonuses.$inferSelect;

// Knowledge Library System (1-100 levels, 1-21 tiers)
export const knowledgeTypes = pgTable("knowledge_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  typeKey: varchar("type_key").unique().notNull(),
  typeName: varchar("type_name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type KnowledgeType = typeof knowledgeTypes.$inferSelect;

export const knowledgeClasses = pgTable("knowledge_classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classKey: varchar("class_key").unique().notNull(),
  className: varchar("class_name").notNull(),
  knowledgeTypeId: varchar("knowledge_type_id").notNull().references(() => knowledgeTypes.id),
  bonuses: jsonb("bonuses").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export type KnowledgeClass = typeof knowledgeClasses.$inferSelect;

export const knowledgeTiers = pgTable("knowledge_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tierNumber: integer("tier_number").unique().notNull(),
  tierName: varchar("tier_name").notNull(),
  levelRangeMin: integer("level_range_min").notNull(),
  levelRangeMax: integer("level_range_max").notNull(),
  costMultiplier: real("cost_multiplier").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type KnowledgeTier = typeof knowledgeTiers.$inferSelect;

export const playerKnowledgeProgress = pgTable("player_knowledge_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  knowledgeClassId: varchar("knowledge_class_id").notNull().references(() => knowledgeClasses.id),
  currentLevel: integer("current_level").notNull().default(1),
  currentTier: integer("current_tier").notNull().default(1),
  experience: real("experience").notNull().default(0),
  totalExperience: real("total_experience").notNull().default(0),
  isActive: boolean("is_active").default(false),
  unlockedAt: timestamp("unlocked_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PlayerKnowledgeProgress = typeof playerKnowledgeProgress.$inferSelect;

export const knowledgeResearchQueue = pgTable("knowledge_research_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  knowledgeClassId: varchar("knowledge_class_id").notNull().references(() => knowledgeClasses.id),
  targetLevel: integer("target_level").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completionTime: timestamp("completion_time").notNull(),
  knowledgePointsInvested: real("knowledge_points_invested").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type KnowledgeResearchQueue = typeof knowledgeResearchQueue.$inferSelect;

export const knowledgePointsLog = pgTable("knowledge_points_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  knowledgeClassId: varchar("knowledge_class_id").notNull().references(() => knowledgeClasses.id),
  pointsEarned: real("points_earned").notNull(),
  source: varchar("source").notNull(),
  unitId: varchar("unit_id").references(() => units.id),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export type KnowledgePointsLog = typeof knowledgePointsLog.$inferSelect;

export const activeKnowledgeBonuses = pgTable("active_knowledge_bonuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  knowledgeClassId: varchar("knowledge_class_id").notNull().references(() => knowledgeClasses.id),
  bonusType: varchar("bonus_type").notNull(),
  bonusValue: real("bonus_value").notNull(),
  isActive: boolean("is_active").default(true),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export type ActiveKnowledgeBonus = typeof activeKnowledgeBonuses.$inferSelect;

export const knowledgeSynergies = pgTable("knowledge_synergies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  knowledgeType1: varchar("knowledge_type_1").notNull(),
  knowledgeType2: varchar("knowledge_type_2").notNull(),
  synergyBonus: real("synergy_bonus").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type KnowledgeSynergy = typeof knowledgeSynergies.$inferSelect;

export const libraryResearchDefinitions = pgTable("library_research_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  researchKey: varchar("research_key").unique().notNull(),
  researchName: varchar("research_name").notNull(),
  knowledgeClassId: varchar("knowledge_class_id").notNull().references(() => knowledgeClasses.id),
  requiredLevel: integer("required_level").notNull(),
  requiredTier: integer("required_tier").notNull(),
  cost: jsonb("cost").notNull().default({}),
  researchTime: integer("research_time").notNull(),
  description: text("description"),
  unlocks: jsonb("unlocks").notNull().default([]),
  prerequisites: jsonb("prerequisites").notNull().default([]),
  bonuses: jsonb("bonuses").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export type LibraryResearchDefinition = typeof libraryResearchDefinitions.$inferSelect;

export const playerLibraryUnlocks = pgTable("player_library_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  researchId: varchar("research_id").notNull().references(() => libraryResearchDefinitions.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PlayerLibraryUnlock = typeof playerLibraryUnlocks.$inferSelect;

export const levelUnlockEvents = pgTable("level_unlock_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  knowledgeClassId: varchar("knowledge_class_id").notNull().references(() => knowledgeClasses.id),
  levelReached: integer("level_reached").notNull(),
  unlockType: varchar("unlock_type").notNull(),
  unlockName: varchar("unlock_name").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export type LevelUnlockEvent = typeof levelUnlockEvents.$inferSelect;

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
