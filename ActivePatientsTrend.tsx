import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface ActivePatientsTrendProps {
  color?: string;
}

const ActivePatientsTrend: React.FC<ActivePatientsTrendProps> = ({ color }) => {
  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="line"
      dataOptions={{
        category: [DM.vitalflux_kpi_overview_csv.month],
        value: [
          {
            column: measureFactory.sum(
              DM.vitalflux_kpi_overview_csv.active_patients,
              'Active Patients'
            ),
            ...(color ? { color } : {}),
          },
        ],
        breakBy: [],
      }}
    />
  );
};

export default ActivePatientsTrend;

