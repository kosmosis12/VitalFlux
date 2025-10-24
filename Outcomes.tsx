// src/views/Outcomes.tsx
import React from 'react';
// Corrected the import path to AppContests.tsx
 

// Import the Sisense widgets that will be displayed
import AverageCostAvoidancePerProgram from '../components/widgets/AverageCostAvoidanceperProgram';
import AdherenceRateOverTime from '../components/widgets/AdherenceRateOverTime';

const Outcomes: React.FC = () => {
    
    

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Widgets are now rendered directly inside styled divs */}
            <div className="bg-stone-50 dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
                <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">Adherence Rate Trend</h3>
                <AdherenceRateOverTime />
            </div>
            <div className="bg-stone-50 dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
                <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">Average Cost Avoidance</h3>
                <AverageCostAvoidancePerProgram />
            </div>
        </div>
    );
};

export default Outcomes;
