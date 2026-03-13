-- Stellar Dominion - Full Game Foundation SQL Pack
-- Safe to run multiple times (IF NOT EXISTS).

BEGIN;

CREATE TABLE IF NOT EXISTS mining_operations (
  id varchar PRIMARY KEY,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type varchar NOT NULL,
  amount_per_hour integer NOT NULL DEFAULT 0,
  status varchar NOT NULL DEFAULT 'active',
  started_at timestamp NOT NULL DEFAULT now(),
  ends_at timestamp,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mining_operations_user_status
  ON mining_operations(user_id, status);

CREATE TABLE IF NOT EXISTS research_trades (
  id varchar PRIMARY KEY,
  initiator_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status varchar NOT NULL DEFAULT 'pending',
  initiator_offer jsonb NOT NULL DEFAULT '{}'::jsonb,
  recipient_offer jsonb NOT NULL DEFAULT '{}'::jsonb,
  rejection_reason text,
  created_at timestamp NOT NULL DEFAULT now(),
  expires_at timestamp NOT NULL,
  completed_at timestamp,
  dispute_id varchar,
  dispute_status varchar
);

CREATE INDEX IF NOT EXISTS idx_research_trades_status_created
  ON research_trades(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_trades_initiator
  ON research_trades(initiator_id, status);
CREATE INDEX IF NOT EXISTS idx_research_trades_recipient
  ON research_trades(recipient_id, status);

CREATE TABLE IF NOT EXISTS research_trade_ratings (
  id varchar PRIMARY KEY,
  rater_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trade_id varchar,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_trade_ratings_target
  ON research_trade_ratings(target_id, created_at DESC);

CREATE TABLE IF NOT EXISTS research_trade_blocks (
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (player_id, blocked_player_id)
);

CREATE TABLE IF NOT EXISTS research_trade_disputes (
  id varchar PRIMARY KEY,
  trade_id varchar NOT NULL,
  opened_by varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status varchar NOT NULL DEFAULT 'pending',
  resolution text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_trade_disputes_trade
  ON research_trade_disputes(trade_id, status);

CREATE TABLE IF NOT EXISTS game_assets (
  id varchar PRIMARY KEY,
  asset_key varchar NOT NULL UNIQUE,
  category varchar NOT NULL,
  name varchar NOT NULL,
  mime_type varchar,
  uri text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by varchar REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_asset_bundles (
  id varchar PRIMARY KEY,
  bundle_key varchar NOT NULL UNIQUE,
  name varchar NOT NULL,
  description text,
  version varchar NOT NULL DEFAULT '1.0.0',
  manifest jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_asset_bundle_items (
  bundle_id varchar NOT NULL REFERENCES game_asset_bundles(id) ON DELETE CASCADE,
  asset_id varchar NOT NULL REFERENCES game_assets(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_id, asset_id)
);

CREATE TABLE IF NOT EXISTS player_trade_profiles (
  player_id varchar PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  trust_score integer NOT NULL DEFAULT 50,
  fairness_score integer NOT NULL DEFAULT 50,
  completed_trades integer NOT NULL DEFAULT 0,
  disputes_opened integer NOT NULL DEFAULT 0,
  disputes_lost integer NOT NULL DEFAULT 0,
  is_blacklisted boolean NOT NULL DEFAULT false,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS custom_labs (
  id varchar PRIMARY KEY,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  specialization varchar NOT NULL,
  level integer NOT NULL DEFAULT 1,
  durability integer NOT NULL DEFAULT 100,
  modifiers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_achievement_profiles (
  user_id varchar PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points integer NOT NULL DEFAULT 0,
  achievements jsonb NOT NULL DEFAULT '{}'::jsonb,
  badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  tech_count integer NOT NULL DEFAULT 0,
  discovery_count integer NOT NULL DEFAULT 0,
  current_level integer NOT NULL DEFAULT 1,
  specialization_progress jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_alliances (
  id varchar PRIMARY KEY,
  name varchar NOT NULL,
  faction varchar NOT NULL,
  leader_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_alliance_members (
  alliance_id varchar NOT NULL REFERENCES research_alliances(id) ON DELETE CASCADE,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar NOT NULL DEFAULT 'member',
  joined_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (alliance_id, user_id)
);

CREATE TABLE IF NOT EXISTS research_alliance_pools (
  alliance_id varchar PRIMARY KEY REFERENCES research_alliances(id) ON DELETE CASCADE,
  metals bigint NOT NULL DEFAULT 0,
  credits bigint NOT NULL DEFAULT 0,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS multiplayer_research_bonuses (
  id varchar PRIMARY KEY,
  source_user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bonus_type varchar NOT NULL,
  multiplier numeric(8,4) NOT NULL DEFAULT 1,
  expires_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_multiplayer_research_bonuses_target
  ON multiplayer_research_bonuses(target_user_id, bonus_type);

COMMIT;
