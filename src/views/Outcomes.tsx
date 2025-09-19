import React from 'react';
import ChartCard from '../components/ChartCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { readmissionsTrendData } from '../constants/data';
// FIX: Updated icon name to support the installed version of @phosphor-icons/react.
import { CurrencyDollar, ArrowsClockwise } from '@phosphor-icons/react';

const Outcomes: React.FC = () => {
    const { theme } = useApp();
    const isDark = theme === 'dark';
    const chartColor = "var(--color-primary-500)";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ChartCard title="30-Day Readmissions Trend">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={readmissionsTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'}/>
                            <XAxis dataKey="month" stroke={isDark ? '#A0AEC0' : '#4A5568'}/>
                            <YAxis stroke={isDark ? '#A0AEC0' : '#4A5568'} unit="%"/>
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }}/>
                            <Legend />
                            <Line type="monotone" dataKey="rate" name="Readmission Rate" stroke={chartColor} strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                             <CurrencyDollar size={24} className="text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Cost Avoidance</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">$1.2M</p>
                        </div>
                    </div>
                     <p className="text-xs text-gray-500 mt-2">This quarter, based on reduced readmissions.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                             <ArrowsClockwise size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Program Impact Proxy</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">-35%</p>
                        </div>
                    </div>
                     <p className="text-xs text-gray-500 mt-2">Change in readmissions vs. baseline cohort.</p>
                </div>
            </div>
        </div>
    );
};

export default Outcomes;