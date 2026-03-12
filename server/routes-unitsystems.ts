import type { Express, Request, Response } from 'express';
import {
  UNIT_SYSTEM_TEMPLATES,
  STARSHIP_BLUEPRINTS,
  createDefaultPlayerUnitSystemState,
  getUnitTemplatesByDomain,
  processTrainingQueue,
  queueUnitTraining,
  untrainUnits,
  simulateUnitCombat,
  queueStarshipConstruction,
  processConstructionYard,
  type UnitDomain,
  type PlayerUnitSystemState,
  type CombatSideInput,
} from '../shared/config/unitSystemsConfig';

const isValidDomain = (value: unknown): value is UnitDomain =>
  value === 'troop' || value === 'civilian' || value === 'government' || value === 'military';

function getStateFromBody(req: Request): PlayerUnitSystemState {
  return (req.body?.state as PlayerUnitSystemState) || createDefaultPlayerUnitSystemState();
}

export function registerUnitSystemsRoutes(app: Express) {
  app.get('/api/unit-systems/templates', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: UNIT_SYSTEM_TEMPLATES.length,
      templates: UNIT_SYSTEM_TEMPLATES,
    });
  });

  app.get('/api/unit-systems/templates/:domain', (req: Request, res: Response) => {
    const domain = req.params.domain;
    if (!isValidDomain(domain)) {
      return res.status(400).json({ success: false, message: 'Invalid domain' });
    }

    res.json({
      success: true,
      domain,
      total: getUnitTemplatesByDomain(domain).length,
      templates: getUnitTemplatesByDomain(domain),
    });
  });

  app.get('/api/unit-systems/blueprints', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: STARSHIP_BLUEPRINTS.length,
      blueprints: STARSHIP_BLUEPRINTS,
    });
  });

  app.post('/api/unit-systems/train', (req: Request, res: Response) => {
    const state = processTrainingQueue(getStateFromBody(req));
    const { unitId, quantity, toState } = req.body || {};

    const result = queueUnitTraining(state, String(unitId || ''), Number(quantity || 0), toState === 'elite' ? 'elite' : 'trained');
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, message: result.message, state: result.state });
  });

  app.post('/api/unit-systems/untrain', (req: Request, res: Response) => {
    const state = processTrainingQueue(getStateFromBody(req));
    const { unitId, quantity, fromState } = req.body || {};

    if (fromState !== 'trained' && fromState !== 'elite') {
      return res.status(400).json({ success: false, message: 'fromState must be trained or elite' });
    }

    const result = untrainUnits(state, String(unitId || ''), Number(quantity || 0), fromState);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, message: result.message, state: result.state });
  });

  app.post('/api/unit-systems/training/process', (req: Request, res: Response) => {
    const state = getStateFromBody(req);
    const now = Number(req.body?.now || Date.now());
    const updated = processTrainingQueue(state, now);

    res.json({ success: true, state: updated });
  });

  app.post('/api/unit-systems/combat/simulate', (req: Request, res: Response) => {
    const attacker = req.body?.attacker as CombatSideInput | undefined;
    const defender = req.body?.defender as CombatSideInput | undefined;

    if (!attacker?.units?.length || !defender?.units?.length) {
      return res.status(400).json({ success: false, message: 'attacker and defender units are required' });
    }

    const result = simulateUnitCombat(attacker, defender);
    res.json({ success: true, result });
  });

  app.post('/api/unit-systems/yard/construct', (req: Request, res: Response) => {
    const state = processConstructionYard(getStateFromBody(req));
    const { blueprintId, quantity } = req.body || {};

    const result = queueStarshipConstruction(state, String(blueprintId || ''), Number(quantity || 0));
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, message: result.message, state: result.state });
  });

  app.post('/api/unit-systems/yard/process', (req: Request, res: Response) => {
    const state = getStateFromBody(req);
    const now = Number(req.body?.now || Date.now());
    const updated = processConstructionYard(state, now);

    res.json({ success: true, state: updated });
  });
}
