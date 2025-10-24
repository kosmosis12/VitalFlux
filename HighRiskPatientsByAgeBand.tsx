import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface HighRiskPatientsByAgeBandProps {
  color?: string;
}

const HighRiskPatientsByAgeBand: React.FC<HighRiskPatientsByAgeBandProps> = ({ color }) => {
  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="bar"
      dataOptions={{
        category: [DM.vitalflux_high_risk_patients_csv.age_band],
        value: [
          {
            column: measureFactory.count(
              DM.vitalflux_high_risk_patients_csv.patient_id,
              'High-Risk Patients'
            ),
            ...(color ? { color } : {}),
          },
        ],
        breakBy: [],
      }}
    />
  );
};

export default HighRiskPatientsByAgeBand;

