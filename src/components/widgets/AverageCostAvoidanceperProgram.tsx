import React from 'react';
import { Chart, ThemeProvider } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface AverageCostAvoidancePerProgramProps {
  colorMapping?: Record<string, string>;
  // onCategoriesAvailable is not needed here as indicators have no categories.
}

const AverageCostAvoidancePerProgram: React.FC<AverageCostAvoidancePerProgramProps> = ({
  colorMapping,
}) => {
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
  
  // Use the first color from the mapping as the background color.
  // The wrapper will provide at least one color for the "default" item.
  const backgroundColor = colorMapping ? Object.values(colorMapping)[0] : undefined;

  return backgroundColor ? (
    <ThemeProvider theme={{ chart: { backgroundColor: backgroundColor } }}>
      {chart}
    </ThemeProvider>
  ) : (
    chart
  );
};

export default AverageCostAvoidancePerProgram;


