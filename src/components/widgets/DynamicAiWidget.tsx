import React, { useEffect } from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface DynamicAiWidgetProps {
  chartType: 'line' | 'bar' | 'column' | 'pie' | 'indicator';
  dataOptions: any;
}

// Extend the Window interface to avoid TypeScript errors when assigning custom properties
declare global {
  interface Window {
    DM: any;
    measureFactory: any;
  }
}

const DynamicAiWidget: React.FC<DynamicAiWidgetProps> = ({ chartType, dataOptions }) => {

  useEffect(() => {
    window.DM = DM;
    window.measureFactory = measureFactory;

    return () => {
      delete window.DM;
      delete window.measureFactory;
    };
  }, []);
  
  const evaluateDataOptions = (options: any) => {
    const evaluatedOptions = { ...options };

    if (options.category) {
      evaluatedOptions.category = options.category.map((cat: string) => eval(cat));
    }
    if (options.value) {
      evaluatedOptions.value = options.value.map((val: string) => eval(val));
    }
    if (options.breakBy) {
      evaluatedOptions.breakBy = options.breakBy.map((b: string) => eval(b));
    }

    return evaluatedOptions;
  };
  
  // *** FIX IS HERE: Check if dataOptions are valid before rendering ***
  if (!dataOptions || !dataOptions.category || !dataOptions.value) {
    return <div className="p-4 text-gray-500">Generating chart...</div>;
  }

  try {
    const safeDataOptions = evaluateDataOptions(dataOptions);
    return <Chart dataSet={DM.DataSource} chartType={chartType} dataOptions={safeDataOptions} />;
  } catch (error) {
    console.error("Error rendering dynamic widget:", error);
    return <div className="text-red-500 p-4">Error: Could not render the requested chart.</div>;
  }
};

export default DynamicAiWidget;