import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface EscalationsByReasonMonthlyProps {
  color?: string;
}

const EscalationsByReasonMonthly: React.FC<EscalationsByReasonMonthlyProps> = ({ color }) => {
  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="column"
      dataOptions={{
        category: [DM.vitalflux_escalations_by_reason_monthly_csv.month.Months],
        breakBy: [DM.vitalflux_escalations_by_reason_monthly_csv.reason],
        value: [
          {
            column: measureFactory.sum(
              DM.vitalflux_escalations_by_reason_monthly_csv.count,
              'Escalations'
            ),
            ...(color ? { color } : {}),
          },
        ],
      }}
    />
  );
};

export default EscalationsByReasonMonthly;

