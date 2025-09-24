import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not set in your environment variables.");
}

const dataModelSchema = `
// Data model schema here...
export const vitalflux_adherence_daily_csv = { name: 'vitalflux_adherence_daily.csv', adherent_flag: '[...]', condition: '[...]', patient_id: '[...]', program: '[...]', region: '[...]', date: 'DateDimension' };
export const vitalflux_cohort_outcomes_csv = { name: 'vitalflux_cohort_outcomes.csv', adherence_pct: '[...]', condition: '[...]', readmit_30d_pct: '[...]', region: '[...]', month: 'DateDimension' };
export const vitalflux_cost_impact_csv = { name: 'vitalflux_cost_impact.csv', est_cost_avoidance_usd: '[...]', program: '[...]' };
export const vitalflux_patients_csv = { name: 'vitalflux_patients.csv', patient_id: '[...]', program: '[...]', risk_band: '[...]' };
export const vitalflux_readmissions_csv = { name: 'vitalflux_readmissions.csv', condition: '[...]', readmitted_within_30d: '[...]', program: '[...]' };

// Available chart types: 'line', 'bar', 'column', 'pie', 'indicator'.
// IMPORTANT: For any 'DateDimension' field like 'date' or 'month', you must specify a granularity, e.g., 'DM.table.date.Days' or 'DM.table.date.Months'.
`;

export async function generateWidgetConfig(prompt: string): Promise<any> {
  if (!API_KEY) {
    return { error: 'API key is not configured. Please contact an administrator.' };
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fullPrompt = `
    You are an AI assistant for a healthcare analytics app called VitalFlux.
    Your goal is to generate a JSON configuration for a Sisense chart widget based on a user's request.
    You must use the provided data model schema.

    **MOST IMPORTANT RULE**: All dimensions and measures (category, value, breakBy) used in a single chart configuration MUST come from the same data table. For example, you cannot use a category from 'vitalflux_patients_csv' and a value from 'vitalflux_readmissions_csv' in the same chart.

    **Date Dimension RULE**: For any field that is a 'DateDimension', you CANNOT use it directly. You MUST append a granularity level like '.Days' or '.Months'.

    Example 1: User asks for "Show me the number of patients per program".
    Correct JSON output (uses only 'vitalflux_patients_csv'):
    {
      "chartType": "bar",
      "title": "Number of Patients by Program",
      "dataOptions": {
        "category": ["DM.vitalflux_patients_csv.program"],
        "value": ["measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Total Patients')"],
        "breakBy": []
      }
    }

    Example 2: User asks for "daily patient adherence trend".
    Correct JSON output (uses only 'vitalflux_adherence_daily_csv'):
    {
      "chartType": "line",
      "title": "Daily Patient Adherence Trend",
      "dataOptions": {
        "category": ["DM.vitalflux_adherence_daily_csv.date.Days"],
        "value": ["measureFactory.average(DM.vitalflux_adherence_daily_csv.adherent_flag, 'Adherence Rate')"],
        "breakBy": []
      }
    }
    
    DATA MODEL SCHEMA:
    ${dataModelSchema}

    USER REQUEST:
    "${prompt}"

    Your task is to generate ONLY the JSON configuration object. Do not include any other text or markdown formatting.
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = await response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("No valid JSON object found in the AI response.");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error parsing Gemini API response:", error);
    return { error: 'The AI returned an invalid response. Please try rephrasing your question.' };
  }
}