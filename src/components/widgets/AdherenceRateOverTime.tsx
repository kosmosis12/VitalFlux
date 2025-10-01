import React, { useRef } from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface AdherenceRateOverTimeProps {
  colorMapping?: Record<string, string>;
  onCategoriesAvailable?: (categories: string[]) => void;
}

const AdherenceRateOverTime: React.FC<AdherenceRateOverTimeProps> = ({
  colorMapping,
  onCategoriesAvailable,
}) => {
  const reportedCategoriesRef = useRef<string | null>(null);

  const handleBeforeRender = (highchartsOptions: any) => {
    const categories = highchartsOptions?.xAxis?.[0]?.categories;

    if (onCategoriesAvailable && Array.isArray(categories)) {
      const categoryStrings = categories
        .map((cat: any) => (cat != null ? String(cat) : undefined))
        .filter((c: any): c is string => typeof c === 'string');
      
      const categoriesKey = categoryStrings.join(',');
      if (reportedCategoriesRef.current !== categoriesKey) {
        reportedCategoriesRef.current = categoriesKey;
        onCategoriesAvailable(categoryStrings);
      }
    }

    if (colorMapping && Array.isArray(highchartsOptions?.series)) {
      highchartsOptions.series.forEach((series: any) => {
        // For a line chart, we can set the color of the entire line.
        // If there were multiple lines (breakBy), you could color each one.
        // Here we just take the first available color for the single line.
        const firstCategoryName = categories?.[0];
        if (firstCategoryName && colorMapping[firstCategoryName]) {
            series.color = colorMapping[firstCategoryName];
        }
      });
    }

    return highchartsOptions;
  };

  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="line"
      dataOptions={{
        category: [DM.vitalflux_adherence_daily_csv.date.Months],
        value: [
          measureFactory.average(
            DM.vitalflux_adherence_daily_csv.adherent_flag,
            'Adherence Rate'
          ),
        ],
        breakBy: [],
      }}
      onBeforeRender={handleBeforeRender}
    />
  );
};

export default AdherenceRateOverTime;