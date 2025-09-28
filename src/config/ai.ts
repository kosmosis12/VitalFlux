// src/config/ai.ts

/**
 * Allowed model names (drop the "models/" prefix when using the SDK/REST).
 * Put the cheapest, stable options first.
 */
export const ALLOWED = [
  "gemini-2.5-flash-lite", // cheapest, good for chart titles/captions/config JSON
  "gemini-2.5-flash",      // still inexpensive, stronger reasoning/length
  "gemini-2.0-flash",      // stable 2.0 flash
  "gemini-pro",            // allowed, but not default (costlier)
] as const;

export type AllowedModel = typeof ALLOWED[number];

/**
 * Returns the model VitalFlux should use by default.
 * You can temporarily override at runtime by setting:
 *   (window as any).__vf_model_override__ = "gemini-2.5-flash";
 */
export function getModelName(): AllowedModel {
  const override = (window as any).__vf_model_override__;
  const model: AllowedModel = ALLOWED.includes(override) ? override : ALLOWED[0];

  // One-time log for observability
  if ((window as any).__vf_model_logged__ !== model) {
    console.info(`[VitalFlux AI] Using model: ${model}`);
    (window as any).__vf_model_logged__ = model;
  }
  return model;
}
