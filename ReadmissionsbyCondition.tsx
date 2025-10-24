import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface ReadmissionsByConditionProps {
    color?: string;
}

const ReadmissionsByCondition: React.FC<ReadmissionsByConditionProps> = ({ color }) => {
    return (
        <Chart
            dataSet={DM.DataSource}
            chartType="column"
            dataOptions={{
                category: [DM.vitalflux_readmissions_csv.condition],
                value: [
                    {
                        column: measureFactory.average(
                            DM.vitalflux_readmissions_csv.readmitted_within_30d,
                            '30-Day Readmission Rate'
                        ),
                        ...(color ? { color } : {}),
                    }
                ],
                breakBy: [],
            }}
        />
    );
};

export default ReadmissionsByCondition;
