import { Chart } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux'; // Data model import
import { measureFactory } from '@sisense/sdk-data';

const PatientRiskLevelDistribution = () => {
  return (
    <Chart
      dataSet={DM.DataSource}
      title="Patient Risk Level Distribution"
      chartType={'pie'}
      dataOptions={{
        category: [DM.vitalflux_patients_csv.risk_band],
        value: [
          measureFactory.count(
            DM.vitalflux_patients_csv.patient_id,
            'Number of Patients'
          ),
        ],
        breakBy: [DM.vitalflux_patients_csv.risk_band],
      }}
      styleOptions={{
        legend: {
          enabled: true,
          position: 'bottom',
        },
        plotOptions: {
          pie: {
            // This setting creates the donut hole
            innerSize: '60%',
            // This enables the percentage labels on each slice
            dataLabels: {
              enabled: true,
            },
          },
        },
        // This series array explicitly maps each risk level to a specific color
        series: [
          {
            name: 'Medium',
            data: {
              color: '#58B6E5', // Light Blue
            },
          },
          {
            name: 'High',
            data: {
              color: '#9C27B0', // Purple
            },
          },
          {
            name: 'Low',
            data: {
              color: '#F44336', // Red
            },
          },
        ],
      }}
    />
  );
};

export default PatientRiskLevelDistribution;
