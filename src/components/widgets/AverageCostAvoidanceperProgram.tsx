// src/components/widgets/AverageCostAvoidancePerProgram.tsx
import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

const AverageCostAvoidancePerProgram: React.FC = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">
        Average Cost Avoidance per Program
      </h2>

      <Chart
        dataSet={DM.DataSource}
        chartType="indicator"
        dataOptions={{
          // Primary indicator value
          value: [
            measureFactory.average(
              DM.vitalflux_cost_impact_csv.est_cost_avoidance_usd,
              'Average Cost Avoidance'
            ),
          ],
          // Optional secondary value displayed below/aside (supported by indicator)
          secondary: [
            measureFactory.average(
              DM.vitalflux_cost_impact_csv.program_impact_proxy_pct,
              'Program Impact Proxy'
            ),
          ],
        }}
        // No styleOptions.title — ChartStyleOptions does not define it
      />
    </div>
  );
};

export default AverageCostAvoidancePerProgram;

