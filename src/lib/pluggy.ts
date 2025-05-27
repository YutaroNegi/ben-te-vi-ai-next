import { PluggyClient } from "pluggy-sdk";

const clientId = process.env.PLUGGY_CLIENT_ID;
const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error(
    "Defina PLUGGY_CLIENT_ID e PLUGGY_CLIENT_SECRET no .env.* do Next.js",
  );
}

export const pluggyClient = new PluggyClient({ clientId, clientSecret });

const SAFETY_WINDOW_MS = 5 * 60 * 1000;
let cache: { apiKey: string; expiresAt: number } | null = null;

export async function getPluggyApiKey(): Promise<string> {
  // Se ainda vale por > 5 min, devolve do cache
  if (cache && cache.expiresAt - Date.now() > SAFETY_WINDOW_MS) {
    return cache.apiKey;
  }

  const res = await fetch("https://api.pluggy.ai/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, clientSecret }),
  });

  if (!res.ok) {
    throw new Error(`Pluggy /auth → ${res.status}`);
  }

  const { apiKey, expiresAt } = (await res.json()) as {
    apiKey: string;
    expiresAt: string;
  };

  cache = {
    apiKey,
    expiresAt: new Date(expiresAt).getTime(),
  };

  return apiKey;
}
