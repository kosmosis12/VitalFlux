// src/components/GeminiChat.tsx
import React, { useMemo, useState } from 'react';
import { PaperPlaneTilt, Spinner } from '@phosphor-icons/react';
import { generateWidgetConfig } from '../services/geminiService';
import type { WidgetConfig } from '../services/geminiService';

interface Message { text: string; isUser: boolean; }
interface GeminiChatProps {
  onNewWidget: (widgetConfig: WidgetConfig | WidgetConfig[]) => void; // allow variants
  onError: (errorMessage: string) => void;
}

// 1) SYSTEM + SCHEMA + FEW-SHOTS
const SYSTEM_PROMPT = `
You are the VitalFlux Visualization Designer.
Goal: produce actionable, low-friction dashboards that reveal signal using the available data.
Always return valid JSON that matches the provided WidgetConfig schema—no prose.
Prefer: clear titles, minimal transforms, obvious legends, sane defaults.
If the user request is ambiguous, propose 2–3 viable widgets and pick one with a brief rationale.
`;

const WIDGET_JSON_SCHEMA = `
Return JSON with this shape:
type WidgetConfig = {
  id: string;                 // unique id
  title: string;              // chart title
  description?: string;       // what insight this reveals
  chartType: "line" | "bar" | "column" | "area" | "pie" | "scatter" | "table" | "combo";
  x: { field: string; timeGrain?: "day" | "week" | "month" | "quarter" | "year" };
  y: Array<{ field: string; agg?: "sum" | "avg" | "count" | "min" | "max" }>;
  splitBy?: string;           // series/group field
  filters?: Array<{ field: string; op: "=" | "!=" | ">" | "<" | ">=" | "<=" | "in"; value: any }>;
  sort?: { field: string; dir: "asc" | "desc" };
  limit?: number;
  format?: { currency?: boolean; percent?: boolean; decimals?: number };
  options?: {
    stacked?: boolean;
    smooth?: boolean;
    showDataLabels?: boolean;
    legend?: "top" | "right" | "bottom" | "none";
  };
};
If multiple candidates are requested, return an array of WidgetConfig.
`;

const FEW_SHOT = `
Examples:

User: "trend of 30-day readmit rate by month"
Assistant (JSON):
[
  {
    "id":"w_trend_readmit_01",
    "title":"30-Day Readmission Rate — Monthly Trend",
    "chartType":"line",
    "x":{"field":"month","timeGrain":"month"},
    "y":[{"field":"readmit_30d_pct","agg":"avg"}],
    "format":{"percent":true,"decimals":1},
    "options":{"smooth":true,"legend":"none"}
  }
]

User: "compare regions on adherence"
Assistant (JSON):
[
  {
    "id":"w_region_adherence_01",
    "title":"Adherence by Region",
    "chartType":"bar",
    "x":{"field":"region"},
    "y":[{"field":"adherence_pct","agg":"avg"}],
    "format":{"percent":true,"decimals":0},
    "options":{"legend":"none"}
  }
]
`;

type Intent = "auto" | "trend" | "compare" | "distribution" | "ranking" | "correlation";

