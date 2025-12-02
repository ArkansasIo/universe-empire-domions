-- Admin System Schema
-- Tables for administrative control, logging, and configuration

-- Admin users with roles and permissions
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL DEFAULT 'moderator',
  permissions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Admin action logs (audit trail)
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR NOT NULL,
  target_user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  details JSONB,
  ip_address VARCHAR,
  status VARCHAR DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);

-- Player bans and sanctions
CREATE TABLE IF NOT EXISTS player_sanctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  sanction_type VARCHAR NOT NULL,
  reason VARCHAR NOT NULL,
  ban_duration_days INTEGER,
  is_permanent BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  lifted_at TIMESTAMP,
  lifted_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sanctions_user_id ON player_sanctions(user_id);
CREATE INDEX idx_sanctions_expires_at ON player_sanctions(expires_at);
CREATE INDEX idx_sanctions_active ON player_sanctions(lifted_at) WHERE lifted_at IS NULL;

-- System configuration and settings
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description VARCHAR,
  modified_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_settings_key ON admin_settings(setting_key);

-- Server events and announcements
CREATE TABLE IF NOT EXISTS server_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  event_start TIMESTAMP NOT NULL,
  event_end TIMESTAMP,
  reward_multiplier REAL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_active ON server_events(is_active);
CREATE INDEX idx_events_dates ON server_events(event_start, event_end);

-- Server announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR DEFAULT 'normal',
  is_active BOOLEAN DEFAULT true,
  created_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_announcements_active ON announcements(is_active);

-- System health and monitoring
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type VARCHAR NOT NULL,
  metric_value REAL NOT NULL,
  additional_data JSONB,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_metrics_type ON system_metrics(metric_type);
CREATE INDEX idx_metrics_recorded_at ON system_metrics(recorded_at);

-- Database backups log
CREATE TABLE IF NOT EXISTS backup_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name VARCHAR NOT NULL,
  backup_size_mb REAL,
  backup_location VARCHAR,
  backup_type VARCHAR,
  status VARCHAR DEFAULT 'pending',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_backup_status ON backup_log(status);
CREATE INDEX idx_backup_created_at ON backup_log(created_at);

-- Economy adjustments and modifications
CREATE TABLE IF NOT EXISTS economy_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_type VARCHAR NOT NULL,
  multiplier REAL NOT NULL DEFAULT 1.0,
  target VARCHAR,
  reason VARCHAR,
  applied_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_adjustments_active ON economy_adjustments(active);
CREATE INDEX idx_adjustments_type ON economy_adjustments(adjustment_type);

-- Support tickets system
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR DEFAULT 'open',
  priority VARCHAR DEFAULT 'normal',
  assigned_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  response_text TEXT,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_assigned_admin ON support_tickets(assigned_admin_id);
