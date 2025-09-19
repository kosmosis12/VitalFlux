import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

const AdherenceRateOverTime = () => {
    return (
        <Chart
            dataSet={DM.DataSource}
            chartType="line"
            dataOptions={{
                category: [DM.vitalflux_adherence_daily_csv.date.Months],
                value: [measureFactory.average(DM.vitalflux_adherence_daily_csv.adherent_flag, 'Adherence Rate')],
                breakBy: [],
            }}
            styleOptions={{
                title: {
                    enabled: true,
                    text: 'Adherence Rate Over Time',
                },
                xAxis: {
                    title: {
                        enabled: true,
                        text: 'Month',
                    },
                },
                yAxis: {
                    title: {
                        enabled: true,
                        text: 'Adherence Rate (%)',
                    },
                },
            }}
        />
    );
};

export default AdherenceRateOverTime;