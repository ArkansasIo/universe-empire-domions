import {
  users,
  playerStates,
  missions,
  messages,
  alliances,
  allianceMembers,
  marketOrders,
  queueItems,
  type User,
  type UpsertUser,
  type PlayerState,
  type InsertPlayerState,
  type Mission,
  type InsertMission,
  type Message,
  type InsertMessage,
  type Alliance,
  type InsertAlliance,
  type AllianceMember,
  type InsertAllianceMember,
  type MarketOrder,
  type InsertMarketOrder,
  type QueueItem,
  type InsertQueueItem
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Player state operations
  getPlayerState(userId: string): Promise<PlayerState | undefined>;
  createPlayerState(playerState: InsertPlayerState): Promise<PlayerState>;
  updatePlayerState(userId: string, updates: Partial<PlayerState>): Promise<PlayerState>;
  
  // Mission operations
  getMissionsByUser(userId: string): Promise<Mission[]>;
  getActiveMissions(userId: string): Promise<Mission[]>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMission(id: string, updates: Partial<Mission>): Promise<Mission>;
  updateMissionByUser(userId: string, id: string, updates: Partial<Mission>): Promise<Mission | null>;
  deleteMission(id: string): Promise<void>;
  deleteMissionByUser(userId: string, id: string): Promise<boolean>;
  
  // Message operations
  getMessagesByUser(userId: string, limit?: number): Promise<Message[]>;
  getUnreadCount(userId: string): Promise<number>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
  markMessageAsReadByUser(userId: string, id: string): Promise<boolean>;
  deleteMessage(id: string): Promise<void>;
  deleteMessageByUser(userId: string, id: string): Promise<boolean>;
  
  // Alliance operations
  getAllianceById(id: string): Promise<Alliance | undefined>;
  getAllianceByTag(tag: string): Promise<Alliance | undefined>;
  getAllAlliances(): Promise<Alliance[]>;
  createAlliance(alliance: InsertAlliance): Promise<Alliance>;
  updateAlliance(id: string, updates: Partial<Alliance>): Promise<Alliance>;
  
  // Alliance member operations
  getAllianceMembers(allianceId: string): Promise<AllianceMember[]>;
  getUserAlliance(userId: string): Promise<{ alliance: Alliance, member: AllianceMember } | undefined>;
  addAllianceMember(member: InsertAllianceMember): Promise<AllianceMember>;
  removeAllianceMember(allianceId: string, userId: string): Promise<void>;
  updateAllianceMember(id: string, updates: Partial<AllianceMember>): Promise<AllianceMember>;
  
  // Market operations
  getActiveMarketOrders(limit?: number): Promise<MarketOrder[]>;
  getUserMarketOrders(userId: string): Promise<MarketOrder[]>;
  createMarketOrder(order: InsertMarketOrder): Promise<MarketOrder>;
  updateMarketOrder(id: string, updates: Partial<MarketOrder>): Promise<MarketOrder>;
  deleteMarketOrder(id: string): Promise<void>;
  deleteMarketOrderByUser(userId: string, id: string): Promise<boolean>;
  
  // Queue operations
  getUserQueue(userId: string): Promise<QueueItem[]>;
  createQueueItem(item: InsertQueueItem): Promise<QueueItem>;
  deleteQueueItem(id: string): Promise<void>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<Array<{ user: User, state: PlayerState, points: number }>>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Player state operations
  async getPlayerState(userId: string): Promise<PlayerState | undefined> {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    return state;
  }

  async createPlayerState(playerState: InsertPlayerState): Promise<PlayerState> {
    const [state] = await db
      .insert(playerStates)
      .values(playerState)
      .returning();
    return state;
  }

  async updatePlayerState(userId: string, updates: Partial<PlayerState>): Promise<PlayerState> {
    const [state] = await db
      .update(playerStates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId))
      .returning();
    return state;
  }

  // Mission operations
  async getMissionsByUser(userId: string): Promise<Mission[]> {
    return db.select().from(missions).where(eq(missions.userId, userId)).orderBy(desc(missions.createdAt));
  }

  async getActiveMissions(userId: string): Promise<Mission[]> {
    return db.select().from(missions)
      .where(
        and(
          eq(missions.userId, userId),
          or(eq(missions.status, "outbound"), eq(missions.status, "return"))
        )
      )
      .orderBy(asc(missions.arrivalTime));
  }

  async createMission(mission: InsertMission): Promise<Mission> {
    const [newMission] = await db.insert(missions).values(mission).returning();
    return newMission;
  }

  async updateMission(id: string, updates: Partial<Mission>): Promise<Mission> {
    const [mission] = await db
      .update(missions)
      .set(updates)
      .where(eq(missions.id, id))
      .returning();
    return mission;
  }

  async updateMissionByUser(userId: string, id: string, updates: Partial<Mission>): Promise<Mission | null> {
    const [mission] = await db
      .update(missions)
      .set(updates)
      .where(and(eq(missions.id, id), eq(missions.userId, userId)))
      .returning();
    return mission || null;
  }

  async deleteMission(id: string): Promise<void> {
    await db.delete(missions).where(eq(missions.id, id));
  }

  async deleteMissionByUser(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(missions)
      .where(and(eq(missions.id, id), eq(missions.userId, userId)))
      .returning({ id: missions.id });
    return result.length > 0;
  }

  // Message operations
  async getMessagesByUser(userId: string, limit: number = 50): Promise<Message[]> {
    return db.select().from(messages)
      .where(eq(messages.toUserId, userId))
      .orderBy(desc(messages.timestamp))
      .limit(limit);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(and(eq(messages.toUserId, userId), eq(messages.read, false)));
    return result[0]?.count || 0;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id));
  }

  async markMessageAsReadByUser(userId: string, id: string): Promise<boolean> {
    const result = await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.id, id), eq(messages.toUserId, userId)))
      .returning({ id: messages.id });
    return result.length > 0;
  }

  async deleteMessage(id: string): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }

  async deleteMessageByUser(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(messages)
      .where(and(eq(messages.id, id), eq(messages.toUserId, userId)))
      .returning({ id: messages.id });
    return result.length > 0;
  }

  // Alliance operations
  async getAllianceById(id: string): Promise<Alliance | undefined> {
    const [alliance] = await db.select().from(alliances).where(eq(alliances.id, id));
    return alliance;
  }

  async getAllianceByTag(tag: string): Promise<Alliance | undefined> {
    const [alliance] = await db.select().from(alliances).where(eq(alliances.tag, tag));
    return alliance;
  }

  async getAllAlliances(): Promise<Alliance[]> {
    return db.select().from(alliances).orderBy(desc(alliances.createdAt));
  }

  async createAlliance(alliance: InsertAlliance): Promise<Alliance> {
    const [newAlliance] = await db.insert(alliances).values(alliance).returning();
    return newAlliance;
  }

  async updateAlliance(id: string, updates: Partial<Alliance>): Promise<Alliance> {
    const [alliance] = await db
      .update(alliances)
      .set(updates)
      .where(eq(alliances.id, id))
      .returning();
    return alliance;
  }

  // Alliance member operations
  async getAllianceMembers(allianceId: string): Promise<AllianceMember[]> {
    return db.select().from(allianceMembers).where(eq(allianceMembers.allianceId, allianceId));
  }

  async getUserAlliance(userId: string): Promise<{ alliance: Alliance, member: AllianceMember } | undefined> {
    const result = await db
      .select()
      .from(allianceMembers)
      .innerJoin(alliances, eq(allianceMembers.allianceId, alliances.id))
      .where(eq(allianceMembers.userId, userId))
      .limit(1);
    
    if (result.length === 0) return undefined;
    
    return {
      alliance: result[0].alliances,
      member: result[0].alliance_members
    };
  }

  async addAllianceMember(member: InsertAllianceMember): Promise<AllianceMember> {
    const [newMember] = await db.insert(allianceMembers).values(member).returning();
    return newMember;
  }

  async removeAllianceMember(allianceId: string, userId: string): Promise<void> {
    await db.delete(allianceMembers)
      .where(and(
        eq(allianceMembers.allianceId, allianceId),
        eq(allianceMembers.userId, userId)
      ));
  }

  async updateAllianceMember(id: string, updates: Partial<AllianceMember>): Promise<AllianceMember> {
    const [member] = await db
      .update(allianceMembers)
      .set(updates)
      .where(eq(allianceMembers.id, id))
      .returning();
    return member;
  }

  // Market operations
  async getActiveMarketOrders(limit: number = 50): Promise<MarketOrder[]> {
    return db.select().from(marketOrders)
      .where(eq(marketOrders.status, "active"))
      .orderBy(desc(marketOrders.createdAt))
      .limit(limit);
  }

  async getUserMarketOrders(userId: string): Promise<MarketOrder[]> {
    return db.select().from(marketOrders)
      .where(eq(marketOrders.userId, userId))
      .orderBy(desc(marketOrders.createdAt));
  }

  async createMarketOrder(order: InsertMarketOrder): Promise<MarketOrder> {
    const [newOrder] = await db.insert(marketOrders).values(order).returning();
    return newOrder;
  }

  async updateMarketOrder(id: string, updates: Partial<MarketOrder>): Promise<MarketOrder> {
    const [order] = await db
      .update(marketOrders)
      .set(updates)
      .where(eq(marketOrders.id, id))
      .returning();
    return order;
  }

  async deleteMarketOrder(id: string): Promise<void> {
    await db.delete(marketOrders).where(eq(marketOrders.id, id));
  }

  async deleteMarketOrderByUser(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(marketOrders)
      .where(and(eq(marketOrders.id, id), eq(marketOrders.userId, userId)))
      .returning({ id: marketOrders.id });
    return result.length > 0;
  }

  // Queue operations
  async getUserQueue(userId: string): Promise<QueueItem[]> {
    return db.select().from(queueItems)
      .where(eq(queueItems.userId, userId))
      .orderBy(asc(queueItems.endTime));
  }

  async createQueueItem(item: InsertQueueItem): Promise<QueueItem> {
    const [newItem] = await db.insert(queueItems).values(item).returning();
    return newItem;
  }

  async deleteQueueItem(id: string): Promise<void> {
    await db.delete(queueItems).where(eq(queueItems.id, id));
  }

  // Leaderboard
  async getLeaderboard(limit: number = 100): Promise<Array<{ user: User, state: PlayerState, points: number }>> {
    const result = await db
      .select()
      .from(playerStates)
      .innerJoin(users, eq(playerStates.userId, users.id))
      .orderBy(desc(sql`
        COALESCE((${playerStates.resources}->>'metal')::numeric, 0) + 
        COALESCE((${playerStates.resources}->>'crystal')::numeric, 0) * 2 + 
        COALESCE((${playerStates.resources}->>'deuterium')::numeric, 0) * 3
      `))
      .limit(limit);
    
    return result.map(row => ({
      user: row.users,
      state: row.player_states,
      points: Math.floor(
        (row.player_states.resources as any).metal + 
        (row.player_states.resources as any).crystal * 2 + 
        (row.player_states.resources as any).deuterium * 3
      )
    }));
  }
}

export const storage = new DatabaseStorage();
