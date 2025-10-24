import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface ReadmissionRateOverTimeProps {
  color?: string;
}

const ReadmissionRateOverTime: React.FC<ReadmissionRateOverTimeProps> = ({ color }) => {
  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="line"
      dataOptions={{
        category: [DM.vitalflux_cohort_outcomes_csv.month.Months],
        value: [
          {
            column: measureFactory.average(
              DM.vitalflux_cohort_outcomes_csv.readmit_30d_pct,
              'Readmit Rate (30d)'
            ),
            ...(color ? { color } : {}),
          },
        ],
        breakBy: [],
      }}
    />
  );
};

export default ReadmissionRateOverTime;

