import React from 'react';
import { Chart, ThemeProvider } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface DynamicAiWidgetProps {
  chartType: 'line' | 'bar' | 'column' | 'pie' | 'indicator';
  dataOptions: any;
  color?: string;
}

const context = { DM, measureFactory };

// Resolve "DM.foo.bar" and "measureFactory.fn(DM.path, 'Alias')" strings
function resolvePath(expr: any): any {
  if (typeof expr !== 'string') return expr; // pass-through for already-resolved objects

  if (expr.startsWith('DM.')) {
    return expr
      .split('.')
      .slice(1)
      .reduce((o: any, k: string) => (o ? o[k] : undefined), context.DM);
  }

  if (expr.startsWith('measureFactory.')) {
    const match = expr.match(/^measureFactory\.(\w+)\(([^,]+)(?:,\s*['"](.*)['"])?\)$/);
    if (!match) return undefined;

    const [, fn, dmArg, alias] = match;
    const resolvedDm = resolvePath(dmArg.trim());
    const factoryFn = (context.measureFactory as any)?.[fn];
    if (typeof factoryFn === 'function') {
      return factoryFn(resolvedDm, alias ?? undefined);
    }
  }

  return undefined;
}

const evaluateDataOptions = (options: any, color?: string, isIndicator?: boolean) => {
  const out: any = {};

  if (Array.isArray(options?.category)) {
    out.category = options.category.map(resolvePath).filter(Boolean);
  }

  if (Array.isArray(options?.value)) {
    out.value = options.value
      .map((val: any) => {
        const column = resolvePath(val);
        if (!column) return null;
        // series color applies to non-indicator charts
        return isIndicator ? { column } : { column, ...(color ? { color } : {}) };
      })
      .filter(Boolean);
  }

  if (Array.isArray(options?.breakBy)) {
    out.breakBy = options.breakBy.map(resolvePath).filter(Boolean);
  }

  // Only attach 'secondary' for indicator charts
  if (isIndicator && Array.isArray(options?.secondary)) {
    out.secondary = options.secondary.map(resolvePath).filter(Boolean);
  }

  return out;
};

const DynamicAiWidget: React.FC<DynamicAiWidgetProps> = ({ chartType, dataOptions, color }) => {
  const isIndicator = chartType === 'indicator';

  // Build resolved options first
  const resolved = evaluateDataOptions(dataOptions, color, isIndicator);

  // Guard: need at least one value measure after resolution
  if (!resolved?.value || resolved.value.length === 0) {
    return <div className="p-4 text-gray-500">Waiting for valid data configuration...</div>;
  }

  const chart = (
    <Chart
      dataSet={DM.DataSource}
      chartType={chartType as any}
      dataOptions={resolved}
    />
  );

  // Background for indicator via ThemeProvider
  if (isIndicator && color) {
    return <ThemeProvider theme={{ chart: { backgroundColor: color } }}>{chart}</ThemeProvider>;
  }

  return chart;
};

export default DynamicAiWidget;