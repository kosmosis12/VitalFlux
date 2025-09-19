import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

const ActivePatientsByProgram = () => {
    return (
        <Chart
            dataSet={DM.DataSource}
            chartType="bar"
            dataOptions={{
                category: [DM.vitalflux_patients_csv.program],
                value: [measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Total Patients')],
                breakBy: [],
            }}
            styleOptions={{
                title: {
                    enabled: true,
                    text: 'Active Patients by Program',
                },
            }}
        />
    );
};

export default ActivePatientsByProgram;