// src/views/CommandCenter.tsx
import React from 'react';
import { useApp } from '../contexts/AppContests';
// KPICard and ChartCard imports have been removed.
// phosphor-icons import is no longer needed for this simplified view.

// Import your Sisense widgets directly
import AdherenceRateOverTime from '../components/widgets/AdherenceRateOverTime';
import ActivePatientsByProgram from '../components/widgets/ActivePatientsbyProgram';
import PatientRiskLevelDistribution from '../components/widgets/PatientRiskLevelDistribution';
import ReadmissionsbyCondition from '../components/widgets/ReadmissionsbyCondition';

const CommandCenter: React.FC = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* The KPI cards section has been removed. */}
      
      {/* Grid for Sisense Widgets, now without ChartCard wrappers. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
          <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">Adherence Rate Over Time</h3>
          <AdherenceRateOverTime />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
          <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">Active Patients by Program</h3>
          <ActivePatientsByProgram />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
          <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">Patient Risk Level Distribution</h3>
          <PatientRiskLevelDistribution />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
          <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">30-Day Readmissions by Condition</h3>
          <ReadmissionsbyCondition />
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;