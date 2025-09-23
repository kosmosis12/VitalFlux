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
            // The color palette for the chart
            colors={[
                {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#88E1FF'],
                        [1, '#6A3E9D'],
                    ],
                },
                {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#F47B7B'],
                        [1, '#C13B8B'],
                    ],
                },
                {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#88E1FF'],
                        [1, '#D84C7A'],
                    ],
                },
            ]}
            // ✅ CORRECT: 'plotOptions' is also a direct prop for plot styling
            plotOptions={{
                column: {
                    borderRadius: 5,
                },
            }}
        />
    );
};

export default ReadmissionsByCondition;
