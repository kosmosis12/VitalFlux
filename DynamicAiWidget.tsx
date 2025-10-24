import React from 'react';
import { Chart, ThemeProvider } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface DataOptions {
  category?: string[];
  value?: string[];
  breakBy?: string[];
  secondary?: string[];
}

interface DynamicAiWidgetProps {
  chartType: 'line' | 'bar' | 'column' | 'pie' | 'indicator';
  dataOptions: DataOptions;
  color?: string;
}

const context = { DM, measureFactory };

function normalize(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findDmAttributeByName(name: string): any | undefined {
  const target = normalize(name);
  const visit = (node: any): any | undefined => {
    if (!node || typeof node !== 'object') return undefined;
    // Date dimension: prefer Months level by default
    if ('Months' in node && 'name' in node) {
      const n = normalize(String((node as any).name ?? ''));
      if (n === target) return (node as any).Months ?? node;
    }
    if ('name' in node && typeof (node as any).name === 'string') {
      const n = normalize((node as any).name);
      if (n === target) return node;
    }
    for (const k of Object.keys(node)) {
      const res = visit((node as any)[k]);
      if (res) return res;
    }
    return undefined;
  };
  // search within DM only
  for (const key of Object.keys(DM) as Array<keyof typeof DM>) {
    const val = (DM as any)[key];
    const res = visit(val);
    if (res) return res;
  }
  return undefined;
}

// Resolve "DM.foo.bar" and "measureFactory.fn(DM.path, 'Alias')" strings
// The 'any' types in this function are necessary because it dynamically
// resolves paths on different objects (DM and measureFactory) whose
// structures are not fully known at compile time.
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
    const factoryFn = (context.measureFactory as any)?.[fn] as
      | ((...args: any[]) => any)
      | undefined;
    if (typeof factoryFn === 'function') {
      return factoryFn(resolvedDm, alias ?? undefined);
    }
  }

  // Try to resolve a plain attribute/date name to DM and let caller decide measure wrapper
  const plain = findDmAttributeByName(expr);
  if (plain) return { __vf_attr: plain, __vf_alias: expr };

  return undefined;
}

const evaluateDataOptions = (options: DataOptions, color?: string, isIndicator?: boolean) => {
  const out: { category?: any[]; value?: any[]; breakBy?: any[]; secondary?: any[] } = {};

  if (Array.isArray(options?.category)) {
    out.category = options.category
      .map((c: string) => {
        const resolved = resolvePath(c);
        if (!resolved) return null;
        if (resolved && typeof resolved === 'object' && '__vf_attr' in resolved) {
          return (resolved as any).__vf_attr;
        }
        return resolved;
      })
      .filter(Boolean);
  }

  if (Array.isArray(options?.value)) {
    out.value = options.value
      .map((val: string) => {
        const resolved = resolvePath(val);
        if (!resolved) return null;
        let column: any = resolved;
        if (resolved && typeof resolved === 'object' && '__vf_attr' in resolved) {
          // Build a simple count measure if AI provided a bare attribute name
          const attr = (resolved as any).__vf_attr;
          const alias = (resolved as any).__vf_alias ?? 'Value';
          column = measureFactory.count(attr, String(alias));
        }
        // series color applies to non-indicator charts
        return isIndicator ? { column } : { column, ...(color ? { color } : {}) };
      })
      .filter(Boolean);
  }

  if (Array.isArray(options?.breakBy)) {
    out.breakBy = options.breakBy
      .map((c: string) => {
        const resolved = resolvePath(c);
        if (!resolved) return null;
        if (resolved && typeof resolved === 'object' && '__vf_attr' in resolved) {
          return (resolved as any).__vf_attr;
        }
        return resolved;
      })
      .filter(Boolean);
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
      chartType={chartType}
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
