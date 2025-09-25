import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface AdherenceRateOverTimeProps {
    color?: string;
}

const AdherenceRateOverTime: React.FC<AdherenceRateOverTimeProps> = ({ color }) => {
    return (
        <Chart
            dataSet={DM.DataSource}
            chartType="line"
            dataOptions={{
                category: [DM.vitalflux_adherence_daily_csv.date.Months],
                value: [
                    {
                        column: measureFactory.average(DM.vitalflux_adherence_daily_csv.adherent_flag, 'Adherence Rate'),
                        ...(color ? { color } : {}),
                    }
                ],
                breakBy: [],
            }}
        />
    );
};

export default AdherenceRateOverTime;