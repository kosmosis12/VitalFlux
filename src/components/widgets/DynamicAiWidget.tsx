import React, { useRef } from 'react';
import { Chart, ThemeProvider } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface DynamicAiWidgetProps {
  chartType: 'line' | 'bar' | 'column' | 'pie' | 'indicator';
  dataOptions: any;
  colorMapping?: Record<string, string>;
  onCategoriesAvailable?: (categories: string[]) => void;
}

// Helper functions from the original file
const context = { DM, measureFactory };
function resolvePath(expr: any): any {
  if (typeof expr !== 'string') return expr;
  if (expr.startsWith('DM.')) {
    return expr.split('.').slice(1).reduce((o: any, k: string) => (o ? o[k] : undefined), context.DM);
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

const evaluateDataOptions = (options: any, isIndicator?: boolean) => {
  const out: any = {};
  if (Array.isArray(options?.category)) {
    out.category = options.category.map(resolvePath).filter(Boolean);
  }
  if (Array.isArray(options?.value)) {
    out.value = options.value.map((val: any) => resolvePath(val)).filter(Boolean);
  }
  if (Array.isArray(options?.breakBy)) {
    out.breakBy = options.breakBy.map(resolvePath).filter(Boolean);
  }
  if (isIndicator && Array.isArray(options?.secondary)) {
    out.secondary = options.secondary.map(resolvePath).filter(Boolean);
  }
  return out;
};


const DynamicAiWidget: React.FC<DynamicAiWidgetProps> = ({ chartType, dataOptions, colorMapping, onCategoriesAvailable }) => {
  const isIndicator = chartType === 'indicator';
  const reportedCategoriesRef = useRef<string | null>(null);

  const resolved = evaluateDataOptions(dataOptions, isIndicator);

  const handleBeforeRender = (highchartsOptions: any) => {
    const categories = highchartsOptions?.xAxis?.[0]?.categories || highchartsOptions?.series?.[0]?.data.map((p: any) => p.name);

    if (onCategoriesAvailable && Array.isArray(categories)) {
      const categoryStrings = categories.map((cat: any) => String(cat)).filter(Boolean);
      const categoriesKey = categoryStrings.join(',');
      if (reportedCategoriesRef.current !== categoriesKey) {
        reportedCategoriesRef.current = categoriesKey;
        onCategoriesAvailable(categoryStrings);
      }
    }

    if (colorMapping && Array.isArray(highchartsOptions?.series)) {
      highchartsOptions.series.forEach((series: any) => {
        if (Array.isArray(series.data)) {
          series.data.forEach((point: any, index: number) => {
            const categoryName = chartType === 'pie' ? point.name : categories?.[index];
            if (categoryName && colorMapping[categoryName]) {
              const color = colorMapping[categoryName];
              if (typeof point === 'object' && point !== null) {
                point.color = color;
              } else {
                series.data[index] = { y: point, color: color };
              }
            }
          });
        }
      });
    }
    
    return highchartsOptions;
  };

  if (!resolved?.value || resolved.value.length === 0) {
    return <div className="p-4 text-gray-500">Waiting for valid data configuration...</div>;
  }

  const chart = (
    <Chart
      dataSet={DM.DataSource}
      chartType={chartType as any}
      dataOptions={resolved}
      onBeforeRender={handleBeforeRender}
    />
  );

  const backgroundColor = isIndicator && colorMapping ? Object.values(colorMapping)[0] : undefined;
  if (isIndicator && backgroundColor) {
    return <ThemeProvider theme={{ chart: { backgroundColor } }}>{chart}</ThemeProvider>;
  }

  return chart;
};

export default DynamicAiWidget;