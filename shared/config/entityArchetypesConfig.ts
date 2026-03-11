
export const ENTITY_ARCHETYPES_90 = [
  // Starships (12)
  { type: "Starship", subType: "Interceptor", class: "Fighter", subClass: "Light Attack" },
  { type: "Starship", subType: "Battlecruiser", class: "Capital", subClass: "Command" },
  { type: "Starship", subType: "Dreadnought", class: "Capital", subClass: "Heavy Assault" },
  { type: "Starship", subType: "Carrier", class: "Capital", subClass: "Support" },
  { type: "Starship", subType: "Scout", class: "Fighter", subClass: "Recon" },
  { type: "Starship", subType: "Bomber", class: "Fighter", subClass: "Heavy Attack" },
  { type: "Starship", subType: "Frigate", class: "Cruiser", subClass: "Escort" },
  { type: "Starship", subType: "Destroyer", class: "Cruiser", subClass: "Assault" },
  { type: "Starship", subType: "Corvette", class: "Fighter", subClass: "Anti-Fighter" },
  { type: "Starship", subType: "Titan", class: "Titan", subClass: "Ultimate Weapon" },
  { type: "Starship", subType: "Flagship", class: "Capital", subClass: "Fleet Command" },
  { type: "Starship", subType: "Assault Ship", class: "Cruiser", subClass: "Planetary Assault" },
  // Motherships (6)
  { type: "Mothership", subType: "Command Ship", class: "Support", subClass: "Fleet Command" },
  { type: "Mothership", subType: "Factory Ship", class: "Support", subClass: "Production" },
  { type: "Mothership", subType: "Hospital Ship", class: "Support", subClass: "Medical" },
  { type: "Mothership", subType: "Colony Ship", class: "Civilian", subClass: "Colonization" },
  { type: "Mothership", subType: "Resource Harvester", class: "Civilian", subClass: "Mining" },
  { type: "Mothership", subType: "Mobile Fortress", class: "Capital", subClass: "Defense" },
  // Troops (10)
  { type: "Troop", subType: "Infantry", class: "Ground", subClass: "Standard" },
  { type: "Troop", subType: "Heavy Infantry", class: "Ground", subClass: "Heavy" },
  { type: "Troop", subType: "Special Forces", class: "Ground", subClass: "Elite" },
  { type: "Troop", subType: "Sniper", class: "Ground", subClass: "Recon" },
  { type: "Troop", subType: "Medic", class: "Ground", subClass: "Support" },
  { type: "Troop", subType: "Engineer", class: "Ground", subClass: "Support" },
  { type: "Troop", subType: "Scout", class: "Ground", subClass: "Recon" },
  { type: "Troop", subType: "Assault Team", class: "Ground", subClass: "Assault" },
  { type: "Troop", subType: "Paratrooper", class: "Airborne", subClass: "Assault" },
  { type: "Troop", subType: "Commando", class: "Ground", subClass: "Stealth" },
  // Units (10)
  { type: "Unit", subType: "Tank", class: "Armor", subClass: "Heavy" },
  { type: "Unit", subType: "Artillery", class: "Armor", subClass: "Support" },
  { type: "Unit", subType: "Mech", class: "Armor", subClass: "Assault" },
  { type: "Unit", subType: "Drone", class: "Robotic", subClass: "Swarm" },
  { type: "Unit", subType: "Walker", class: "Armor", subClass: "Heavy Assault" },
  { type: "Unit", subType: "Gunship", class: "Air", subClass: "Attack" },
  { type: "Unit", subType: "Transport", class: "Support", subClass: "Logistics" },
  { type: "Unit", subType: "Support Vehicle", class: "Support", subClass: "Repair" },
  { type: "Unit", subType: "Recon Unit", class: "Recon", subClass: "Scout" },
  { type: "Unit", subType: "Heavy Armor", class: "Armor", subClass: "Super Heavy" },
  // Untrained Units (6)
  { type: "Untrained", subType: "Conscript", class: "Infantry", subClass: "Basic" },
  { type: "Untrained", subType: "Militia", class: "Infantry", subClass: "Basic" },
  { type: "Untrained", subType: "Volunteer", class: "Infantry", subClass: "Basic" },
  { type: "Untrained", subType: "Reserve", class: "Infantry", subClass: "Basic" },
  { type: "Untrained", subType: "Recruit", class: "Infantry", subClass: "Basic" },
  { type: "Untrained", subType: "Cadet", class: "Officer", subClass: "Training" },
  // Civilian Units (8)
  { type: "Civilian", subType: "Worker", class: "Labor", subClass: "General" },
  { type: "Civilian", subType: "Scientist", class: "Research", subClass: "Specialist" },
  { type: "Civilian", subType: "Trader", class: "Commerce", subClass: "Merchant" },
  { type: "Civilian", subType: "Diplomat", class: "Political", subClass: "Ambassador" },
  { type: "Civilian", subType: "Administrator", class: "Political", subClass: "Bureaucrat" },
  { type: "Civilian", subType: "Colonist", class: "Exploration", subClass: "Settler" },
  { type: "Civilian", subType: "Miner", class: "Labor", subClass: "Mining" },
  { type: "Civilian", subType: "Farmer", class: "Labor", subClass: "Agriculture" },
  // Military Units (10)
  { type: "Military", subType: "Marine", class: "Infantry", subClass: "Standard" },
  { type: "Military", subType: "Pilot", class: "Starship Crew", subClass: "Fighter" },
  { type: "Military", subType: "Officer", class: "Command", subClass: "Junior" },
  { type: "Military", subType: "Sergeant", class: "Command", subClass: "NCO" },
  { type: "Military", subType: "Captain", class: "Command", subClass: "Senior" },
  { type: "Military", subType: "General", class: "Command", subClass: "High Command" },
  { type: "Military", subType: "Admiral", class: "Command", subClass: "Fleet Command" },
  { type: "Military", subType: "Commander", class: "Command", subClass: "Field Command" },
  { type: "Military", subType: "Elite Guard", class: "Infantry", subClass: "Elite" },
  { type: "Military", subType: "Spec Ops", class: "Special Forces", subClass: "Covert" },
  // Additional units to reach 90
  { type: "Starship", subType: "Gunboat", class: "Fighter", subClass: "Heavy Gun" },
  { type: "Starship", subType: "Raider", class: "Cruiser", subClass: "Pirate" },
  { type: "Starship", subType: "Blockade Runner", class: "Cruiser", subClass: "Stealth" },
  { type: "Mothership", subType: "Siege Ship", class: "Capital", subClass: "Planetary Siege" },
  { type: "Troop", subType: "Grenadier", class: "Ground", subClass: "Explosives" },
  { type: "Unit", subType: "Amphibious Assault Vehicle", class: "Armor", subClass: "Assault" },
  { type: "Untrained", subType: "Penal Legion", class: "Infantry", subClass: "Expendable" },
  { type: "Civilian", subType: "Entertainer", class: "Support", subClass: "Morale" },
  { type: "Military", subType: "Navigator", class: "Starship Crew", subClass: "Support" },
  { type: "Starship", subType: "Science Vessel", class: "Support", subClass: "Research" },
  { type: "Starship", subType: "EMP Fighter", class: "Fighter", subClass: "Electronic Warfare" },
  { type: "Starship", subType: "Missile Frigate", class: "Cruiser", subClass: "Ordnance" },
  { type: "Starship", subType: "Light Carrier", class: "Cruiser", subClass: "Support" },
  { type: "Mothership", subType: "Diplomatic Barge", class: "Civilian", subClass: "Diplomacy" },
  { type: "Troop", subType: "Anti-Armor Specialist", class: "Ground", subClass: "Heavy Weapons" },
  { type: "Troop", subType: "Riot Police", class: "Ground", subClass: "Law Enforcement" },
  { type: "Unit", subType: "Mobile SAM", class: "Armor", subClass: "Anti-Air" },
  { type: "Unit", subType: "ECM Tank", class: "Armor", subClass: "Electronic Warfare" },
  { type: "Untrained", subType: "Partisan", class: "Infantry", subClass: "Irregular" },
  { type: "Civilian", subType: "Biologist", class: "Research", subClass: "Xenobiology" },
  { type: "Civilian", subType: "Media Correspondent", class: "Support", subClass: "Information" },
  { type: "Military", subType: "Damage Controlman", class: "Starship Crew", subClass: "Engineering" },
  { type: "Military", subType: "Heavy Marine", class: "Infantry", subClass: "Heavy" },
  { type: "Starship", subType: "Gas Collector", class: "Civilian", subClass: "Harvesting" },
  { type: "Troop", subType: "Jump Trooper", class: "Airborne", subClass: "Jump Pack" },
  { type: "Unit", subType: "Infiltration Droid", class: "Robotic", subClass: "Stealth" },
  { type: "Civilian", subType: "Ambassadorial Aide", class: "Political", subClass: "Support" },
  { type: "Military", subType: "Psychic Operative", class: "Special Forces", subClass: "Psionics" }
];

export const ENTITY_ARCHETYPES_GROUPED = ENTITY_ARCHETYPES_90.reduce((acc, entity) => {
  if (!acc[entity.type]) {
    acc[entity.type] = [];
  }
  acc[entity.type].push(entity);
  return acc;
}, {} as Record<string, typeof ENTITY_ARCHETYPES_90>);

export const ENTITY_ARCHETYPES_META = {
  total: ENTITY_ARCHETYPES_90.length,
  types: [...new Set(ENTITY_ARCHETYPES_90.map(e => e.type))],
  classes: [...new Set(ENTITY_ARCHETYPES_90.map(e => e.class))],
  subClasses: [...new Set(ENTITY_ARCHETYPES_90.map(e => e.subClass))],
};
