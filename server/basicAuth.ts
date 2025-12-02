import session from "express-session";
import type { Express, RequestHandler } from "express";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { logger } from "./logger";
import crypto from "crypto";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use in-memory session store to avoid database connection issues
  const SessionStore = MemoryStore(session);
  const sessionStore = new SessionStore({
    checkPeriod: 86400000, // Check for expired sessions every day
  });
  
  const isDevelopment = process.env.NODE_ENV === "development";
  
  return session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow in development
      sameSite: "lax",
      maxAge: sessionTtl,
      path: '/'
    },
  });
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  
  // Add CORS headers to allow credentials
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.get('origin') || 'http://localhost:5000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
  app.use(getSession());

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const passwordHash = hashPassword(password);
      const user = await storage.createUser({
        username,
        passwordHash,
        email: `${username}@stellar.local`,
        firstName: username,
      });

      (req.session as any).userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session creation failed" });
        }
        res.json({ message: "Account created", user: { id: user.id, username: user.username } });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      logger.info("AUTH", `Login attempt for user: ${username}`);

      if (!username || !password) {
        logger.warn("AUTH", "Missing credentials in login request");
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        logger.warn("AUTH", `User not found: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (!user.passwordHash) {
        logger.warn("AUTH", `User has no password hash: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const passwordValid = verifyPassword(password, user.passwordHash);
      
      if (!passwordValid) {
        logger.warn("AUTH", `Invalid password for user: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      logger.info("AUTH", `Login successful for user: ${username}`, { userId: user.id });
      (req.session as any).userId = user.id;
      
      req.session.save((err) => {
        if (err) {
          logger.error("AUTH", "Session save error", {}, err);
          return res.status(500).json({ message: "Login failed" });
        }
        logger.info("AUTH", `Session saved for user: ${username}`);
        res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
      });
    } catch (error) {
      logger.error("AUTH", "Login error", {}, error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { username, email } = req.body;

      if (!username || !email) {
        return res.status(400).json({ message: "Username and email required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.email !== email) {
        return res.status(401).json({ message: "Email does not match account" });
      }

      const temporaryPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const passwordHash = hashPassword(temporaryPassword);
      
      await storage.updateUser(user.id, { passwordHash });
      
      logger.info("AUTH", `Password reset requested for user: ${username}`);
      res.json({ 
        message: "Password has been reset", 
        temporaryPassword: temporaryPassword,
        instructions: "Use the temporary password to login, then change it in your account settings"
      });
    } catch (error) {
      logger.error("AUTH", "Password reset error", {}, error);
      res.status(500).json({ message: "Password reset failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // First try session
  let userId = (req.session as any)?.userId;
  if (userId) {
    logger.info("AUTH", `Session auth successful for userId: ${userId}`);
    return next();
  }
  
  // Fallback to basic auth from Authorization header
  const authHeader = req.get('authorization');
  logger.info("AUTH", `Auth check - header present: ${!!authHeader}`);
  
  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const encoded = authHeader.slice(6);
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const [username, password] = decoded.split(':');
      
      logger.info("AUTH", `Basic auth attempt for user: ${username}`);
      
      if (username && password) {
        const user = await storage.getUserByUsername(username);
        if (user && user.passwordHash) {
          const passwordValid = verifyPassword(password, user.passwordHash);
          if (passwordValid) {
            (req.session as any).userId = user.id;
            logger.info("AUTH", `Basic auth successful for user: ${username}`);
            return next();
          } else {
            logger.warn("AUTH", `Basic auth password invalid for user: ${username}`);
          }
        } else {
          logger.warn("AUTH", `Basic auth user not found or no password hash: ${username}`);
        }
      }
    } catch (err) {
      logger.warn("AUTH", `Basic auth header parse error: ${String(err)}`);
    }
  }
  
  logger.warn("AUTH", `Authentication failed for ${req.path}`);
  res.status(401).json({ message: "Unauthorized" });
};
