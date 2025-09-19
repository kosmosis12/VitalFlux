import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux'; // Corrected path
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
            // The styleOptions prop has been removed to fix the error.
        />
    );
};

export default ReadmissionsByCondition;