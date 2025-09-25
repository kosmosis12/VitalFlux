import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

interface PatientRiskLevelDistributionProps {
    color?: string;
}

const PatientRiskLevelDistribution: React.FC<PatientRiskLevelDistributionProps> = ({ color }) => {
    return (
        <Chart
            dataSet={DM.DataSource}
            chartType="pie"
            dataOptions={{
                category: [DM.vitalflux_patients_csv.risk_band],
                value: [
                    {
                        column: measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Number of Patients'),
                        ...(color ? { color } : {}),
                    }
                ],
            }}
        />
    );
};

export default PatientRiskLevelDistribution;
