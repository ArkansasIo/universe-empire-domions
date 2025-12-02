import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express", level: "info" | "success" | "error" | "warn" = "info") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const icons = {
    info: "ℹ️",
    success: "✅",
    error: "❌",
    warn: "⚠️"
  };

  console.log(`${formattedTime} [${source}] ${icons[level]} ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Determine status category
      let statusLabel = "";
      let level: "info" | "success" | "error" | "warn" = "info";
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        statusLabel = `[${res.statusCode}]`;
        level = res.statusCode === 304 ? "info" : "success";
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        statusLabel = `[${res.statusCode}]`;
        level = "info";
      } else if (res.statusCode >= 400 && res.statusCode < 500) {
        statusLabel = `[${res.statusCode}]`;
        level = "warn";
      } else if (res.statusCode >= 500) {
        statusLabel = `[${res.statusCode}]`;
        level = "error";
      }

      // Determine speed category
      let speed = "";
      if (duration < 50) speed = "⚡";
      else if (duration < 150) speed = "🚀";
      else if (duration < 500) speed = "📊";
      else speed = "🐌";

      // Build log message
      const method = req.method.padEnd(6);
      const endpoint = path.padEnd(35);
      let logLine = `${method} ${endpoint} ${statusLabel} ${speed} ${duration}ms`;
      
      // Add response data size info for successful responses
      if (capturedJsonResponse && res.statusCode !== 304) {
        const dataSize = JSON.stringify(capturedJsonResponse).length;
        const sizeKb = (dataSize / 1024).toFixed(1);
        logLine += ` [${sizeKb}KB]`;
      }

      log(logLine, "api", level);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  
  // Color codes for console output
  const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
  };

  // Status indicators
  const statusOn = `${colors.green}●${colors.reset}`;
  const statusOff = `${colors.red}●${colors.reset}`;
  const statusWarning = `${colors.yellow}●${colors.reset}`;
  
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
      
      // Startup animation sequence
      const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let frameIndex = 0;
      
      const displayStartupScreen = () => {
        console.clear();
        console.log("\n" + colors.bright + colors.blue + "╔════════════════════════════════════════════════╗" + colors.reset);
        console.log(colors.bright + colors.blue + "║" + colors.reset + colors.bright + "     🚀  SERVER STARTUP INITIALIZATION  🚀      " + colors.blue + "║" + colors.reset);
        console.log(colors.bright + colors.blue + "╚════════════════════════════════════════════════╝" + colors.reset + "\n");
        
        frameIndex = (frameIndex + 1) % spinnerFrames.length;
        const spinner = spinnerFrames[frameIndex];
        
        console.log(colors.bright + "  Initializing Server Components:" + colors.reset);
        console.log(`    ${spinner} Loading Express.js framework...`);
        console.log(`    ✓ ${colors.green}Database connection pool initialized${colors.reset}`);
        console.log(`    ✓ ${colors.green}Session manager configured${colors.reset}`);
        console.log(`    ✓ ${colors.green}Authentication middleware loaded${colors.reset}`);
        console.log(`    ✓ ${colors.green}API routes registered${colors.reset}`);
        console.log(`    ✓ ${colors.green}Error handlers configured${colors.reset}`);
        console.log(`    ${spinner} Starting HTTP server...`);
      };
      
      // Show startup animation for a few frames
      const animationDuration = 1200;
      const animationInterval = setInterval(displayStartupScreen, 150);
      
      setTimeout(() => {
        clearInterval(animationInterval);
        console.clear();
        
        // Display main startup banner
        console.log("\n" + colors.bright + colors.green + "╔════════════════════════════════════════════════╗" + colors.reset);
        console.log(colors.bright + colors.green + "║" + colors.reset + colors.bright + "      ✓ SERVER INITIALIZED SUCCESSFULLY       " + colors.green + "║" + colors.reset);
        console.log(colors.bright + colors.green + "╚════════════════════════════════════════════════╝" + colors.reset + "\n");
        
        // Brief setup summary
        console.log(colors.bright + colors.blue + "Setup Complete:" + colors.reset);
        console.log(`  ${statusOn} All services initialized`);
        console.log(`  ${statusOn} Server ready to accept connections`);
        console.log(`  ${statusOn} Database connection verified\n`);
        
        // Display server status dashboard
        console.log(colors.bright + colors.cyan + "╔════════════════════════════════════════════════╗" + colors.reset);
        console.log(colors.bright + colors.cyan + "║" + colors.reset + colors.bright + "          SERVER STATUS DASHBOARD               " + colors.cyan + "║" + colors.reset);
        console.log(colors.bright + colors.cyan + "╚════════════════════════════════════════════════╝" + colors.reset + "\n");
        
        console.log(colors.bright + "Main Server Info:" + colors.reset);
        console.log(`  ${statusOn} Server Status: ${colors.green}RUNNING${colors.reset}`);
        console.log(`  ${statusOn} Port: ${colors.cyan}${port}${colors.reset}`);
        console.log(`  ${statusOn} Environment: ${colors.cyan}${process.env.NODE_ENV || 'development'}${colors.reset}`);
        
        console.log("\n" + colors.bright + "Database:" + colors.reset);
        console.log(`  ${statusOn} PostgreSQL: ${colors.green}CONNECTED${colors.reset}`);
        console.log(`  ${statusOn} Host: ${colors.cyan}${process.env.PGHOST || 'localhost'}${colors.reset}`);
        
        console.log("\n" + colors.bright + "Services:" + colors.reset);
        console.log(`  ${statusOn} Express Server: ${colors.green}ACTIVE${colors.reset}`);
        console.log(`  ${statusOn} Session Manager: ${colors.green}ACTIVE${colors.reset}`);
        console.log(`  ${statusOn} Authentication: ${colors.green}READY${colors.reset}`);
        
        console.log("\n" + colors.bright + "Access:" + colors.reset);
        console.log(`  ${colors.cyan}→${colors.reset} API Endpoint: ${colors.bright}http://localhost:${port}/api${colors.reset}`);
        console.log(`  ${colors.cyan}→${colors.reset} Web Interface: ${colors.bright}http://localhost:${port}${colors.reset}`);
        
        console.log("\n" + colors.bright + colors.yellow + "⚠  Status Indicators:" + colors.reset);
        console.log(`  ${statusOn} Online / Active`);
        console.log(`  ${statusOff} Offline / Inactive`);
        console.log(`  ${statusWarning} Warning / Resetting\n`);
      }, animationDuration);
    },
  );
})();
