// src/config/ai.ts

/**
 * Allowed model names (without the "models/" prefix).
 * Cheapest stable options first.
 */
export const ALLOWED = [
  "gemini-2.5-flash-lite", // default: cheapest, great for chart JSON + titles
  "gemini-2.5-flash",      // step up in quality/length, still inexpensive
  "gemini-2.0-flash",      // older stable flash
  "gemini-pro",            // allowed but not preferred (usually pricier)
] as const;

export type AllowedModel = typeof ALLOWED[number];

/**
 * Optional: set a model override at runtime.
 * Usage from DevTools: window.__vf_model_override__ = "gemini-2.5-flash";
 */
declare global {
  interface Window {
    __vf_model_override__?: AllowedModel;
    __vf_model_logged__?: string;
  }
}

/**
 * Returns the model the app should use.
 *  - Respects a runtime override (if present)
 *  - Falls back to the first allowed model (cheapest)
 *  - Logs once for visibility
 */
export function getModelName(): AllowedModel {
  const override = typeof window !== "undefined" ? window.__vf_model_override__ : undefined;
  const model: AllowedModel = (override && (ALLOWED as readonly string[]).includes(override))
    ? override
    : ALLOWED[0];

  if (typeof window !== "undefined" && window.__vf_model_logged__ !== model) {
    console.info(`[VitalFlux AI] Using model: ${model}`);
    window.__vf_model_logged__ = model;
  }

  return model;
}

/**
 * Helper to set an override programmatically (optional).
 * Example: setModelOverride("gemini-2.5-flash")
 */
export function setModelOverride(m?: AllowedModel) {
  if (typeof window === "undefined") return;
  if (!m) {
    delete window.__vf_model_override__;
    return;
  }
  if ((ALLOWED as readonly string[]).includes(m)) {
    window.__vf_model_override__ = m;
    console.info(`[VitalFlux AI] Model override set: ${m}`);
  } else {
    console.warn(`[VitalFlux AI] Ignored invalid model override: ${m}`);
  }
}
