import React, { useRef } from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface PatientsByAgeProps {
  colorMapping?: Record<string, string>;
  onCategoriesAvailable?: (categories: string[]) => void;
}

const PatientsByAge: React.FC<PatientsByAgeProps> = ({
  colorMapping,
  onCategoriesAvailable,
}) => {
  const reportedCategoriesRef = useRef<string | null>(null);

  const handleBeforeRender = (highchartsOptions: any) => {
    const categories = highchartsOptions?.series?.[0]?.data?.map((p: any) => p.name);

    if (onCategoriesAvailable && Array.isArray(categories)) {
      const categoryStrings = categories.filter((c: any): c is string => typeof c === 'string');
      const categoriesKey = categoryStrings.join(',');
      if (reportedCategoriesRef.current !== categoriesKey) {
        reportedCategoriesRef.current = categoriesKey;
        onCategoriesAvailable(categoryStrings);
      }
    }
    
    if (colorMapping && Array.isArray(highchartsOptions?.series)) {
      highchartsOptions.series.forEach((series: any) => {
        if (Array.isArray(series.data)) {
          series.data.forEach((point: any) => {
            if (point.name && colorMapping[point.name]) {
              point.color = colorMapping[point.name];
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
      chartType="pie"
      dataOptions={{
        category: [DM.vitalflux_patients_csv.age_band],
        value: [
          measureFactory.count(
            DM.vitalflux_patients_csv.patient_id,
            'Number of Patients'
          ),
        ],
      }}
      onBeforeRender={handleBeforeRender}
    />
  );
};

export default PatientsByAge;