import { GoogleGenerativeAI } from "@google/generative-ai";

/** -------- Types for Widget Configuration -------- */
// Expanded chart types for comprehensive data visualization
export const allowedChartTypes = [
  "line",
  "bar",
  "column",
  "pie",
  "area",
  "scatter",
  "indicator",
  "funnel",
  "treemap",
  "heatmap",
  "boxplot",
  "polar",
] as const;

export type ChartType = typeof allowedChartTypes[number];

export interface DataOptions {
  category: string[];
  value: string[];
  breakBy?: string[];
  secondary?: string[]; // For dual-axis charts, indicators, and scatter plots
  size?: string[]; // For bubble charts and scatter plots
  color?: string[]; // For heatmaps and advanced visualizations
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
DATA MODEL TABLES:
- vitalflux_adherence_daily_csv: { adherent_flag, condition, patient_id, program, region, date: DateDimension }
- vitalflux_cohort_outcomes_csv: { adherence_pct, condition, readmit_30d_pct, region, month: DateDimension }
- vitalflux_cost_impact_csv: { est_cost_avoidance_usd, program }
- vitalflux_patients_csv: { patient_id, program, risk_band }
- vitalflux_readmissions_csv: { condition, readmitted_within_30d, program }
`;

const systemInstruction = {
  role: "model",
  parts: [
    {
      text: `You are the VitalFlux Visualization Designer, an AI expert in the Sisense SDK. Your sole task is to generate valid JSON configurations for chart widgets.

**CRITICAL RULES - MUST FOLLOW ALL:**

1. **JSON ONLY:** Your entire response must be ONLY a valid JSON object. No extra text, comments, or Markdown fences like \`\`\`json.

2. **SINGLE TABLE RULE:** All fields in a single chart's \`dataOptions\` (category, value, breakBy, secondary, size, color) MUST come from the same data table. Never mix fields from different tables.

3. **DATE DIMENSION RULE:** 
   - For 'date' fields: MUST append '.Days' (e.g., "DM.vitalflux_adherence_daily_csv.date.Days")
   - For 'month' fields: MUST append '.Months' (e.g., "DM.vitalflux_cohort_outcomes_csv.month.Months")

4. **ALLOWED CHART TYPES:** Only use: ${allowedChartTypes.join(", ")}

5. **MEASURE FACTORY SYNTAX:** Use proper aggregation functions:
   - measureFactory.count(field, 'Label')
   - measureFactory.sum(field, 'Label')
   - measureFactory.average(field, 'Label')
   - measureFactory.min(field, 'Label')
   - measureFactory.max(field, 'Label')

6. **CHART TYPE SELECTION GUIDE:**
   - **line/area:** Time series, trends over time
   - **bar/column:** Comparisons across categories
   - **pie:** Part-to-whole relationships (use sparingly)
   - **scatter:** Relationships between two numeric variables
   - **indicator:** Single KPI or metric
   - **funnel:** Conversion or sequential stages
   - **treemap:** Hierarchical data with proportions
   - **heatmap:** Correlation or intensity across two dimensions
   - **boxplot:** Statistical distribution
   - **polar:** Cyclical or radial data

**JSON OUTPUT STRUCTURE:**
{
  "chartType": "...",
  "title": "...",
  "description": "Optional brief explanation",
  "dataOptions": {
    "category": ["DM.<table>.<field>[.<Grain>]"],
    "value": ["measureFactory.<agg>(DM.<table>.<field>, 'Label')"],
    "breakBy": ["DM.<table>.<field>"],
    "secondary": ["measureFactory.<agg>(DM.<table>.<field>, 'Label')"],
    "size": ["measureFactory.<agg>(DM.<table>.<field>, 'Label')"],
    "color": ["DM.<table>.<field>"]
  }
}

**COMPREHENSIVE EXAMPLES:**

USER: "Show me the number of patients per program"
ASSISTANT:
{
  "chartType": "bar",
  "title": "Number of Patients by Program",
  "dataOptions": {
    "category": ["DM.vitalflux_patients_csv.program"],
    "value": ["measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Total Patients')"]
  }
}

USER: "daily patient adherence trend"
ASSISTANT:
{
  "chartType": "line",
  "title": "Daily Patient Adherence Trend",
  "dataOptions": {
    "category": ["DM.vitalflux_adherence_daily_csv.date.Days"],
    "value": ["measureFactory.average(DM.vitalflux_adherence_daily_csv.adherent_flag, 'Adherence Rate')"]
  }
}

USER: "area chart showing adherence over time by condition"
ASSISTANT:
{
  "chartType": "area",
  "title": "Adherence Trends by Condition",
  "description": "Stacked area showing adherence patterns across conditions over time",
  "dataOptions": {
    "category": ["DM.vitalflux_adherence_daily_csv.date.Days"],
    "value": ["measureFactory.average(DM.vitalflux_adherence_daily_csv.adherent_flag, 'Adherence Rate')"],
    "breakBy": ["DM.vitalflux_adherence_daily_csv.condition"]
  }
}

USER: "scatter plot of adherence vs readmission rates"
ASSISTANT:
{
  "chartType": "scatter",
  "title": "Adherence vs Readmission Correlation",
  "description": "Relationship between adherence percentage and 30-day readmission rates",
  "dataOptions": {
    "category": ["DM.vitalflux_cohort_outcomes_csv.region"],
    "value": ["measureFactory.average(DM.vitalflux_cohort_outcomes_csv.adherence_pct, 'Adherence %')"],
    "secondary": ["measureFactory.average(DM.vitalflux_cohort_outcomes_csv.readmit_30d_pct, 'Readmission %')"]
  }
}

USER: "total cost avoidance indicator"
ASSISTANT:
{
  "chartType": "indicator",
  "title": "Total Cost Avoidance",
  "description": "Cumulative estimated cost savings across all programs",
  "dataOptions": {
    "category": [],
    "value": ["measureFactory.sum(DM.vitalflux_cost_impact_csv.est_cost_avoidance_usd, 'Total Cost Avoidance ($)')"]
  }
}

USER: "pie chart of patients by risk band"
ASSISTANT:
{
  "chartType": "pie",
  "title": "Patient Distribution by Risk Band",
  "dataOptions": {
    "category": ["DM.vitalflux_patients_csv.risk_band"],
    "value": ["measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Patient Count')"]
  }
}

USER: "heatmap of adherence by region and condition"
ASSISTANT:
{
  "chartType": "heatmap",
  "title": "Adherence Heatmap: Region vs Condition",
  "description": "Color-coded adherence rates across regions and conditions",
  "dataOptions": {
    "category": ["DM.vitalflux_adherence_daily_csv.region"],
    "value": ["measureFactory.average(DM.vitalflux_adherence_daily_csv.adherent_flag, 'Adherence Rate')"],
    "breakBy": ["DM.vitalflux_adherence_daily_csv.condition"]
  }
}

USER: "column chart comparing programs"
ASSISTANT:
{
  "chartType": "column",
  "title": "Cost Avoidance by Program",
  "dataOptions": {
    "category": ["DM.vitalflux_cost_impact_csv.program"],
    "value": ["measureFactory.sum(DM.vitalflux_cost_impact_csv.est_cost_avoidance_usd, 'Cost Avoidance ($)')"]
  }
}

**REMEMBER:** Always choose the most appropriate chart type for the data and user intent. Use temporal charts (line/area) for time series, categorical charts (bar/column/pie) for comparisons, and specialized charts (scatter/heatmap) for relationships.`,
    },
  ],
};

