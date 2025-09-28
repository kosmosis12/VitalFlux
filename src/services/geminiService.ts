// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getModelName } from "../config/ai";

// ---------- Types ----------
export type WidgetConfig = Record<string, any>;

// ---------- Prompt ----------
function buildPrompt(userMessage: string): string {
  return `
Return ONLY a single JSON object:
{
  "chartType": "line" | "bar" | "pie" | "area" | "scatter",
  "dataOptions": {
    "measures": string[],
    "dimensions": string[],
    "filters": Array<{ field: string, op: string, value: string | number | string[] | number[] }>
  },
  "title": string,
  "color"?: string,
  "notes"?: string
}
No code fences. No prose. User: ${userMessage}`.trim();
}

// ---------- Utilities ----------
function pickJson(text: string): WidgetConfig {
  const match = text?.match?.(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in the AI response.");
  return JSON.parse(match[0]);
}

function normalizeModelName(raw?: string): string {
  const fallback = "gemini-2.5-flash-lite";
  if (!raw) return fallback;

  let v = raw.trim();
  if (v.startsWith("models/")) v = v.slice("models/".length);

  if (v === "gemini-flash-latest") return "gemini-2.5-flash";
  if (v === "gemini-pro-latest") return "gemini-2.5-pro";
  if (v.endsWith("-latest")) return v.replace("-latest", "");
  return v || fallback;
}

// ---------- API key loader ----------
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// ---------- REST fallback ----------
async function restGenerate(prompt: string, model: string, apiKey: string): Promise<WidgetConfig> {
  const m = normalizeModelName(model);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    m
  )}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`REST API Error ${res.status}: ${errText || res.statusText}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
    "";

  if (!text) throw new Error("Empty model response.");
  return pickJson(text);
}

// ---------- Public API ----------
export async function generateWidgetConfig(
  userMessage: string
): Promise<WidgetConfig | { error: string }> {
  console.log(
    "API Key loaded by the service:",
    API_KEY ? `Key starts with "${API_KEY.slice(0, 4)}"` : "API Key is UNDEFINED"
  );

  try {
    if (!API_KEY) return { error: "VITE_GEMINI_API_KEY is not configured." };

    const apiKey: string = API_KEY; // 🔒 narrowed
    const modelName = normalizeModelName(getModelName());
    const prompt = buildPrompt(userMessage);

    try {
      // 🔒 pass a definite string to the SDK
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      // Most SDK versions expose a synchronous text() helper:
      const text = typeof result?.response?.text === "function"
        ? result.response.text()
        : (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");

      if (!text) throw new Error("Empty SDK response.");
      return pickJson(text);
    } catch (sdkErr) {
      console.warn("[geminiService] SDK failed, trying REST v1beta:", sdkErr);
      // 🔒 REST also receives a definite apiKey
      return await restGenerate(prompt, modelName, apiKey);
    }
  } catch (err: any) {
    console.error("[geminiService] Final error:", err);
    return { error: err?.message || "Unexpected error generating widget." };
  }
}

