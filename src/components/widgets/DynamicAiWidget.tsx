import React from 'react';
import { Chart, ThemeProvider } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface DynamicAiWidgetProps {
  chartType: string;
  dataOptions: any;
  color?: string;
}

const context = { DM, measureFactory };

function resolvePath(expr: string): any {
  if (typeof expr !== 'string') return undefined;

  if (expr.startsWith('DM.')) {
    return expr.split('.').slice(1).reduce((o, k) => (o ? o[k] : undefined), context.DM);
  }
  if (expr.startsWith('measureFactory.')) {
    const match = expr.match(/^measureFactory\.(\w+)\(([^,]+)(?:,\s*['"](.*)['"])?\)$/);
    if (!match) return undefined;
    
    const [, fn, dmArg, alias] = match;
    const resolvedDm = resolvePath(dmArg.trim());
    
    if (context.measureFactory?.[fn as keyof typeof measureFactory]) {
        // @ts-ignore - Dynamically calling the factory function
        return context.measureFactory[fn](resolvedDm, alias ?? undefined);
    }
  }
  return undefined;
}

const evaluateDataOptions = (options: any, color?: string) => {
  const out: any = {};
  
  if (Array.isArray(options?.category)) {
      out.category = options.category.map(resolvePath).filter(Boolean);
  }

  if (Array.isArray(options?.value)) {
      out.value = options.value.map((valStr: string) => {
          const resolvedColumn = resolvePath(valStr);
          if (!resolvedColumn) return null;
          // Correctly structure the measure with its color
          return {
              column: resolvedColumn,
              ...(color ? { color } : {}),
          };
      }).filter(Boolean);
  }
  
  if (Array.isArray(options?.breakBy)) {
      out.breakBy = options.breakBy.map(resolvePath).filter(Boolean);
  }
  
  // For indicator secondary values, which don't get colored
  if (Array.isArray(options?.secondary)) {
      out.secondary = options.secondary.map(resolvePath).filter(Boolean);
  }

  return out;
};


const DynamicAiWidget: React.FC<DynamicAiWidgetProps> = ({ chartType, dataOptions, color }) => {
  if (!dataOptions?.value || dataOptions.value.length === 0) {
    return <div className="p-4 text-gray-500">Waiting for valid data configuration...</div>;
  }

  const allowedChartTypes = new Set(['line', 'bar', 'column', 'pie', 'indicator']);
  const safeChartType = allowedChartTypes.has(chartType) ? chartType : 'bar';

  try {
    // Pass color to correctly structure the data options for non-indicator charts
    const safeDataOptions = evaluateDataOptions(dataOptions, color);

    const chart = (
        <Chart
            dataSet={DM.DataSource}
            chartType={safeChartType as any}
            dataOptions={safeDataOptions}
        />
    );

    // Handle the special case for indicator backgrounds
    if (safeChartType === 'indicator' && color) {
        return (
            <ThemeProvider theme={{ chart: { backgroundColor: color } }}>
                {chart}
            </ThemeProvider>
        );
    }
    
    // For all other chart types, the color is already in dataOptions
    return chart;
    
  } catch (error) {
    console.error("Error rendering dynamic widget:", error);
    return <div className="text-red-500 p-4">Error: Could not render the requested chart.</div>;
  }
};

export default DynamicAiWidget;