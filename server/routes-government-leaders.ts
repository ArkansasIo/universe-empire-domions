import type { Express, Request, Response } from 'express';
import {
  GOVERNMENT_LEADER_TYPES_23,
  GOVERNMENT_LEADER_TYPE_COUNT,
  getGovernmentLeadersByType,
  getGovernmentLeadersByClass,
  getGovernmentLeaderTypes,
  getGovernmentLeaderClasses,
} from '../shared/config/governmentLeadersConfig';

export function registerGovernmentLeaderRoutes(app: Express) {
  app.get('/api/government-leaders', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: GOVERNMENT_LEADER_TYPE_COUNT,
      leaders: GOVERNMENT_LEADER_TYPES_23,
      leaderTypes: getGovernmentLeaderTypes(),
      leaderClasses: getGovernmentLeaderClasses(),
    });
  });

  app.get('/api/government-leaders/type/:type', (req: Request, res: Response) => {
    const type = String(req.params.type || '');
    const leaders = getGovernmentLeadersByType(type);

    res.json({
      success: true,
      type,
      total: leaders.length,
      leaders,
    });
  });

  app.get('/api/government-leaders/class/:leaderClass', (req: Request, res: Response) => {
    const leaderClass = String(req.params.leaderClass || '');
    const leaders = getGovernmentLeadersByClass(leaderClass);

    res.json({
      success: true,
      leaderClass,
      total: leaders.length,
      leaders,
    });
  });
}
