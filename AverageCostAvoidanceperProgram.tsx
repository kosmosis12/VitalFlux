import React from 'react';
import { Chart, ThemeProvider } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface AverageCostAvoidancePerProgramProps {
  color?: string;
}

const AverageCostAvoidancePerProgram: React.FC<AverageCostAvoidancePerProgramProps> = ({ color }) => {
  const chart = (
    <Chart
      dataSet={DM.DataSource}
      chartType="indicator"
      dataOptions={{
        value: [
          measureFactory.average(
            DM.vitalflux_cost_impact_csv.est_cost_avoidance_usd,
            'Average Cost Avoidance'
          ),
        ],
        secondary: [
          measureFactory.average(
            DM.vitalflux_cost_impact_csv.program_impact_proxy_pct,
            'Program Impact Proxy'
          ),
        ],
      }}
    />
  );

  // Apply background via ThemeProvider only when a color is provided
  return color ? (
    <ThemeProvider theme={{ chart: { backgroundColor: color } }}>
      {chart}
    </ThemeProvider>
  ) : (
    chart
  );
};

export default AverageCostAvoidancePerProgram;