/** ----------------- Public API Function ----------------- */
export async function generateWidgetConfig(
  prompt: string
): Promise<WidgetConfig | { error: string }> {
  if (!API_KEY) {
    return {
      error:
        "API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.",
    };
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    systemInstruction,
  });

  const fullPrompt = `
${dataModelSchema}

---

USER REQUEST:
"${prompt}"

---

INSTRUCTIONS:
Generate a JSON configuration for a Sisense widget that best visualizes this request.
Consider the data types, user intent, and appropriate chart type.
Ensure all fields come from the same table and date fields have proper granularity.
`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const rawText = await response.text();

    const parsed = safeParseJson(rawText);
    if (!parsed) {
      throw new Error(
        "No valid JSON object found in the AI response. The model may have returned text instead of JSON."
      );
    }

    // Validate chart type
    if (!allowedChartTypes.includes(parsed.chartType)) {
      throw new Error(
        `Invalid chart type: ${parsed.chartType}. Must be one of: ${allowedChartTypes.join(", ")}`
      );
    }

    // Post-process: auto-fix date grains and validate single table rule
    const validated = validateSingleTable(autoFixDateGrains(parsed));

    return validated;
  } catch (error: any) {
    console.error("Error processing Gemini API response:", error);
    return {
      error:
        error.message ||
        "The AI returned an invalid response. Please try rephrasing your request.",
    };
  }
}

