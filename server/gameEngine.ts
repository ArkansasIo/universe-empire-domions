
import { resourceService } from './services/resourceService';
import { fleetService } from './services/fleetService';
import { technologyService } from './services/technologyService';

class GameEngine {
  constructor() {
    console.log('Game engine started!');
  }

  public update() {
    console.log('Game engine update');
  }

  public getResources() {
    return resourceService.getResources();
  }

  public getFleet() {
    return fleetService.getFleet();
  }

  public getTechnologyTree() {
    return technologyService.getTechnologyTree();
  }
}

export const gameEngine = new GameEngine();
