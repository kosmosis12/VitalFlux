// src/config/ai.ts
export const ALLOWED = ["gemini-1.5-flash", "gemini-1.5-pro"] as const;
export type AllowedModel = typeof ALLOWED[number];

export function getModelName(): AllowedModel {
  const envModel = (import.meta.env.VITE_GEMINI_MODEL as string) || "gemini-1.5-flash";
  const model = (ALLOWED as readonly string[]).includes(envModel) ? (envModel as AllowedModel) : "gemini-1.5-flash";

  // This log will appear once in your browser console to confirm which model is being used.
  if (typeof window !== "undefined" && !(window as any).__VF_MODEL_LOGGED__) {
    console.info(`[VitalFlux AI] Using model: ${model}`);
    (window as any).__VF_MODEL_LOGGED__ = true;
  }
  
  // This guard prevents the old model from being used accidentally.
  if (/^gemini-pro\b/.test(model)) {
    throw new Error("Blocked legacy model 'gemini-pro'. Use gemini-1.5-*.");
  }

  return model;
}