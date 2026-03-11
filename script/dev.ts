import { spawn } from "node:child_process";
import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const projectRoot = resolve(currentDir, "..");

// Always resolve .env relative to the nested project root, then fallback to cwd.
config({ path: resolve(projectRoot, ".env") });
config();

// Manually set DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
  const neonUrl = "postgresql://neondb_owner:npg_roX60HeYZbxW@ep-bitter-cloud-ad1d57rw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  process.env.DATABASE_URL = neonUrl;
  console.log("Set DATABASE_URL from hardcoded value");
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0);
const nodeEnv = process.env.NODE_ENV ?? "development";

const command = "npx vite dev --port 5001";

if (hasDatabaseUrl) {
  console.log("Starting full-stack development server...");
} else {
  console.log("DATABASE_URL not found. Starting client-only dev server.");
  console.log("Set DATABASE_URL to run backend + API routes.");
}

const child = spawn(command, {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: nodeEnv,
    DATABASE_URL: process.env.DATABASE_URL || "",
  },
});

child.on("exit", (code: number | null) => {
  process.exit(code ?? 0);
});

child.on("error", (error: Error) => {
  console.error("Failed to start development process:", error);
  process.exit(1);
});
