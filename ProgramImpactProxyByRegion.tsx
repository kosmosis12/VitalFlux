import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface ProgramImpactProxyByRegionProps {
  color?: string;
}

const ProgramImpactProxyByRegion: React.FC<ProgramImpactProxyByRegionProps> = ({ color }) => {
  return (
    <Chart
      dataSet={DM.DataSource}
      chartType="column"
      dataOptions={{
        category: [DM.vitalflux_cost_impact_csv.region],
        value: [
          {
            column: measureFactory.average(
              DM.vitalflux_cost_impact_csv.program_impact_proxy_pct,
              'Program Impact Proxy %'
            ),
            ...(color ? { color } : {}),
          },
        ],
        breakBy: [],
      }}
    />
  );
};

export default ProgramImpactProxyByRegion;

