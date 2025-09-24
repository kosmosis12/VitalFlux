import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface DynamicAiWidgetProps {
  chartType: string;
  dataOptions: any;
}

// FIX: Added ': any' to explicitly define the function's return type
function resolvePath(expr: string, ctx: Record<string, any>): any {
  if (typeof expr !== 'string') return undefined;

  if (expr.startsWith('DM.')) {
    return expr.split('.').slice(1).reduce((o, k) => (o ? o[k] : undefined), ctx.DM);
  }
  if (expr.startsWith('measureFactory.')) {
    const match = expr.match(/^measureFactory\.(\w+)\(([^,]+)(?:,\s*['"](.*)['"])?\)$/);
    if (!match) return undefined;
    
    const [, fn, dmArg, alias] = match;
    const resolvedDm = resolvePath(dmArg.trim(), ctx);
    
    if (ctx.measureFactory?.[fn]) {
        // @ts-ignore - We are dynamically calling the factory function
        return ctx.measureFactory[fn](resolvedDm, alias ?? undefined);
    }
  }
  return undefined;
}

const evaluateDataOptions = (options: any) => {
  const out: any = {};
  const context = { DM, measureFactory };
  for (const key of ['category', 'value', 'breakBy', 'secondary']) {
    if (Array.isArray(options?.[key])) {
      out[key] = options[key].map((s: string) => resolvePath(s, context)).filter(Boolean);
    }
  }
  return out;
};

const DynamicAiWidget: React.FC<DynamicAiWidgetProps> = ({ chartType, dataOptions }) => {
  if (!dataOptions?.value || dataOptions.value.length === 0) {
    return <div className="p-4 text-gray-500">Waiting for valid data configuration...</div>;
  }

  const allowedChartTypes = new Set(['line', 'bar', 'column', 'pie', 'indicator']);
  const safeChartType = allowedChartTypes.has(chartType) ? chartType : 'bar';

  try {
    const safeDataOptions = evaluateDataOptions(dataOptions);
    return <Chart dataSet={DM.DataSource} chartType={safeChartType as any} dataOptions={safeDataOptions} />;
  } catch (error) {
    console.error("Error rendering dynamic widget:", error);
    return <div className="text-red-500 p-4">Error: Could not render the requested chart.</div>;
  }
};

export default DynamicAiWidget;