import {
  users,
  playerStates,
  missions,
  messages,
  alliances,
  allianceMembers,
  marketOrders,
  auctionListings,
  auctionBids,
  tradeOffers,
  tradeHistory,
  queueItems,
  playerColonies,
  resourceFields,
  equipmentDurability,
  fleetDurability,
  buildingDurability,
  battles,
  battleLogs,
  researchAreas,
  researchSubcategories,
  researchTechnologies,
  playerResearchProgress,
  expeditions,
  expeditionTeams,
  expeditionEncounters,
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
  type AuctionListing,
  type InsertAuctionListing,
  type AuctionBid,
  type InsertAuctionBid,
  type TradeOffer,
  type InsertTradeOffer,
  type TradeHistory,
  type QueueItem,
  type InsertQueueItem,
  type PlayerColony,
  type ResourceField,
  type EquipmentDurability,
  type FleetDurability,
  type BuildingDurability,
  type Battle,
  type InsertBattle,
  type BattleLog,
  type InsertBattleLog,
  type AdminUser,
  adminUsers
} from "@shared/schema";
import { db } from "./db/index";
import { eq, and, or, desc, asc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
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
  
  // Colony operations
  getPlayerColonies(userId: string): Promise<PlayerColony[]>;
  createPlayerColony(colony: any): Promise<PlayerColony>;
  
  // Resource field operations
  getFieldsByTerritory(territoryId: string): Promise<ResourceField[]>;
  
  // Mining operations
  getActiveMiningOperations(userId: string): Promise<any[]>;
  createMiningOperation(op: any): Promise<any>;
  
  // Durability operations
  getEquipmentDurability(userId: string, equipmentId: string): Promise<EquipmentDurability | undefined>;
  getFleetDurability(userId: string, fleetId: string): Promise<FleetDurability | undefined>;
  getBuildingDurability(userId: string, buildingId: string): Promise<BuildingDurability | undefined>;
  
  // Admin operations
  getAdminUser(userId: string): Promise<AdminUser | undefined>;
  
  // Research operations
  getResearchAreas(): Promise<any[]>;
  getResearchSubcategories(areaId: string): Promise<any[]>;
  getResearchTechnologies(subcategoryIds: string[]): Promise<any[]>;
  getPlayerResearchProgress(userId: string): Promise<any[]>;
  upsertPlayerResearch(userId: string, technologyId: string, status: string, progress: number): Promise<any>;
  
  // Expedition operations
  getExpeditions(userId: string): Promise<any[]>;
  createExpedition(userId: string, name: string, type: string, targetCoords: string, fleetComposition: any, troopComposition: any): Promise<any>;
  updateExpedition(expeditionId: string, updates: any): Promise<any>;
  getExpeditionTeams(expeditionId: string): Promise<any[]>;
  addTeamMember(expeditionId: string, unitId: string, role: string): Promise<any>;
  getExpeditionEncounters(expeditionId: string): Promise<any[]>;
  addEncounter(expeditionId: string, encounterType: string, description: string, rewards: any): Promise<any>;
  
  // Turn operations
  accrueAndGetTurns(userId: string): Promise<{ currentTurns: number; totalTurns: number; turnsAccrued: number; lastTurnUpdate: Date }>;
  spendTurns(userId: string, amount: number): Promise<{ success: boolean; currentTurns: number; totalTurns: number }>;
  
  // Auction operations
  getActiveAuctions(filters?: { itemType?: string; search?: string; sortBy?: string }): Promise<AuctionListing[]>;
  getAuctionById(id: string): Promise<AuctionListing | undefined>;
  getUserAuctions(userId: string): Promise<AuctionListing[]>;
  getUserBids(userId: string): Promise<AuctionListing[]>;
  createAuction(auction: InsertAuctionListing): Promise<AuctionListing>;
  placeBid(auctionId: string, bidderId: string, bidderName: string, bidAmount: number): Promise<{ success: boolean; auction?: AuctionListing; error?: string }>;
  buyoutAuction(auctionId: string, buyerId: string, buyerName: string): Promise<{ success: boolean; auction?: AuctionListing; error?: string }>;
  cancelAuction(auctionId: string, sellerId: string): Promise<{ success: boolean; error?: string }>;
  completeExpiredAuctions(): Promise<AuctionListing[]>;
  getAuctionBidHistory(auctionId: string): Promise<AuctionBid[]>;
  
  // Trade operations (mail-integrated player-to-player trading)
  getTradeOffers(userId: string): Promise<TradeOffer[]>;
  getTradeOfferById(id: string): Promise<TradeOffer | undefined>;
  getIncomingTradeOffers(userId: string): Promise<TradeOffer[]>;
  getOutgoingTradeOffers(userId: string): Promise<TradeOffer[]>;
  createTradeOffer(offer: InsertTradeOffer): Promise<TradeOffer>;
  acceptTradeOffer(tradeId: string, receiverId: string): Promise<{ success: boolean; trade?: TradeOffer; error?: string }>;
  declineTradeOffer(tradeId: string, receiverId: string): Promise<{ success: boolean; error?: string }>;
  cancelTradeOffer(tradeId: string, senderId: string): Promise<{ success: boolean; error?: string }>;
  counterTradeOffer(originalTradeId: string, counterOffer: InsertTradeOffer): Promise<{ success: boolean; trade?: TradeOffer; error?: string }>;
  getTradeHistory(userId: string): Promise<TradeHistory[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
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
    const result = await db
      .update(playerStates)
      .set({ 
        ...updates, 
        updatedAt: new Date() 
      })
      .where(eq(playerStates.userId, userId))
      .returning();
    
    if (!result || result.length === 0) {
      throw new Error(`Failed to update player state for user ${userId}`);
    }
    
    return result[0];
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
  
  // Colony operations
  async getPlayerColonies(userId: string): Promise<PlayerColony[]> {
    return await db.select().from(playerColonies).where(eq(playerColonies.playerId, userId));
  }
  
  async createPlayerColony(colony: any): Promise<PlayerColony> {
    const [newColony] = await db.insert(playerColonies).values(colony).returning();
    return newColony;
  }
  
  // Resource field operations
  async getFieldsByTerritory(territoryId: string): Promise<ResourceField[]> {
    return await db.select().from(resourceFields).where(eq(resourceFields.territoryId, territoryId));
  }
  
  // Mining operations (stubbed - table not yet created)
  async getActiveMiningOperations(userId: string): Promise<any[]> {
    return [];
  }
  
  async createMiningOperation(op: any): Promise<any> {
    return op;
  }
  
  // Durability operations
  async getEquipmentDurability(userId: string, equipmentId: string): Promise<EquipmentDurability | undefined> {
    const [durability] = await db
      .select()
      .from(equipmentDurability)
      .where(and(eq(equipmentDurability.playerId, userId), eq(equipmentDurability.equipmentId, equipmentId)));
    return durability;
  }
  
  async getFleetDurability(userId: string, fleetId: string): Promise<FleetDurability | undefined> {
    const [durability] = await db
      .select()
      .from(fleetDurability)
      .where(and(eq(fleetDurability.playerId, userId), eq(fleetDurability.fleetId, fleetId)));
    return durability;
  }
  
  async getBuildingDurability(userId: string, buildingId: string): Promise<BuildingDurability | undefined> {
    const [durability] = await db
      .select()
      .from(buildingDurability)
      .where(and(eq(buildingDurability.playerId, userId), eq(buildingDurability.buildingId, buildingId)));
    return durability;
  }
  
  // Admin operations
  async getAdminUser(userId: string): Promise<AdminUser | undefined> {
    const [adminUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId));
    return adminUser;
  }

  // Research operations
  async getResearchAreas(): Promise<any[]> {
    return await db.select().from(researchAreas);
  }

  async getResearchSubcategories(areaId: string): Promise<any[]> {
    return await db.select().from(researchSubcategories).where(eq(researchSubcategories.areaId, areaId));
  }

  async getResearchTechnologies(subcategoryIds: string[]): Promise<any[]> {
    if (subcategoryIds.length === 0) return [];
    return await db.select().from(researchTechnologies).where(inArray(researchTechnologies.subcategoryId, subcategoryIds));
  }

  async getPlayerResearchProgress(userId: string): Promise<any[]> {
    return await db.select().from(playerResearchProgress).where(eq(playerResearchProgress.userId, userId));
  }

  async upsertPlayerResearch(userId: string, technologyId: string, status: string, progress: number): Promise<any> {
    const [result] = await db
      .insert(playerResearchProgress)
      .values({ userId, technologyId, status, progress })
      .onConflictDoUpdate({
        target: [playerResearchProgress.userId, playerResearchProgress.technologyId],
        set: { status, progress, updatedAt: new Date() }
      })
      .returning();
    return result;
  }

  // Expedition operations
  async getExpeditions(userId: string): Promise<any[]> {
    return await db.select().from(expeditions).where(eq(expeditions.userId, userId)).orderBy(desc(expeditions.createdAt));
  }

  async createExpedition(userId: string, name: string, type: string, targetCoords: string, fleetComposition: any, troopComposition: any): Promise<any> {
    const [result] = await db
      .insert(expeditions)
      .values({
        userId,
        name,
        type,
        targetCoords,
        status: "preparing"
      })
      .returning();
    return result;
  }

  async updateExpedition(expeditionId: string, updates: any): Promise<any> {
    const [result] = await db
      .update(expeditions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(expeditions.id, expeditionId))
      .returning();
    return result;
  }

  async getExpeditionTeams(expeditionId: string): Promise<any[]> {
    return await db.select().from(expeditionTeams).where(eq(expeditionTeams.expeditionId, expeditionId));
  }

  async addTeamMember(expeditionId: string, unitId: string, role: string): Promise<any> {
    const [result] = await db
      .insert(expeditionTeams)
      .values({ expeditionId, unitId, role })
      .returning();
    return result;
  }

  async getExpeditionEncounters(expeditionId: string): Promise<any[]> {
    return await db.select().from(expeditionEncounters).where(eq(expeditionEncounters.expeditionId, expeditionId));
  }

  async addEncounter(expeditionId: string, encounterType: string, description: string, rewards: any): Promise<any> {
    const [result] = await db
      .insert(expeditionEncounters)
      .values({ expeditionId, encounterType, description, rewards })
      .returning();
    return result;
  }

  // Turn operations - 6 turns per minute with offline accrual
  async accrueAndGetTurns(userId: string): Promise<{ currentTurns: number; totalTurns: number; turnsAccrued: number; lastTurnUpdate: Date }> {
    const TURNS_PER_MINUTE = 6;
    const MAX_CURRENT_TURNS = 1000;
    const MAX_OFFLINE_HOURS = 24;
    const now = new Date();
    
    // Get current player state
    let playerState = await this.getPlayerState(userId);
    
    if (!playerState) {
      // Create new player state with starting turns
      playerState = await this.createPlayerState({
        userId,
        resources: { metal: 1000, crystal: 500, deuterium: 0, energy: 0 },
        commander: { race: "human", class: "warrior", stats: { level: 1, xp: 0 }, equipment: {}, inventory: [] },
        government: { type: "democracy", taxRate: 10, policies: [], stats: { stability: 50, efficiency: 70, publicSupport: 60, militaryReadiness: 50 } },
        currentTurns: 50,
        totalTurns: 50,
        lastTurnUpdate: now
      });
      return {
        currentTurns: 50,
        totalTurns: 50,
        turnsAccrued: 0,
        lastTurnUpdate: now
      };
    }
    
    const lastUpdate = playerState.lastTurnUpdate || now;
    const deltaMs = now.getTime() - new Date(lastUpdate).getTime();
    const deltaMinutes = Math.min(deltaMs / 60000, MAX_OFFLINE_HOURS * 60);
    
    // Calculate turns earned (6 per minute)
    const turnsEarned = Math.floor(deltaMinutes * TURNS_PER_MINUTE);
    
    if (turnsEarned > 0) {
      const currentTurns = playerState.currentTurns || 0;
      const totalTurns = playerState.totalTurns || 0;
      
      // Cap current turns at maximum
      const newCurrentTurns = Math.min(currentTurns + turnsEarned, MAX_CURRENT_TURNS);
      const actualAccrued = newCurrentTurns - currentTurns;
      const newTotalTurns = totalTurns + actualAccrued;
      
      // Update player state
      await this.updatePlayerState(userId, {
        currentTurns: newCurrentTurns,
        totalTurns: newTotalTurns,
        lastTurnUpdate: now
      });
      
      return {
        currentTurns: newCurrentTurns,
        totalTurns: newTotalTurns,
        turnsAccrued: actualAccrued,
        lastTurnUpdate: now
      };
    }
    
    return {
      currentTurns: playerState.currentTurns || 0,
      totalTurns: playerState.totalTurns || 0,
      turnsAccrued: 0,
      lastTurnUpdate: now
    };
  }

  async spendTurns(userId: string, amount: number): Promise<{ success: boolean; currentTurns: number; totalTurns: number }> {
    if (amount <= 0) {
      const state = await this.getPlayerState(userId);
      return {
        success: false,
        currentTurns: state?.currentTurns || 0,
        totalTurns: state?.totalTurns || 0
      };
    }
    
    // First accrue any pending turns
    const accrued = await this.accrueAndGetTurns(userId);
    
    if (accrued.currentTurns < amount) {
      return {
        success: false,
        currentTurns: accrued.currentTurns,
        totalTurns: accrued.totalTurns
      };
    }
    
    // Spend the turns atomically
    const [result] = await db
      .update(playerStates)
      .set({
        currentTurns: sql`${playerStates.currentTurns} - ${amount}`,
        lastTurnUpdate: new Date()
      })
      .where(
        and(
          eq(playerStates.userId, userId),
          sql`${playerStates.currentTurns} >= ${amount}`
        )
      )
      .returning();
    
    if (!result) {
      return {
        success: false,
        currentTurns: accrued.currentTurns,
        totalTurns: accrued.totalTurns
      };
    }
    
    return {
      success: true,
      currentTurns: result.currentTurns || 0,
      totalTurns: result.totalTurns || 0
    };
  }

  // Auction operations
  async getActiveAuctions(filters?: { itemType?: string; search?: string; sortBy?: string }): Promise<AuctionListing[]> {
    let query = db.select().from(auctionListings)
      .where(
        and(
          eq(auctionListings.status, "active"),
          sql`${auctionListings.expiresAt} > NOW()`
        )
      );
    
    const results = await query;
    
    let filtered = results;
    if (filters?.itemType && filters.itemType !== "all") {
      filtered = filtered.filter(a => a.itemType === filters.itemType);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.itemName.toLowerCase().includes(searchLower) ||
        (a.itemDescription?.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters?.sortBy === "price_low") {
      filtered.sort((a, b) => (a.currentBid || a.startingPrice) - (b.currentBid || b.startingPrice));
    } else if (filters?.sortBy === "price_high") {
      filtered.sort((a, b) => (b.currentBid || b.startingPrice) - (a.currentBid || a.startingPrice));
    } else if (filters?.sortBy === "ending_soon") {
      filtered.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
    
    return filtered;
  }

  async getAuctionById(id: string): Promise<AuctionListing | undefined> {
    const [result] = await db.select().from(auctionListings).where(eq(auctionListings.id, id));
    return result;
  }

  async getUserAuctions(userId: string): Promise<AuctionListing[]> {
    return await db.select().from(auctionListings)
      .where(eq(auctionListings.sellerId, userId))
      .orderBy(desc(auctionListings.createdAt));
  }

  async getUserBids(userId: string): Promise<AuctionListing[]> {
    return await db.select().from(auctionListings)
      .where(
        and(
          eq(auctionListings.currentBidderId, userId),
          eq(auctionListings.status, "active")
        )
      )
      .orderBy(desc(auctionListings.expiresAt));
  }

  async createAuction(auction: InsertAuctionListing): Promise<AuctionListing> {
    const [result] = await db.insert(auctionListings).values(auction).returning();
    return result;
  }

  async placeBid(auctionId: string, bidderId: string, bidderName: string, bidAmount: number): Promise<{ success: boolean; auction?: AuctionListing; error?: string }> {
    const auction = await this.getAuctionById(auctionId);
    
    if (!auction) {
      return { success: false, error: "Auction not found" };
    }
    
    if (auction.status !== "active") {
      return { success: false, error: "Auction is no longer active" };
    }
    
    if (new Date(auction.expiresAt) < new Date()) {
      return { success: false, error: "Auction has expired" };
    }
    
    if (auction.sellerId === bidderId) {
      return { success: false, error: "You cannot bid on your own auction" };
    }
    
    const minBid = (auction.currentBid || auction.startingPrice) + auction.bidIncrement;
    if (bidAmount < minBid) {
      return { success: false, error: `Minimum bid is ${minBid}` };
    }
    
    // Record bid history
    await db.insert(auctionBids).values({
      auctionId,
      bidderId,
      bidderName,
      bidAmount
    });
    
    // Update auction
    const [updated] = await db.update(auctionListings)
      .set({
        currentBid: bidAmount,
        currentBidderId: bidderId,
        currentBidderName: bidderName,
        bidCount: sql`${auctionListings.bidCount} + 1`
      })
      .where(eq(auctionListings.id, auctionId))
      .returning();
    
    return { success: true, auction: updated };
  }

  async buyoutAuction(auctionId: string, buyerId: string, buyerName: string): Promise<{ success: boolean; auction?: AuctionListing; error?: string }> {
    const auction = await this.getAuctionById(auctionId);
    
    if (!auction) {
      return { success: false, error: "Auction not found" };
    }
    
    if (auction.status !== "active") {
      return { success: false, error: "Auction is no longer active" };
    }
    
    if (!auction.buyoutPrice) {
      return { success: false, error: "This auction does not have a buyout option" };
    }
    
    if (auction.sellerId === buyerId) {
      return { success: false, error: "You cannot buy your own auction" };
    }
    
    // Complete the auction
    const [updated] = await db.update(auctionListings)
      .set({
        status: "sold",
        currentBid: auction.buyoutPrice,
        currentBidderId: buyerId,
        currentBidderName: buyerName,
        completedAt: new Date()
      })
      .where(eq(auctionListings.id, auctionId))
      .returning();
    
    return { success: true, auction: updated };
  }

  async cancelAuction(auctionId: string, sellerId: string): Promise<{ success: boolean; error?: string }> {
    const auction = await this.getAuctionById(auctionId);
    
    if (!auction) {
      return { success: false, error: "Auction not found" };
    }
    
    if (auction.sellerId !== sellerId) {
      return { success: false, error: "You can only cancel your own auctions" };
    }
    
    if (auction.status !== "active") {
      return { success: false, error: "Auction is no longer active" };
    }
    
    if (auction.bidCount > 0) {
      return { success: false, error: "Cannot cancel auction with bids" };
    }
    
    await db.update(auctionListings)
      .set({ status: "cancelled", completedAt: new Date() })
      .where(eq(auctionListings.id, auctionId));
    
    return { success: true };
  }

  async completeExpiredAuctions(): Promise<AuctionListing[]> {
    const now = new Date();
    
    // Find expired active auctions
    const expired = await db.select().from(auctionListings)
      .where(
        and(
          eq(auctionListings.status, "active"),
          sql`${auctionListings.expiresAt} <= ${now}`
        )
      );
    
    const completed: AuctionListing[] = [];
    
    for (const auction of expired) {
      const newStatus = auction.bidCount > 0 ? "sold" : "expired";
      const [updated] = await db.update(auctionListings)
        .set({ status: newStatus, completedAt: now })
        .where(eq(auctionListings.id, auction.id))
        .returning();
      completed.push(updated);
    }
    
    return completed;
  }

  async getAuctionBidHistory(auctionId: string): Promise<AuctionBid[]> {
    return await db.select().from(auctionBids)
      .where(eq(auctionBids.auctionId, auctionId))
      .orderBy(desc(auctionBids.createdAt));
  }

  // Trade operations (mail-integrated player-to-player trading)
  async getTradeOffers(userId: string): Promise<TradeOffer[]> {
    return await db.select().from(tradeOffers)
      .where(
        or(
          eq(tradeOffers.senderId, userId),
          eq(tradeOffers.receiverId, userId)
        )
      )
      .orderBy(desc(tradeOffers.createdAt));
  }

  async getTradeOfferById(id: string): Promise<TradeOffer | undefined> {
    const [offer] = await db.select().from(tradeOffers).where(eq(tradeOffers.id, id));
    return offer;
  }

  async getIncomingTradeOffers(userId: string): Promise<TradeOffer[]> {
    return await db.select().from(tradeOffers)
      .where(
        and(
          eq(tradeOffers.receiverId, userId),
          eq(tradeOffers.status, "pending")
        )
      )
      .orderBy(desc(tradeOffers.createdAt));
  }

  async getOutgoingTradeOffers(userId: string): Promise<TradeOffer[]> {
    return await db.select().from(tradeOffers)
      .where(
        and(
          eq(tradeOffers.senderId, userId),
          eq(tradeOffers.status, "pending")
        )
      )
      .orderBy(desc(tradeOffers.createdAt));
  }

  async createTradeOffer(offer: InsertTradeOffer): Promise<TradeOffer> {
    // Set expiration to 7 days from now if not specified
    const expiresAt = offer.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const [tradeOffer] = await db.insert(tradeOffers)
      .values({ ...offer, expiresAt })
      .returning();
    
    // Create a message for the receiver
    await db.insert(messages).values({
      fromUserId: offer.senderId,
      toUserId: offer.receiverId,
      from: offer.senderName,
      to: offer.receiverName,
      subject: `Trade Offer from ${offer.senderName}`,
      body: offer.message || `${offer.senderName} has sent you a trade offer. Check your trade inbox to review it.`,
      type: "trade"
    });
    
    return tradeOffer;
  }

  async acceptTradeOffer(tradeId: string, receiverId: string): Promise<{ success: boolean; trade?: TradeOffer; error?: string }> {
    const trade = await this.getTradeOfferById(tradeId);
    
    if (!trade) {
      return { success: false, error: "Trade offer not found" };
    }
    
    if (trade.receiverId !== receiverId) {
      return { success: false, error: "You can only accept trades sent to you" };
    }
    
    if (trade.status !== "pending") {
      return { success: false, error: "This trade offer is no longer pending" };
    }
    
    if (trade.expiresAt && new Date(trade.expiresAt) < new Date()) {
      await db.update(tradeOffers).set({ status: "expired" }).where(eq(tradeOffers.id, tradeId));
      return { success: false, error: "This trade offer has expired" };
    }
    
    // Get both player states
    const senderState = await this.getPlayerState(trade.senderId);
    const receiverState = await this.getPlayerState(receiverId);
    
    if (!senderState || !receiverState) {
      return { success: false, error: "Player state not found" };
    }
    
    const senderResources = senderState.resources as any;
    const receiverResources = receiverState.resources as any;
    
    // Check if sender has enough resources
    if (senderResources.metal < trade.offerMetal ||
        senderResources.crystal < trade.offerCrystal ||
        senderResources.deuterium < trade.offerDeuterium) {
      return { success: false, error: "Sender does not have enough resources" };
    }
    
    // Check if receiver has enough resources
    if (receiverResources.metal < trade.requestMetal ||
        receiverResources.crystal < trade.requestCrystal ||
        receiverResources.deuterium < trade.requestDeuterium) {
      return { success: false, error: "You do not have enough resources to complete this trade" };
    }
    
    // Update sender resources (subtract offered, add requested)
    await this.updatePlayerState(trade.senderId, {
      resources: {
        ...senderResources,
        metal: senderResources.metal - trade.offerMetal + trade.requestMetal,
        crystal: senderResources.crystal - trade.offerCrystal + trade.requestCrystal,
        deuterium: senderResources.deuterium - trade.offerDeuterium + trade.requestDeuterium
      }
    });
    
    // Update receiver resources (add offered, subtract requested)
    await this.updatePlayerState(receiverId, {
      resources: {
        ...receiverResources,
        metal: receiverResources.metal + trade.offerMetal - trade.requestMetal,
        crystal: receiverResources.crystal + trade.offerCrystal - trade.requestCrystal,
        deuterium: receiverResources.deuterium + trade.offerDeuterium - trade.requestDeuterium
      }
    });
    
    // Update trade status
    const [updated] = await db.update(tradeOffers)
      .set({ status: "accepted", completedAt: new Date() })
      .where(eq(tradeOffers.id, tradeId))
      .returning();
    
    // Record trade history
    await db.insert(tradeHistory).values({
      tradeOfferId: tradeId,
      senderId: trade.senderId,
      senderName: trade.senderName,
      receiverId: trade.receiverId,
      receiverName: trade.receiverName,
      senderGave: { metal: trade.offerMetal, crystal: trade.offerCrystal, deuterium: trade.offerDeuterium },
      receiverGave: { metal: trade.requestMetal, crystal: trade.requestCrystal, deuterium: trade.requestDeuterium },
      result: "completed"
    });
    
    // Send confirmation messages
    await db.insert(messages).values({
      fromUserId: receiverId,
      toUserId: trade.senderId,
      from: trade.receiverName,
      to: trade.senderName,
      subject: `Trade Accepted!`,
      body: `${trade.receiverName} has accepted your trade offer. Resources have been exchanged.`,
      type: "trade"
    });
    
    return { success: true, trade: updated };
  }

  async declineTradeOffer(tradeId: string, receiverId: string): Promise<{ success: boolean; error?: string }> {
    const trade = await this.getTradeOfferById(tradeId);
    
    if (!trade) {
      return { success: false, error: "Trade offer not found" };
    }
    
    if (trade.receiverId !== receiverId) {
      return { success: false, error: "You can only decline trades sent to you" };
    }
    
    if (trade.status !== "pending") {
      return { success: false, error: "This trade offer is no longer pending" };
    }
    
    await db.update(tradeOffers)
      .set({ status: "declined", completedAt: new Date() })
      .where(eq(tradeOffers.id, tradeId));
    
    // Notify sender
    await db.insert(messages).values({
      fromUserId: receiverId,
      toUserId: trade.senderId,
      from: trade.receiverName,
      to: trade.senderName,
      subject: `Trade Declined`,
      body: `${trade.receiverName} has declined your trade offer.`,
      type: "trade"
    });
    
    return { success: true };
  }

  async cancelTradeOffer(tradeId: string, senderId: string): Promise<{ success: boolean; error?: string }> {
    const trade = await this.getTradeOfferById(tradeId);
    
    if (!trade) {
      return { success: false, error: "Trade offer not found" };
    }
    
    if (trade.senderId !== senderId) {
      return { success: false, error: "You can only cancel your own trades" };
    }
    
    if (trade.status !== "pending") {
      return { success: false, error: "This trade offer is no longer pending" };
    }
    
    await db.update(tradeOffers)
      .set({ status: "cancelled", completedAt: new Date() })
      .where(eq(tradeOffers.id, tradeId));
    
    return { success: true };
  }

  async counterTradeOffer(originalTradeId: string, counterOffer: InsertTradeOffer): Promise<{ success: boolean; trade?: TradeOffer; error?: string }> {
    const originalTrade = await this.getTradeOfferById(originalTradeId);
    
    if (!originalTrade) {
      return { success: false, error: "Original trade offer not found" };
    }
    
    if (originalTrade.receiverId !== counterOffer.senderId) {
      return { success: false, error: "You can only counter trades sent to you" };
    }
    
    // Decline the original offer
    await db.update(tradeOffers)
      .set({ status: "countered", completedAt: new Date() })
      .where(eq(tradeOffers.id, originalTradeId));
    
    // Create new counter offer
    const [newTrade] = await db.insert(tradeOffers)
      .values({
        ...counterOffer,
        originalOfferId: originalTradeId,
        expiresAt: counterOffer.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
      .returning();
    
    // Notify original sender
    await db.insert(messages).values({
      fromUserId: counterOffer.senderId,
      toUserId: counterOffer.receiverId,
      from: counterOffer.senderName,
      to: counterOffer.receiverName,
      subject: `Counter Offer from ${counterOffer.senderName}`,
      body: counterOffer.message || `${counterOffer.senderName} has made a counter offer to your trade. Check your trade inbox to review it.`,
      type: "trade"
    });
    
    return { success: true, trade: newTrade };
  }

  async getTradeHistory(userId: string): Promise<TradeHistory[]> {
    return await db.select().from(tradeHistory)
      .where(
        or(
          eq(tradeHistory.senderId, userId),
          eq(tradeHistory.receiverId, userId)
        )
      )
      .orderBy(desc(tradeHistory.completedAt));
  }
}

export const storage = new DatabaseStorage();
