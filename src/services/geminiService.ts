// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
// Using the most standard model as a final diagnostic step.
const MODEL_NAME = "gemini-pro";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };
export type WidgetConfig = { [k: string]: JsonValue };

function buildPrompt(userMessage: string): string {
  // A simplified and direct prompt for maximum reliability
  return `
You are the VitalFlux AI Assistant. Return ONLY a single JSON object that describes a chart/widget config
for our React front end. Do not include markdown or prose.

Minimum shape:
{
  "chartType": "line" | "bar" | "pie" | "area" | "scatter",
  "dataOptions": {
    "measures": string[],
    "dimensions": string[],
    "filters": Array<{ field: string, op: string, value: any }>
  },
  "title": string,
  "notes"?: string
}

Strictly output valid JSON. Do not wrap in code fences.
User request: ${userMessage}
`;
}

function extractFirstJsonObject(text: string): WidgetConfig {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in the model response.");
  return JSON.parse(match[0]);
}

export async function generateWidgetConfig(userMessage: string): Promise<WidgetConfig | { error: string }> {
  try {
    if (!API_KEY) {
      return { error: "VITE_GEMINI_API_KEY is not configured." };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = buildPrompt(userMessage);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const json = extractFirstJsonObject(text);

    if (!json || typeof json !== "object" || !("chartType" in json)) {
      return { error: "The AI response did not contain a valid widget config." };
    }
    return json;
  } catch (err: any) {
    console.error("[geminiService] Error:", err);
    return { error: err?.message || "An unexpected error occurred." };
  }
}
