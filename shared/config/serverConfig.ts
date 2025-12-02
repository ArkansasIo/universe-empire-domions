/**
 * Server Configuration Management System
 * Comprehensive configuration for Stellar Dominion server operations
 */

// Server Status Types
export type ServerStatus = 'online' | 'degraded' | 'maintenance' | 'offline';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// System Resource Metrics
export interface SystemMetrics {
  uptime: number; // milliseconds
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  memoryMB: number;
  memoryTotalMB: number;
  dbConnections: number;
  dbMaxConnections: number;
  dbSize: string;
  activeUsers: number;
  requestsPerSecond: number;
  averageResponseTime: number; // milliseconds
  lastUpdated: number; // timestamp
}

// Server Configuration Categories
export interface ServerConfig {
  // Basic Server Settings
  server: {
    status: ServerStatus;
    name: string;
    version: string;
    region: string;
    environment: 'development' | 'production' | 'staging';
    port: number;
    maxConnections: number;
    requestTimeout: number; // seconds
    enableCORS: boolean;
    corsOrigins: string[];
  };

  // Database Configuration
  database: {
    provider: 'postgresql' | 'mysql' | 'mongodb';
    connectionPoolSize: number;
    maxIdleConnections: number;
    idleTimeout: number; // seconds
    connectionTimeout: number; // seconds
    queryTimeout: number; // seconds
    enableLogging: boolean;
    logLevel: LogLevel;
    autoBackup: boolean;
    backupInterval: number; // hours
    backupRetention: number; // days
  };

  // Authentication & Security
  security: {
    jwtSecret: string;
    jwtExpiration: number; // seconds
    sessionTimeout: number; // seconds
    passwordMinLength: number;
    passwordRequireNumbers: boolean;
    passwordRequireSpecial: boolean;
    passwordRequireUppercase: boolean;
    mfaEnabled: boolean;
    bruteForceProtection: boolean;
    maxLoginAttempts: number;
    loginAttemptWindow: number; // seconds
    rateLimitPerMinute: number;
    rateLimitPerHour: number;
    enableIPWhitelist: boolean;
    ipWhitelist: string[];
  };

  // Caching Configuration
  cache: {
    enabled: boolean;
    provider: 'redis' | 'memory';
    ttl: number; // seconds
    maxSize: number; // MB
    enableCompression: boolean;
    compressionLevel: number; // 1-9
  };

  // Logging & Monitoring
  logging: {
    level: LogLevel;
    enableFileLogging: boolean;
    logDirectory: string;
    maxLogSize: number; // MB
    logRetention: number; // days
    enableStructuredLogging: boolean;
    enableCloudLogging: boolean;
    cloudProvider: string;
  };

  // Feature Toggles & Flags
  features: {
    enableApiV1: boolean;
    enableApiV2: boolean;
    enableWebSockets: boolean;
    enableRealTimeNotifications: boolean;
    enableAnalytics: boolean;
    enableAuditLogging: boolean;
    enableBeta: boolean;
    betaUsers: string[];
  };

  // Performance Tuning
  performance: {
    enableQueryCaching: boolean;
    enableResponseCompression: boolean;
    compressionThreshold: number; // bytes
    enableAsyncProcessing: boolean;
    workerThreads: number;
    maxQueueSize: number;
    batchProcessingSize: number;
  };

  // Game-Specific Settings
  gameRules: {
    turnsPerMinute: number;
    resourceProductionMultiplier: number;
    researchSpeedMultiplier: number;
    combatEnabled: boolean;
    alliancesEnabled: boolean;
    tradingEnabled: boolean;
    auctionEnabled: boolean;
    pvpEnabled: boolean;
    pvpStartLevel: number;
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
}

// Default Server Configuration
export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  server: {
    status: 'online',
    name: 'Stellar Dominion',
    version: '1.0.0',
    region: 'US-East',
    environment: 'production',
    port: 3000,
    maxConnections: 10000,
    requestTimeout: 30,
    enableCORS: true,
    corsOrigins: ['https://stellardominion.com', 'https://www.stellardominion.com'],
  },

