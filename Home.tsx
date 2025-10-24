// src/views/Home.tsx
import React from 'react';
import { useApp } from '../contexts/useApp'; // Correct path to your context file
import { scenarios, insightData } from '../constants/data';
import { View } from '../types';
import type { SavedView } from '../types';
import { ArrowRight, Play, Trash } from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

/* ----------------------------- Sub-components ----------------------------- */

// 1) HomeHero
const HomeHero: React.FC = () => (
    <div className="bg-stone-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">VitalFlux Insights</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Operational analytics embedded where care decisions happen—fast, flexible, privacy-safe.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors shadow flex items-center justify-center gap-2">
                Start a Scenario
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Take 60-sec Tour
            </button>
        </div>
    </div>
);

// 2) ScenarioCard
interface ScenarioCardProps {
    icon: React.ElementType<IconProps>;
    title: string;
    description: string;
    targetView: View;
}
const ScenarioCard: React.FC<ScenarioCardProps> = ({ icon: Icon, title, description, targetView }) => {
    const { setView } = useApp();
    return (
        <div
            onClick={() => setView(targetView)}
            className="bg-stone-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                    <Icon size={24} className="text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex-grow">{description}</p>
            <div className="mt-4 flex justify-end items-center text-primary-500 font-semibold text-sm">
                Launch <ArrowRight size={16} className="ml-1" />
            </div>
        </div>
    );
};

// 3) InsightChip
interface InsightChipProps {
    label: string;
    value: string;
    delta: string;
    deltaType: 'increase' | 'decrease';
    sparkData: { name: string; v: number }[];
    color: string;
    fill: string;
}
const InsightChip: React.FC<InsightChipProps> = ({ label, value, delta, deltaType, sparkData, color, fill }) => {
    const deltaColor =
        deltaType === 'increase'
            ? color.includes('red')
                ? 'text-red-500'
                : 'text-green-500'
            : color.includes('red')
                ? 'text-green-500'
                : 'text-red-500';

    const gradientId = React.useMemo(() => `spark-${label.replace(/\W+/g, '-').toLowerCase()}`, [label]);

    return (
        <div className="bg-stone-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
                <div className={`text-sm font-semibold ${deltaColor}`}>{delta}</div>
            </div>
            <div className="h-16 mt-2 -ml-4 -mr-4 -mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={fill} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={fill} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={fill} strokeWidth={2} fill={`url(#${gradientId})`} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// 4) SavedViewsList
const SavedViewsList: React.FC = () => {
    const { savedViews, setView, deleteView } = useApp();

    return (
        <div className="bg-stone-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Saved Views</h3>
            {savedViews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                    You have no saved views. Navigate to a page and click the save icon in the header to create one.
                </p>
            ) : (
                <ul className="space-y-3">
                    {savedViews.map((item: SavedView) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-center bg-stone-100 dark:bg-gray-700 p-3 rounded-lg"
                        >
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Page: {item.view}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setView(item.view)}
                                    className="p-2 text-white bg-primary-500 rounded-full hover:bg-primary-600 transition-colors"
                                    title="Open"
                                >
                                    <Play size={16} weight="fill" />
                                </button>
                                <button
                                    onClick={() => deleteView(item.id)}
                                    className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-200 rounded-full transition-colors"
                                    title="Delete"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

/* ---------------------------------- Page ---------------------------------- */

const Home: React.FC = () => {
    return (
        <div className="space-y-8">
            <HomeHero />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Launch a Scenario</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {scenarios.map(scenario => (
                            <ScenarioCard key={scenario.title} {...scenario} />
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Top Insights</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-3">Since your last visit.</p>
                    <div className="space-y-4">
                        {insightData.map(insight => (
                            <InsightChip key={insight.label} {...insight} />
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <SavedViewsList />
            </div>
        </div>
    );
};

export default Home;
