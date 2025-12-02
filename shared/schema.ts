-- Empire Progression System - Levels 1-999, Ranks S-E, Tiers, Titles, Combat Power
CREATE TABLE IF NOT EXISTS player_level_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_level INTEGER NOT NULL DEFAULT 1,
  total_experience REAL NOT NULL DEFAULT 0,
  experience_to_next_level REAL NOT NULL DEFAULT 100,
  current_experience REAL NOT NULL DEFAULT 0,
  prestige_level INTEGER NOT NULL DEFAULT 0,
  prestige_multiplier REAL NOT NULL DEFAULT 1.0,
  level_up_count INTEGER NOT NULL DEFAULT 0,
  last_level_up TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_level_progression_player ON player_level_progression(player_id);
CREATE INDEX idx_level_progression_level ON player_level_progression(current_level);

CREATE TABLE IF NOT EXISTS player_rank_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_rank VARCHAR NOT NULL DEFAULT 'e',
  rank_name VARCHAR NOT NULL,
  rank_points INTEGER NOT NULL DEFAULT 0,
  rank_points_max INTEGER NOT NULL DEFAULT 1000,
  rank_progression_percent INTEGER DEFAULT 0,
  previous_rank VARCHAR,
  rank_changed_at TIMESTAMP,
  total_rank_ups INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rank_progression_player ON player_rank_progression(player_id);
CREATE INDEX idx_rank_progression_rank ON player_rank_progression(current_rank);

CREATE TABLE IF NOT EXISTS player_tier_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_tier INTEGER NOT NULL DEFAULT 1,
  tier_experience REAL NOT NULL DEFAULT 0,
  tier_experience_max REAL NOT NULL DEFAULT 1000,
  tier_progression_percent INTEGER DEFAULT 0,
  tier_bonuses JSONB DEFAULT '{}',
  unlocked_tiers JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tier_progression_player ON player_tier_progression(player_id);
CREATE INDEX idx_tier_progression_tier ON player_tier_progression(current_tier);

CREATE TABLE IF NOT EXISTS player_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title_key VARCHAR NOT NULL,
  title_name VARCHAR NOT NULL,
  title_description TEXT,
  title_type VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT false,
  display_order INTEGER,
  earned_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_titles_player ON player_titles(player_id);
CREATE INDEX idx_titles_active ON player_titles(is_active);

CREATE TABLE IF NOT EXISTS player_active_title (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES player_titles(id),
  custom_title VARCHAR,
  is_custom BOOLEAN DEFAULT false,
  set_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_active_title_player ON player_active_title(player_id);

CREATE TABLE IF NOT EXISTS player_combat_power (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_combat_power REAL NOT NULL DEFAULT 0,
  base_combat_power REAL NOT NULL DEFAULT 100,
  level_contribution REAL DEFAULT 0,
  tier_contribution REAL DEFAULT 0,
  rank_contribution REAL DEFAULT 0,
  fleet_power REAL DEFAULT 0,
  building_power REAL DEFAULT 0,
  technology_power REAL DEFAULT 0,
  commander_power REAL DEFAULT 0,
  equipment_power REAL DEFAULT 0,
  artifact_power REAL DEFAULT 0,
  alliance_bonus_power REAL DEFAULT 0,
  prestige_bonus_power REAL DEFAULT 0,
  knowledge_power REAL DEFAULT 0,
  research_power REAL DEFAULT 0,
  power_rank INTEGER,
  power_percentile REAL,
  last_calculated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_combat_power_player ON player_combat_power(player_id);
CREATE INDEX idx_combat_power_rank ON player_combat_power(power_rank);

CREATE TABLE IF NOT EXISTS player_technology_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tech_category VARCHAR NOT NULL,
  tech_level INTEGER NOT NULL DEFAULT 1,
  tech_experience REAL NOT NULL DEFAULT 0,
  research_speed_bonus REAL DEFAULT 0,
  cost_reduction_bonus REAL DEFAULT 0,
  is_unlocked BOOLEAN DEFAULT true,
  unlocked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tech_levels_player ON player_technology_levels(player_id);
CREATE UNIQUE INDEX idx_tech_levels_unique ON player_technology_levels(player_id, tech_category);

CREATE TABLE IF NOT EXISTS player_research_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  research_category VARCHAR NOT NULL,
  research_level INTEGER NOT NULL DEFAULT 1,
  research_experience REAL NOT NULL DEFAULT 0,
  research_speed_bonus REAL DEFAULT 0,
  cost_reduction_bonus REAL DEFAULT 0,
  is_unlocked BOOLEAN DEFAULT true,
  unlocked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_research_levels_player ON player_research_levels(player_id);
CREATE UNIQUE INDEX idx_research_levels_unique ON player_research_levels(player_id, research_category);

CREATE TABLE IF NOT EXISTS experience_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  experience_gained REAL NOT NULL,
  experience_source VARCHAR NOT NULL,
  source_details JSONB,
  related_id VARCHAR,
  gained_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_experience_log_player ON experience_log(player_id);
CREATE INDEX idx_experience_log_source ON experience_log(experience_source);

CREATE TABLE IF NOT EXISTS player_prestige_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prestige_level INTEGER NOT NULL,
  reset_from_level INTEGER NOT NULL,
  reset_from_experience REAL NOT NULL,
  permanent_multiplier_boost REAL NOT NULL,
  prestige_benefits JSONB DEFAULT '{}',
  reset_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prestige_history_player ON player_prestige_history(player_id);

CREATE TABLE IF NOT EXISTS player_milestone_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  milestone_key VARCHAR NOT NULL,
  milestone_name VARCHAR NOT NULL,
  milestone_level_requirement INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  rewards_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_milestone_progress_player ON player_milestone_progress(player_id);

CREATE TABLE IF NOT EXISTS leaderboard_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank_position INTEGER,
  leaderboard_type VARCHAR NOT NULL,
  score_value REAL NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_type ON leaderboard_cache(leaderboard_type);

CREATE TABLE IF NOT EXISTS empire_progression_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_levels_gained INTEGER DEFAULT 0,
  total_experience_earned REAL DEFAULT 0,
  rank_changes INTEGER DEFAULT 0,
  tier_ups INTEGER DEFAULT 0,
  titles_earned INTEGER DEFAULT 0,
  total_prestige_resets INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stats_player ON empire_progression_stats(player_id);
