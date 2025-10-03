import React, { useRef } from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface EscalationsByReasonProps {
  colorMapping?: Record<string, string>;
  onCategoriesAvailable?: (categories: string[]) => void;
}

const EscalationsByReason: React.FC<EscalationsByReasonProps> = ({
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
        if (Array.isArray(series.data)) {
          series.data.forEach((point: any, index: number) => {
            const categoryName = categories?.[index];
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

  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="column"
      dataOptions={{
        category: [DM.vitalflux_escalations_csv.reason],
        value: [
          measureFactory.count(
            DM.vitalflux_escalations_csv.escalation_id,
            'Total Escalations'
          ),
        ],
        breakBy: [],
      }}
      onBeforeRender={handleBeforeRender}
    />
  );
};

export default EscalationsByReason;