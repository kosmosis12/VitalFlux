import React from 'react';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as DM from '../../VitalFlux';
import { measureFactory } from '@sisense/sdk-data';

const HighRiskPatients: React.FC = () => {
  const { data, isLoading, error } = useExecuteQuery({
    dataSource: DM.DataSource,
    dimensions: [
      DM.vitalflux_high_risk_patients_csv.patient_id,
      DM.vitalflux_high_risk_patients_csv.condition,
      DM.vitalflux_high_risk_patients_csv.program,
    ],
    measures: [
      measureFactory.average(
        DM.vitalflux_high_risk_patients_csv.risk_score,
        'Risk Score'
      ),
    ],
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    const msg = (error as { message?: string })?.message ?? String(error);
    return <div>Error: {msg}</div>;
  }

  const rows = data?.rows ?? [];

  if (rows.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div className="overflow-x-auto h-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Patient ID</th>
            <th scope="col" className="px-6 py-3">Condition</th>
            <th scope="col" className="px-6 py-3">Program</th>
            <th scope="col" className="px-6 py-3">Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            // Extract cell values - dimensions return direct values, measures return data objects
            const patientId = row[0]?.data ?? row[0] ?? '';
            const condition = row[1]?.data ?? row[1] ?? '';
            const program = row[2]?.data ?? row[2] ?? '';
            const riskScore = row[3]?.data ?? row[3] ?? '';
            
            return (
              <tr
                key={`${patientId}-${index}`}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {String(patientId)}
                </td>
                <td className="px-6 py-4">{String(condition)}</td>
                <td className="px-6 py-4">{String(program)}</td>
                <td className="px-6 py-4">
                  {typeof riskScore === 'number' 
                    ? riskScore.toFixed(2) 
                    : String(riskScore)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HighRiskPatients;