const GeminiChat: React.FC<GeminiChatProps> = ({ onNewWidget, onError }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2) Simple controls that steer the model (optional UI below)
  const [intent, setIntent] = useState<Intent>("auto");
  const [preferredTypes, setPreferredTypes] = useState<string[]>([]); // e.g., ["line","column"]
  const [variantCount, setVariantCount] = useState<number>(1);
  const [allowAmbiguityQuestions, setAllowAmbiguityQuestions] = useState<boolean>(true);

  // 3) Build a richer prompt the service can use as a single string (backwards compatible)
  const buildPrompt = useMemo(() => {
    return (userQuery: string) => {
      const meta = {
        intent,
        preferredChartTypes: preferredTypes,
        variantCount,
        allowAmbiguityQuestions
      };
      const META = `Meta:\n${JSON.stringify(meta, null, 2)}`;
      // NOTE: If you have a runtime data schema string, inject it here as DATA_SCHEMA.
      const DATA_SCHEMA = `Data fields (examples): 
- month, date, region, program, patient_id, adherent_flag
- adherence_pct, readmit_30d_pct, est_cost_savings, risk_score
(Use reasonable defaults if a field isn’t explicit.)`;

      return [
        SYSTEM_PROMPT.trim(),
        WIDGET_JSON_SCHEMA.trim(),
        DATA_SCHEMA,
        FEW_SHOT.trim(),
        `User Request:\n${userQuery}`,
        META
      ].join("\n\n---\n\n");
    };
  }, [intent, preferredTypes, variantCount, allowAmbiguityQuestions]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { text: trimmedInput, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 4) Pass composed prompt (no service refactor needed)
      const composed = buildPrompt(trimmedInput);
      const result = await generateWidgetConfig(composed);

      setIsLoading(false);

      if (result && 'error' in result) {
        const errorMessage = String(result.error || 'Sorry, I was unable to create that widget.');
        const errorResponse: Message = { text: errorMessage, isUser: false };
        setMessages(prev => [...prev, errorResponse]);
        onError(errorMessage);
      } else {
        const createdText = Array.isArray(result)
          ? `✅ Created ${result.length} widget candidates.`
          : `✅ Widget created for "${typeof result.title === 'string' ? result.title : 'your request'}".`;

        setMessages(prev => [...prev, { text: createdText, isUser: false }]);
        onNewWidget(result); // allow single or multiple configs
      }
    } catch (e: any) {
      setIsLoading(false);
      const msg = e?.message || 'Unexpected error creating widget.';
      setMessages(prev => [...prev, { text: msg, isUser: false }]);
      onError(msg);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col h-[560px] border dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="font-bold text-lg dark:text-white">VitalFlux AI Assistant</h3>
      </div>

      {/* 5) Minimal “Advanced” steering controls */}
      <div className="px-4 pt-3 grid grid-cols-2 gap-2 text-sm">
        <select
          value={intent}
          onChange={e => setIntent(e.target.value as Intent)}
          className="border rounded-md px-2 py-1 dark:bg-gray-900 dark:border-gray-600"
          title="Visualization intent"
        >
          <option value="auto">Intent: Auto</option>
          <option value="trend">Trend</option>
          <option value="compare">Compare</option>
          <option value="distribution">Distribution</option>
          <option value="ranking">Ranking</option>
          <option value="correlation">Correlation</option>
        </select>

        <select
          multiple
          value={preferredTypes}
          onChange={e => setPreferredTypes(Array.from(e.target.selectedOptions, o => o.value))}
          className="border rounded-md px-2 py-1 dark:bg-gray-900 dark:border-gray-600"
          title="Preferred chart types"
        >
          <option value="line">line</option>
          <option value="bar">bar</option>
          <option value="column">column</option>
          <option value="area">area</option>
          <option value="pie">pie</option>
          <option value="scatter">scatter</option>
          <option value="table">table</option>
          <option value="combo">combo</option>
        </select>

        <label className="flex items-center gap-2">
          <span className="whitespace-nowrap">Variants</span>
          <input
            type="number"
            min={1}
            max={3}
            value={variantCount}
            onChange={e => setVariantCount(Math.max(1, Math.min(3, Number(e.target.value) || 1)))}
            className="w-16 border rounded-md px-2 py-1 dark:bg-gray-900 dark:border-gray-600"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowAmbiguityQuestions}
            onChange={e => setAllowAmbiguityQuestions(e.target.checked)}
          />
          <span className="whitespace-nowrap">Ask if ambiguous</span>
        </label>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs rounded-lg px-3 py-2 ${msg.isUser ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-2">
            <div className="max-w-xs rounded-lg px-3 py-2 bg-gray-200 dark:bg-gray-700">
              <Spinner size={20} className="animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-700 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} // onKeyPress is deprecated
          placeholder="e.g., trend of readmit rate by month"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-300"
          disabled={isLoading || !input.trim()}
        >
          <PaperPlaneTilt size={20} />
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;

