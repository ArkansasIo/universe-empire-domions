// Admin Configuration - System administration, controls, and settings
export const ADMIN_CONFIG = {
  // Admin roles and permissions
  roles: {
    superAdmin: {
      name: "Super Administrator",
      permissions: [
        "manage_users",
        "manage_admins",
        "manage_servers",
        "view_logs",
        "manage_settings",
        "ban_players",
        "modify_economy",
        "access_database",
        "manage_events",
        "manage_alliances",
        "reset_players",
        "view_analytics",
      ],
    },
    moderator: {
      name: "Moderator",
      permissions: [
        "ban_players",
        "view_logs",
        "manage_events",
        "manage_alliances",
        "view_analytics",
      ],
    },
    technician: {
      name: "Technician",
      permissions: [
        "manage_servers",
        "view_logs",
        "access_database",
        "manage_settings",
      ],
    },
  },

  // System controls
  systemControls: {
    maintenanceMode: {
      enabled: false,
      message: "Server is undergoing maintenance. Please try again later.",
      allowAdminAccess: true,
    },
    pvpMode: {
      enabled: true,
      warZonesOnly: false,
    },
    spamProtection: {
      enabled: true,
      maxMessagesPerMinute: 5,
      maxBuildingsPerMinute: 3,
    },
    eventSystem: {
      enabled: true,
      activeEvents: [],
      eventRewardMultiplier: 1.0,
    },
  },

  // Economy controls
  economyControls: {
    resourceMultiplier: 1.0,
    buildTimeMultiplier: 1.0,
    researchTimeMultiplier: 1.0,
    fleetSpeedMultiplier: 1.0,
    marketTaxRate: 0.02, // 2%
    maxPlayerResources: 999999999, // Soft cap
  },

  // Player management
  playerManagement: {
    maxPlayersPerAccount: 1,
    autoDeleteInactiveAfterDays: 90,
    wipePlayerDataOnBan: true,
    maxBanDurationDays: 365,
    allowMultiAccounting: false,
  },

  // Logging and auditing
  logging: {
    enableAdminActionLog: true,
    enablePlayerActivityLog: true,
    enableDatabaseLog: true,
    logRetentionDays: 90,
    enableDetailedCombatLogs: true,
  },

  // Penalties and sanctions
  penalties: {
    chatMuteMinutes: 60,
    kickoutSeconds: 30,
    tempBanDays: 7,
    permBanReason: "Severe violation of Terms of Service",
    autoReportThreshold: 5, // Auto-mute after 5 reports
  },

  // API rate limiting for admin actions
  rateLimiting: {
    adminAPILimits: 1000, // requests per hour
    playerAPILimits: 100, // requests per hour
    globalBandwidthLimit: "10GB", // per hour
  },

  // Backup and recovery
  backup: {
    autoBackupEnabled: true,
    backupIntervalHours: 6,
    backupRetentionDays: 30,
    backupLocation: "/backups",
  },

  // Database management
  database: {
    enableQueryLogging: false,
    slowQueryThresholdMs: 1000,
    maxConnections: 50,
    connectionPoolSize: 20,
  },

  // Alert thresholds
  alerts: {
    highCPUThreshold: 80,
    highMemoryThreshold: 85,
    highDatabaseLatencyMs: 500,
    highErrorRatePercent: 5,
  },

  // Scheduled tasks
  scheduledTasks: {
    dailyReset: "00:00", // UTC
    weeklyMaintenance: "Sunday 02:00",
    monthlyCleanup: "1st of month 03:00",
    seasonalEvents: [],
  },
};
