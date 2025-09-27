// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getModelName } from "../config/ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export type WidgetConfig = { [key: string]: any };

function buildPrompt(userMessage: string): string {
  return `Return ONLY a JSON object: { "chartType":"...", "dataOptions":{ "measures":[], "dimensions":[], "filters":[] }, "title":"..." }. User: ${userMessage}`;
}

const pickJson = (text: string): WidgetConfig => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in the model response.");
  return JSON.parse(match[0]);
};

async function restGenerate(prompt: string, model: string): Promise<WidgetConfig> {
  // The REST fallback uses the v1 endpoint, which is more stable.
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`;
  const body = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`REST API Error ${response.status}: ${await response.text()}`);
  }
  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return pickJson(text);
}

export async function generateWidgetConfig(userMessage: string): Promise<WidgetConfig | { error: string }> {
  try {
    if (!API_KEY) return { error: "VITE_GEMINI_API_KEY is not configured." };
    const modelName = getModelName();

    // First, try the standard SDK path.
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(buildPrompt(userMessage));
      return pickJson(result.response.text());
    } catch (sdkError) {
      console.warn("[geminiService] SDK call failed, attempting REST fallback:", sdkError);
      // If the SDK fails, try the direct REST call as a backup.
      return await restGenerate(buildPrompt(userMessage), modelName);
    }
  } catch (err: any) {
    console.error("[geminiService] Final error:", err);
    return { error: err?.message || "An unexpected error occurred." };
  }
}
