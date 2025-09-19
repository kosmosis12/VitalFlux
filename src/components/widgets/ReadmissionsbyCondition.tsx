import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

const ReadmissionsByCondition = () => {
    return (
        <Chart
            dataSet={DM.DataSource}
            chartType="column"
            dataOptions={{
                category: [DM.vitalflux_readmissions_csv.condition],
                value: [
                    measureFactory.average(
                        DM.vitalflux_readmissions_csv.readmitted_within_30d,
                        '30-Day Readmission Rate'
                    ),
                ],
                breakBy: [],
            }}
            styleOptions={{
                title: {
                    enabled: true,
                    text: '30-Day Readmissions by Condition',
                },
                yAxis: {
                    title: {
                        enabled: true,
                        text: 'Readmission Rate (%)',
                    },
                },
            }}
        />
    );
};

export default ReadmissionsByCondition;