  database: {
    provider: 'postgresql',
    connectionPoolSize: 20,
    maxIdleConnections: 5,
    idleTimeout: 300,
    connectionTimeout: 10,
    queryTimeout: 30,
    enableLogging: false,
    logLevel: 'info',
    autoBackup: true,
    backupInterval: 24,
    backupRetention: 30,
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    jwtExpiration: 604800, // 7 days
    sessionTimeout: 86400, // 24 hours
    passwordMinLength: 8,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    passwordRequireUppercase: true,
    mfaEnabled: false,
    bruteForceProtection: true,
    maxLoginAttempts: 5,
    loginAttemptWindow: 900, // 15 minutes
    rateLimitPerMinute: 60,
    rateLimitPerHour: 1000,
    enableIPWhitelist: false,
    ipWhitelist: [],
  },

  cache: {
    enabled: true,
    provider: 'memory',
    ttl: 3600,
    maxSize: 512,
    enableCompression: true,
    compressionLevel: 6,
  },

  logging: {
    level: 'info',
    enableFileLogging: true,
    logDirectory: './logs',
    maxLogSize: 100,
    logRetention: 30,
    enableStructuredLogging: true,
    enableCloudLogging: false,
    cloudProvider: 'datadog',
  },

  features: {
    enableApiV1: true,
    enableApiV2: true,
    enableWebSockets: true,
    enableRealTimeNotifications: true,
    enableAnalytics: true,
    enableAuditLogging: true,
    enableBeta: false,
    betaUsers: [],
  },

  performance: {
    enableQueryCaching: true,
    enableResponseCompression: true,
    compressionThreshold: 1024,
    enableAsyncProcessing: true,
    workerThreads: 4,
    maxQueueSize: 1000,
    batchProcessingSize: 100,
  },

  gameRules: {
    turnsPerMinute: 6,
    resourceProductionMultiplier: 1.0,
    researchSpeedMultiplier: 1.0,
    combatEnabled: true,
    alliancesEnabled: true,
    tradingEnabled: true,
    auctionEnabled: true,
    pvpEnabled: true,
    pvpStartLevel: 5,
    maintenanceMode: false,
    maintenanceMessage: '',
  },
};

// Configuration Validator
export class ConfigValidator {
  static validate(config: Partial<ServerConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate server config
    if (config.server) {
      if (config.server.port < 1 || config.server.port > 65535) {
        errors.push('Invalid port number (1-65535)');
      }
      if (config.server.maxConnections < 1) {
        errors.push('Max connections must be at least 1');
      }
    }

    // Validate security config
    if (config.security) {
      if (config.security.passwordMinLength < 4) {
        errors.push('Password minimum length must be at least 4');
      }
      if (config.security.maxLoginAttempts < 1) {
        errors.push('Max login attempts must be at least 1');
      }
    }

    // Validate performance config
    if (config.performance) {
      if (config.performance.workerThreads < 1) {
        errors.push('Worker threads must be at least 1');
      }
      if (config.performance.batchProcessingSize < 1) {
        errors.push('Batch processing size must be at least 1');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Configuration Manager
export class ConfigManager {
  private static instance: ConfigManager;
  private config: ServerConfig = DEFAULT_SERVER_CONFIG;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getConfig(): ServerConfig {
    return this.config;
  }

  updateConfig(updates: Partial<ServerConfig>): void {
    const validation = ConfigValidator.validate(updates);
    if (!validation.valid) {
      throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
    }
    this.config = {
      ...this.config,
      ...updates,
    };
  }

  getSection<K extends keyof ServerConfig>(section: K): ServerConfig[K] {
    return this.config[section];
  }

  updateSection<K extends keyof ServerConfig>(section: K, updates: Partial<ServerConfig[K]>): void {
    this.config[section] = {
      ...this.config[section],
      ...updates,
    };
  }

  reset(): void {
    this.config = DEFAULT_SERVER_CONFIG;
  }
}
