import React, { useRef } from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface ActivePatientsByProgramProps {
  colorMapping?: Record<string, string>;
  onCategoriesAvailable?: (categories: string[]) => void;
}

const ActivePatientsByProgram: React.FC<ActivePatientsByProgramProps> = ({
  colorMapping,
  onCategoriesAvailable,
}) => {
  // Use a ref to store the last reported categories to prevent infinite re-render loops.
  const reportedCategoriesRef = useRef<string | null>(null);

  // onBeforeRender is the correct prop. It gives us the Highcharts configuration object.
  const handleBeforeRender = (highchartsOptions: any) => {
    // Highcharts puts categories on the xAxis object.
    const categories = highchartsOptions?.xAxis?.[0]?.categories;

    // Part 1: Extract categories and report them to the parent WidgetWrapper.
    if (onCategoriesAvailable && Array.isArray(categories)) {
      const categoryStrings = categories
        .map((cat: any) => (cat != null ? String(cat) : undefined))
        .filter((c: any): c is string => typeof c === 'string');

      // This check prevents an infinite loop by only calling the update function
      // when the list of categories actually changes.
      const categoriesKey = categoryStrings.join(',');
      if (reportedCategoriesRef.current !== categoriesKey) {
        reportedCategoriesRef.current = categoriesKey;
        onCategoriesAvailable(categoryStrings);
      }
    }

    // Part 2: Inject the custom colors directly into the chart's data points.
    if (colorMapping && Array.isArray(highchartsOptions?.series)) {
      highchartsOptions.series.forEach((series: any) => {
        if (Array.isArray(series.data)) {
          series.data.forEach((point: any, index: number) => {
            const categoryName = categories?.[index];

            if (categoryName && colorMapping[categoryName]) {
              const color = colorMapping[categoryName];
              
              // Highcharts allows each data point to be an object with a 'color' property.
              // We ensure the point is an object and then set its color.
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

  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="bar"
      dataOptions={{
        category: [DM.vitalflux_patients_csv.program],
        value: [
          measureFactory.count(
            DM.vitalflux_patients_csv.patient_id,
            'Total Patients'
          ),
        ],
        breakBy: [],
      }}
      // Use the onBeforeRender hook. This resolves the final two errors.
      onBeforeRender={handleBeforeRender}
    />
  );
};

export default ActivePatientsByProgram;