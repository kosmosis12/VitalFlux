import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

const PatientRiskLevelDistribution = () => {
    return (
        <Chart
            dataSet={DM.DataSource}
            chartType="pie"
            dataOptions={{
                category: [DM.vitalflux_patients_csv.risk_band],
                value: [measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Number of Patients')],
            }}
            styleOptions={{
                title: {
                    enabled: true,
                    text: 'Patient Risk Level Distribution',
                },
                legend: {
                    enabled: true,
                    position: 'bottom',
                },
            }}
        />
    );
};

export default PatientRiskLevelDistribution;