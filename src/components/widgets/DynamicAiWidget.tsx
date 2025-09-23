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

  // Before the component renders, attach DM and measureFactory to the window
  useEffect(() => {
    window.DM = DM;
    window.measureFactory = measureFactory;

    // Clean up the window object when the component unmounts
    return () => {
      delete window.DM;
      delete window.measureFactory;
    };
  }, []);
  
  // This function now safely evaluates strings, assuming DM and measureFactory are on the window
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

  try {
    const safeDataOptions = evaluateDataOptions(dataOptions);
    return <Chart dataSet={DM.DataSource} chartType={chartType} dataOptions={safeDataOptions} />;
  } catch (error) {
    console.error("Error rendering dynamic widget:", error);
    return <div className="text-red-500 p-4">Error: Could not render the requested chart.</div>;
  }
};

export default DynamicAiWidget;