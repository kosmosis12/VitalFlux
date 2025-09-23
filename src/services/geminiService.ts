import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const dataModelSchema = `
// Data model schema here...
export const vitalflux_adherence_daily_csv = { name: 'vitalflux_adherence_daily.csv', adherent_flag: '[...]', condition: '[...]', patient_id: '[...]', program: '[...]', region: '[...]', date: 'DateDimension' };
export const vitalflux_cohort_outcomes_csv = { name: 'vitalflux_cohort_outcomes.csv', adherence_pct: '[...]', condition: '[...]', readmit_30d_pct: '[...]', region: '[...]', month: 'DateDimension' };
export const vitalflux_cost_impact_csv = { name: 'vitalflux_cost_impact.csv', est_cost_avoidance_usd: '[...]', program: '[...]' };
export const vitalflux_patients_csv = { name: 'vitalflux_patients.csv', patient_id: '[...]', program: '[...]', risk_band: '[...]' };
export const vitalflux_readmissions_csv = { name: 'vitalflux_readmissions.csv', condition: '[...]', readmitted_within_30d: '[...]' };
// Available chart types: 'line', 'bar', 'column', 'pie', 'indicator'.
`;

export async function generateWidgetConfig(prompt: string): Promise<any> {
  // Defer the API key check until the function is called
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is not set in your environment variables.");
    return { error: 'API key is not configured. Please contact an administrator.' };
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fullPrompt = `
    You are an AI assistant for a healthcare analytics app called VitalFlux.
    Your goal is to generate a JSON configuration for a Sisense chart widget based on a user's request.
    
    You must use the provided data model schema. The schema is represented by objects prefixed with "DM." in the code.
    For example, to use 'vitalflux_patients_csv', the code will reference 'DM.vitalflux_patients_csv'.

    The dataOptions object you generate must be valid for the Sisense SDK.
    - 'category' is for dimensions (like 'DM.vitalflux_patients_csv.program'). It must be an array.
    - 'value' is for measures (like 'measureFactory.count(DM.vitalflux_patients_csv.patient_id)'). It must be an array.
    - Give measures a descriptive alias (the second argument to the measureFactory function).

    Here is an example. If the user asks for "Show me the number of patients per program", the correct JSON output is:
    {
      "chartType": "bar",
      "title": "Number of Patients by Program",
      "dataOptions": {
        "category": ["DM.vitalflux_patients_csv.program"],
        "value": ["measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Total Patients')"],
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
    
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing Gemini API response:", error);
    return { error: 'The AI returned an invalid response. Please try rephrasing your question.' };
  }
}