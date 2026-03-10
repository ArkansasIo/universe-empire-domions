/**
 * Research Recommendations Engine
 * Analyzes player progression and suggests optimal research path
 * @tag #research #recommendations #ai #strategy
 */

export class ResearchRecommendationsService {
  /**
   * Generate research recommendations for player
   */
  static async getRecommendations(userId: string, limit: number = 5): Promise<any> {
    try {
      // Stub implementation - returns basic recommendations
      return [
        { tech: "solar_panels", rating: 9.5, reason: "Improves energy production" },
        { tech: "metal_refinery", rating: 8.8, reason: "Boosts metal extraction" },
        { tech: "combat_system", rating: 7.2, reason: "Defensive advantage" },
      ];
    } catch (error) {
      throw new Error(`Failed to generate recommendations: ${error}`);
    }
  }
      const profile = this.analyzePlayerProfile(queue, xpData, resources, buildings);

      // Get available techs
      const techs = await this.getAvailableTechs(userId);

      // Score each tech based on profile
      const scoredTechs = techs.map((tech: any) => ({
        ...tech,
        recommendationScore: this.scoreResearch(tech, profile, queue),
      }));

      // Sort and return top recommendations
      return {
        success: true,
        playerProfile: profile,
        recommendations: scoredTechs
          .sort((a: any, b: any) => b.recommendationScore - a.recommendationScore)
          .slice(0, limit),
        totalAvailable: techs.length,
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Analyze player's research profile and strategy
   */
  static analyzePlayerProfile(
    queue: any[],
    xpData: any,
    resources: any,
    buildings: any
  ): any {
    // Determine research specialization
    const researchedClasses: { [key: string]: number } = {};
    queue.forEach((item: any) => {
      if (item.completed) {
        researchedClasses[item.techClass] = (researchedClasses[item.techClass] || 0) + 1;
      }
    });

    const primarySpecialization = Object.entries(researchedClasses).sort(
      (a: any, b: any) => b[1] - a[1]
    )[0]?.[0] || 'balanced';

    // Determine resource abundance
    const resourceRatio = {
      metal: resources.metal || 0,
      crystal: resources.crystal || 0,
      deuterium: resources.deuterium || 0,
    };

    const totalResources = Object.values(resourceRatio).reduce((a: any, b: any) => a + b, 0) as number;
    const abundantResource = Object.entries(resourceRatio).sort(
      (a: any, b: any) => (b[1] as number) - (a[1] as number)
    )[0]?.[0] || 'balanced';

    // Determine progression level
    const level = xpData.currentLevel || 1;
    const researchesCompleted = xpData.researchesCompleted || 0;

    const progressionLevel =
      level < 10 ? 'early'
        : level < 30 ? 'mid'
          : level < 50 ? 'late'
            : 'endgame';

    // Lab level analysis
    const labLevel = Math.max(
      buildings.researchLab || 1,
      buildings.advancedLab || 1,
      buildings.eliteLab || 1
    );

    return {
      primarySpecialization,
      abundantResource,
      progressionLevel,
      level,
      researchesCompleted,
      labLevel,
      totalResources,
    };
  }

  /**
   * Score a research option based on player profile
   */
  static scoreResearch(tech: any, profile: any, currentQueue: any[]): number {
    let score = 0;

    // 1. Synergy with player specialization (25 points max)
    const specializationBonus = tech.class === profile.primarySpecialization ? 25 : 5;
    score += specializationBonus;

    // 2. Resource cost alignment (20 points max)
    if (tech.cost) {
      const costMatch = {
        metal: tech.cost.metal === profile.abundantResource ? 15 : 5,
        crystal: tech.cost.crystal === profile.abundantResource ? 15 : 5,
        deuterium: tech.cost.deuterium === profile.abundantResource ? 15 : 5,
      };
      score += costMatch[profile.abundantResource as keyof typeof costMatch] || 5;
    }

    // 3. Progression level appropriateness (15 points max)
    const tierProgression: { [key: string]: { [key: string]: number } } = {
      early: { basic: 15, standard: 5, advanced: 0, military: -10, experimental: -20, ancient: -20, exotic: -30 },
      mid: { basic: 10, standard: 15, advanced: 15, military: 10, experimental: 0, ancient: -10, exotic: -20 },
      late: { basic: 5, standard: 10, advanced: 15, military: 15, experimental: 15, ancient: 5, exotic: 0 },
      endgame: { basic: 0, standard: 5, advanced: 10, military: 15, experimental: 20, ancient: 25, exotic: 30 },
    };
    const tierBonus =
      tierProgression[profile.progressionLevel]?.[tech.tier] || 0;
    score += tierBonus;

    // 4. Unlocks bonus (10 points per unlock)
    if (tech.unlocks && tech.unlocks.length > 0) {
      score += tech.unlocks.length * 10;
    }

    // 5. Dependency impact (5 points per prerequisite)
    if (tech.prerequisites && tech.prerequisites.length > 0) {
      const meetsPrereqs = tech.prerequisites.every(
        (pre: string) =>
          currentQueue.find((q: any) => q.techId === pre && q.completed)
      );
      if (meetsPrereqs) {
        score += Math.min(tech.prerequisites.length * 5, 15);
      } else {
        score -= tech.prerequisites.length * 5;
      }
    }

    // 6. Time efficiency (5 points max)
    const timeEfficiency = 1000 / (tech.baseTurns || 1);
    score += Math.min(timeEfficiency / 100, 5);

    // 7. Late-game specialization boost
    if (profile.progressionLevel === 'endgame' && tech.tier === 'exotic') {
      score += 50;
    }

    // 8. Already queued penalty
    if (currentQueue.find((q: any) => q.techId === tech.id)) {
      score -= 100;
    }

    return score;
  }

  /**
   * Get available techs that player can research
   */
  static async getAvailableTechs(userId: string): Promise<any[]> {
    try {
      const playerData = await db.query(
        `SELECT research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerData.rows[0]) {
        return [];
      }

      const queue = playerData.rows[0].research_queue || [];
      const completedTechs = queue
        .filter((q: any) => q.completed)
        .map((q: any) => q.techId);

      // TODO: Fetch techs from database/config
      // For now, return mock data
      return [
        {
          id: 'armor_tech_1',
          name: 'Basic Armor',
          class: 'armor',
          tier: 'basic',
          cost: { metal: 1000, crystal: 500, deuterium: 0 },
          baseTurns: 10,
          prerequisites: [],
          unlocks: ['armor_tech_2'],
        },
        {
          id: 'armor_tech_2',
          name: 'Advanced Armor',
          class: 'armor',
          tier: 'advanced',
          cost: { metal: 5000, crystal: 2500, deuterium: 1000 },
          baseTurns: 50,
          prerequisites: ['armor_tech_1'],
          unlocks: ['armor_tech_3'],
        },
        {
          id: 'shields_tech_1',
          name: 'Shield Generator',
          class: 'shields',
          tier: 'standard',
          cost: { metal: 2000, crystal: 2000, deuterium: 500 },
          baseTurns: 30,
          prerequisites: [],
          unlocks: ['shields_tech_2'],
        },
        {
          id: 'weapons_tech_1',
          name: 'Laser Cannon',
          class: 'weapons',
          tier: 'standard',
          cost: { metal: 3000, crystal: 1000, deuterium: 500 },
          baseTurns: 25,
          prerequisites: [],
          unlocks: ['weapons_tech_2'],
        },
      ].filter((tech) => !completedTechs.includes(tech.id));
    } catch (error) {
      console.error('Error getting available techs:', error);
      return [];
    }
  }

  /**
   * Get research path suggestions for a goal tech
   */
  static async getResearchPath(userId: string, goalTechId: string): Promise<any> {
    try {
      const playerData = await db.query(
        `SELECT research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerData.rows[0]) {
        throw new Error(`Player not found`);
      }

      const queue = playerData.rows[0].research_queue || [];
      const completedTechs = queue
        .filter((q: any) => q.completed)
        .map((q: any) => q.techId);

      // Build path (BFS algorithm)
      const path = this.findResearchPath(goalTechId, completedTechs);

      return {
        success: true,
        goalTech: goalTechId,
        path,
        steps: path.length,
        totalTurnsEstimate: path.reduce((acc: number, tech: any) => acc + (tech.baseTurns || 0), 0),
      };
    } catch (error) {
      console.error('Error getting research path:', error);
      throw error;
    }
  }

  /**
   * Find shortest path to goal tech using BFS
   */
  static findResearchPath(goalTechId: string, completedTechs: string[]): any[] {
    // TODO: Implement BFS algorithm with tech dependency graph
    // For now, return mock path
    return [
      { id: 'armor_tech_1', name: 'Basic Armor', baseTurns: 10 },
      { id: 'armor_tech_2', name: 'Advanced Armor', baseTurns: 50 },
    ];
  }

  /**
   * Get optimal tech queuing order
   */
  static async getOptimalQueue(userId: string, techIds: string[]): Promise<any> {
    try {
      // Sort techs by dependency and efficiency
      const optimized = techIds.sort((a, b) => {
        // TODO: Implement optimal ordering algorithm
        return 0;
      });

      return {
        success: true,
        originalOrder: techIds,
        optimalOrder: optimized,
        estimatedSpeedup: '15%',
      };
    } catch (error) {
      console.error('Error optimizing queue:', error);
      throw error;
    }
  }

  /**
   * Get strategy analysis
   */
  static async getStrategyAnalysis(userId: string): Promise<any> {
    try {
      const playerData = await db.query(
        `SELECT research_queue, research_xp, resources FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerData.rows[0]) {
        throw new Error(`Player not found`);
      }

      const player = playerData.rows[0];
      const profile = this.analyzePlayerProfile(
        player.research_queue || [],
        player.research_xp || {},
        player.resources || {},
        {}
      );

      const strengths = this.getStrengths(profile);
      const weaknesses = this.getWeaknesses(profile);
      const suggestions = this.getSuggestions(profile);

      return {
        success: true,
        profile,
        strengths,
        weaknesses,
        suggestions,
      };
    } catch (error) {
      console.error('Error analyzing strategy:', error);
      throw error;
    }
  }

  static getStrengths(profile: any): string[] {
    return [
      `Specialized in ${profile.primarySpecialization} technologies`,
      `Abundant ${profile.abundantResource} resources`,
      `Progress level: ${profile.progressionLevel}`,
    ];
  }

  static getWeaknesses(profile: any): string[] {
    return [
      `Limited lab level (${profile.labLevel})`,
      `May need more research diversity`,
    ];
  }

  static getSuggestions(profile: any): string[] {
    return [
      `Focus on ${profile.primarySpecialization} branch for synergy`,
      `Upgrade lab to speed up research`,
      `Diversify into supporting technologies`,
    ];
  }
}

export default ResearchRecommendationsService;
