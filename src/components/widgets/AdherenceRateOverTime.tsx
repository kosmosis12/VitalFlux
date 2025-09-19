import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux'; // Corrected path
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
            // The styleOptions prop has been removed to fix the error.
        />
    );
};

export default AdherenceRateOverTime;