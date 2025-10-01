import { GoogleGenerativeAI } from "@google/generative-ai";

/** -------- Types for Widget Configuration -------- */
// This list is easily extensible. Add 'area', 'scatter', etc., here to expand capabilities.
export const allowedChartTypes = ["line", "bar", "column", "pie", "indicator"] as const;
export type ChartType = typeof allowedChartTypes[number];

export interface DataOptions {
  category: string[];
  value: string[];
  breakBy?: string[];
  secondary?: string[]; // For indicator charts
}

export interface WidgetConfig {
  chartType: ChartType;
  title: string;
  description?: string;
  dataOptions: DataOptions;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

/** ----------------- Data Model & System Instructions for the AI ----------------- */
const dataModelSchema = `
- vitalflux_adherence_daily_csv: { adherent_flag, condition, patient_id, program, region, date: DateDimension }
- vitalflux_cohort_outcomes_csv: { adherence_pct, condition, readmit_30d_pct, region, month: DateDimension }
- vitalflux_cost_impact_csv: { est_cost_avoidance_usd, program }
- vitalflux_patients_csv: { patient_id, program, risk_band }
- vitalflux_readmissions_csv: { condition, readmitted_within_30d, program }
`;

const systemInstruction = {
    role: "model",
    parts: [{ text: `
You are the VitalFlux Visualization Designer, an AI expert in the Sisense SDK. Your sole task is to generate valid JSON configurations for chart widgets.

**YOU MUST FOLLOW ALL RULES:**
1.  **JSON ONLY:** Your entire response must be ONLY a valid JSON object. Do not include any extra text, comments, or Markdown fences like \`\`\`json.
2.  **SINGLE TABLE RULE:** All fields in a single chart's \`dataOptions\` (category, value, breakBy) MUST come from the same data table.
3.  **DATE DIMENSION RULE:** For fields marked 'DateDimension', you MUST append a granularity. Use '.Days' for a 'date' field and '.Months' for a 'month' field.
4.  **ALLOWED CHART TYPES:** You may only use the following values for \`chartType\`: "${allowedChartTypes.join('", "')}".

**JSON OUTPUT STRUCTURE:**
{
  "chartType": "...",
  "title": "...",
  "dataOptions": {
    "category": ["DM.<table>.<field>[.<Grain>]"],
    "value": ["measureFactory.<agg>(DM.<table>.<field>, 'Label')"],
    "breakBy": ["DM.<table>.<field>"]
  }
}

**FEW-SHOT EXAMPLES:**

User: "Show me the number of patients per program"
Assistant (JSON):
{
  "chartType": "bar",
  "title": "Number of Patients by Program",
  "dataOptions": {
    "category": ["DM.vitalflux_patients_csv.program"],
    "value": ["measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Total Patients')"],
    "breakBy": []
  }
}

User: "daily patient adherence trend"
Assistant (JSON):
{
  "chartType": "line",
  "title": "Daily Patient Adherence Trend",
  "dataOptions": {
    "category": ["DM.vitalflux_adherence_daily_csv.date.Days"],
    "value": ["measureFactory.average(DM.vitalflux_adherence_daily_csv.adherent_flag, 'Adherence Rate')"],
    "breakBy": []
  }
}
`}],
};

/** ----------------- Public API Function ----------------- */
export async function generateWidgetConfig(
  prompt: string
): Promise<WidgetConfig | { error: string }> {
  if (!API_KEY) {
    return { error: "API key is not configured. Please contact an administrator." };
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  // Using the specified gemini-2.5-flash model with the streamlined system instruction
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20", systemInstruction });

  const fullPrompt = `
DATA MODEL SCHEMA:
${dataModelSchema}

---

USER REQUEST:
"${prompt}"
`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const rawText = await response.text();

    const parsed = safeParseJson(rawText);
    if (!parsed) {
      throw new Error("No valid JSON object found in the AI response.");
    }
    
    // Post-process the AI's output to ensure it's valid
    const validated = validateSingleTable(autoFixDateGrains(parsed));

    return validated;
  } catch (error: any) {
    console.error("Error processing Gemini API response:", error);
    return { error: error.message || "The AI returned an invalid response. Please try rephrasing." };
  }
}

/** ----------------- Helper Functions for Validation and Parsing ----------------- */

function safeParseJson(text: string): any | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function autoFixDateGrains(cfg: WidgetConfig): WidgetConfig {
    if (!cfg?.dataOptions) return cfg;
    const fix = (p: string) => p.replace(/(DM\.[\w]+\.date)(?!.)/g, "$1.Days").replace(/(DM\.[\w]+\.month)(?!.)/g, "$1.Months");
    const fixArray = (arr?: string[]) => arr?.map(fix) || [];
    
    cfg.dataOptions.category = fixArray(cfg.dataOptions.category);
    cfg.dataOptions.breakBy = fixArray(cfg.dataOptions.breakBy);
    cfg.dataOptions.value = cfg.dataOptions.value.map(v => v.replace(/(measureFactory\.\w+\()(DM\.[^)]+)(,)/g, (_, start, path, end) => start + fix(path) + end));

    return cfg;
}

function validateSingleTable(cfg: WidgetConfig): WidgetConfig {
    const tables = new Set<string>();
    const collect = (s: string) => {
        const matches = s.matchAll(/DM\.([\w_]+)\./g);
        for (const match of matches) {
            tables.add(match[1]);
        }
    };

    [...(cfg.dataOptions.category || []), ...(cfg.dataOptions.value || []), ...(cfg.dataOptions.breakBy || [])].forEach(collect);

    if (tables.size > 1) {
        throw new Error(`All fields must come from the same table. Found: ${Array.from(tables).join(", ")}`);
    }
    return cfg;
}