/** ----------------- Helper Functions for Validation and Parsing ----------------- */

/**
 * Extracts the first valid JSON object from the AI response text
 */
function safeParseJson(text: string): any | null {
  // Remove markdown code fences if present
  const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");

  // Try to find JSON object
  const match = cleanText.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("JSON parsing failed:", e);
    return null;
  }
}

/**
 * Automatically appends .Days or .Months to date/month fields that are missing granularity
 */
function autoFixDateGrains(cfg: WidgetConfig): WidgetConfig {
  if (!cfg?.dataOptions) return cfg;

  const fix = (path: string) =>
    path
      .replace(/(DM\.[\w_]+\.date)(?!\.)/g, "$1.Days")
      .replace(/(DM\.[\w_]+\.month)(?!\.)/g, "$1.Months");

  const fixArray = (arr?: string[]) => arr?.map(fix) || [];

  cfg.dataOptions.category = fixArray(cfg.dataOptions.category);
  cfg.dataOptions.breakBy = fixArray(cfg.dataOptions.breakBy);
  cfg.dataOptions.secondary = fixArray(cfg.dataOptions.secondary);
  cfg.dataOptions.size = fixArray(cfg.dataOptions.size);
  cfg.dataOptions.color = fixArray(cfg.dataOptions.color);

  // Fix date fields within measure factory calls
  cfg.dataOptions.value = cfg.dataOptions.value.map((v) =>
    v.replace(
      /(measureFactory\.\w+\()(DM\.[^)]+)(,)/g,
      (_, start, path, end) => start + fix(path) + end
    )
  );

  return cfg;
}

/**
 * Validates that all fields in the widget configuration come from the same table
 */
function validateSingleTable(cfg: WidgetConfig): WidgetConfig {
  const tables = new Set<string>();

  const collect = (s: string) => {
    const matches = s.matchAll(/DM\.([\w_]+)\./g);
    for (const match of matches) {
      tables.add(match[1]);
    }
  };

  // Collect all table references from all data option fields
  [
    ...(cfg.dataOptions.category || []),
    ...(cfg.dataOptions.value || []),
    ...(cfg.dataOptions.breakBy || []),
    ...(cfg.dataOptions.secondary || []),
    ...(cfg.dataOptions.size || []),
    ...(cfg.dataOptions.color || []),
  ].forEach(collect);

  if (tables.size > 1) {
    throw new Error(
      `Single table rule violation: All fields must come from the same table. Found tables: ${Array.from(tables).join(", ")}. Please ensure your request uses data from only one table.`
    );
  }

  return cfg;
}

/**
 * Validates the structure of a widget configuration
 */
export function isValidWidgetConfig(obj: any): obj is WidgetConfig {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.chartType === "string" &&
    allowedChartTypes.includes(obj.chartType) &&
    typeof obj.title === "string" &&
    obj.dataOptions &&
    Array.isArray(obj.dataOptions.category) &&
    Array.isArray(obj.dataOptions.value)
  );
}

