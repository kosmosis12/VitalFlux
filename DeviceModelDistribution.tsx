import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface DeviceModelDistributionProps {
  color?: string;
}

const DeviceModelDistribution: React.FC<DeviceModelDistributionProps> = ({ color }) => {
  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="pie"
      dataOptions={{
        category: [DM.vitalflux_patients_csv.device_model],
        value: [
          {
            column: measureFactory.count(
              DM.vitalflux_patients_csv.patient_id,
              'Patients'
            ),
            ...(color ? { color } : {}),
          },
        ],
      }}
    />
  );
};

export default DeviceModelDistribution;

