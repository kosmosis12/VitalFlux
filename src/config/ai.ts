// src/config/ai.ts
export const FALLBACK_MODEL = "gemini-1.5-flash"; // A safe and fast default

function isAllowed(m?: string): boolean {
  if (!m) return false;
  // This list can be expanded if you get access to more models
  const ok = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
  ];
  return ok.includes(m);
}

/** * Reads the model name from the environment variable if present and allowed, otherwise uses the fallback.
 * It also logs the model name to the console the first time it's called to help with debugging.
 */
export function getModelName(): string {
  const envModel = import.meta.env.VITE_GEMINI_MODEL as string | undefined;
  const model = isAllowed(envModel) ? envModel! : FALLBACK_MODEL;

  // One-time log so you can verify in the DevTools console
  if (typeof window !== "undefined" && !(window as any).__VF_MODEL_LOGGED__) {
    console.info(`[VitalFlux AI] Using model: ${model}`);
    (window as any).__VF_MODEL_LOGGED__ = true;
  }
  return model;
}