import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface ActivePatientsByProgramProps {
  color?: string;
}

const ActivePatientsByProgram: React.FC<ActivePatientsByProgramProps> = ({ color }) => {
  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="bar"
      dataOptions={{
        category: [DM.vitalflux_patients_csv.program],
        value: [
          {
            column: measureFactory.count(
              DM.vitalflux_patients_csv.patient_id,
              'Total Patients'
            ),
            ...(color ? { color } : {}),
          },
        ],
        breakBy: [],
      }}
    />
  );
};

export default ActivePatientsByProgram;