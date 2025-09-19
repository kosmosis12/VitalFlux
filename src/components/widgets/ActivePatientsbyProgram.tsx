// src/components/widgets/ActivePatientsbyProgram.tsx
import React from 'react';
import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux'; // Corrected path
import { measureFactory } from '@sisense/sdk-data';

const ActivePatientsByProgram: React.FC = () => {
    return (
        <Chart
            dataSet={DM.DataSource}
            chartType="bar"
            dataOptions={{
                category: [DM.vitalflux_patients_csv.program],
                value: [measureFactory.count(DM.vitalflux_patients_csv.patient_id, 'Total Patients')],
                breakBy: [],
            }}
            // The styleOptions prop has been removed to fix the error.
            // Titles are handled in the view components (e.g., CommandCenter.tsx).
        />
    );
};

export default ActivePatientsByProgram;