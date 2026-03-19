
import { createClient } from "@blinkdotnew/sdk";

const projectId = import.meta.env.VITE_BLINK_PROJECT_ID;
const publishableKey = import.meta.env.VITE_BLINK_PUBLISHABLE_KEY;

export const isBlinkConfigured = Boolean(projectId && publishableKey);

export const blink = isBlinkConfigured
  ? createClient({
      projectId,
      publishableKey,
      auth: { mode: "managed" },
    })
  : null;

if (!isBlinkConfigured && import.meta.env.DEV) {
  console.warn("[BLINK] VITE_BLINK_PROJECT_ID / VITE_BLINK_PUBLISHABLE_KEY not set; realtime features are disabled.");
}

export default blink;
