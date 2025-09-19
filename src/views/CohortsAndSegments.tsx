import React from 'react';
import ChartCard from '../components/ChartCard';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { cohortComparisonData } from '../constants/data';

const CohortsAndSegments: React.FC = () => {
    const { theme } = useApp();
    const isDark = theme === 'dark';
    const chfColor = "var(--color-primary-500)";
    const htnColor = "#8884d8";
    const t2dColor = "#82ca9d";

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Cohort Filters</h3>
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

            <ChartCard title="Cohort Comparison (by Condition)">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cohortComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
                        <XAxis dataKey="name" stroke={isDark ? '#A0AEC0' : '#4A5568'} />
                        <YAxis stroke={isDark ? '#A0AEC0' : '#4A5568'} />
                        <Tooltip contentStyle={{ backgroundColor: isDark ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }}/>
                        <Legend />
                        <Bar dataKey="CHF" fill={chfColor} />
                        <Bar dataKey="HTN" fill={htnColor} />
                        <Bar dataKey="T2D" fill={t2dColor} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

export default CohortsAndSegments;