// src/views/CohortsAndSegments.tsx
import React from 'react';
// ChartCard import has been removed
import ReadmissionsbyCondition from '../components/widgets/ReadmissionsbyCondition';
import AverageCostAvoidancePerProgram from '../components/widgets/AverageCostAvoidanceperProgram';

const CohortsAndSegments: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Cohort Filters</h3>
          {/* Your filter UI can remain here */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Programs</option>
                  <option>RPM</option>
                  <option>CCM</option>
              </select>
              <select className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Age Bands</option>
                  <option>18-44</option>
                  <option>45-64</option>
                  <option>65+</option>
              </select>
              <select className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Device Models</option>
                  <option>CardioFlux-100</option>
                  <option>OxyLink-2</option>
              </select>
               <button className="bg-primary-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-600 transition-colors">
                  Apply Filters
              </button>
          </div>
      </div>
      
      {/* Widgets are now rendered directly without ChartCard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
          <ReadmissionsbyCondition />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
          <AverageCostAvoidancePerProgram />
        </div>
      </div>
    </div>
  );
};

export default CohortsAndSegments;