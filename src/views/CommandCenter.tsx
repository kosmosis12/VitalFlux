import React, { useState } from 'react';
import KPICard from '../components/KPICard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { useApp } from '../contexts/AppContext';
// FIX: Updated icon names to support the installed version of @phosphor-icons/react.
import { Heartbeat, ChartLineUp, WarningCircle, FirstAidKit, Plus, X } from '@phosphor-icons/react';
import { adherenceData, escalationsData, riskData } from '../constants/data';
import { Role } from '../types';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';

const GridLayout = WidthProvider(ReactGridLayout);

// --- Widget Components ---

const AdherenceTrendWidget: React.FC<{ isDark: boolean; chartColor: string; }> = ({ isDark, chartColor }) => (
    <div className="w-full h-full p-4">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={adherenceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
                <XAxis dataKey="week" stroke={isDark ? '#A0AEC0' : '#4A5568'} />
                <YAxis stroke={isDark ? '#A0AEC0' : '#4A5568'} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }}/>
                <Area type="monotone" dataKey="adherence" stroke={chartColor} fill="url(#colorAdherence)" strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const EscalationsByReasonWidget: React.FC<{ isDark: boolean; chartColor: string; }> = ({ isDark, chartColor }) => (
    <div className="w-full h-full p-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={escalationsData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
                <XAxis type="number" stroke={isDark ? '#A0AEC0' : '#4A5568'} />
                <YAxis dataKey="reason" type="category" width={80} stroke={isDark ? '#A0AEC0' : '#4A5568'} tick={{fontSize: 12}}/>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }}/>
                <Legend />
                <Bar dataKey="count" fill={chartColor} name="Count" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

const PatientRiskTableWidget: React.FC<{ privacyMode: boolean }> = ({ privacyMode }) => {
    const getRiskColor = (risk: string) => {
        if (risk === 'High') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        if (risk === 'Medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:yellow-red-200';
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    };
    return (
        <div className="w-full h-full p-4 overflow-y-auto">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Patient ID</th>
                            <th scope="col" className="px-6 py-3">Condition</th>
                            <th scope="col" className="px-6 py-3">Risk Level</th>
                            <th scope="col" className="px-6 py-3">Adherence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riskData.map(patient => (
                            <tr key={patient.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {privacyMode ? `*****${patient.id.slice(-4)}` : patient.id}
                                </td>
                                <td className="px-6 py-4">{patient.condition}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(patient.risk)}`}>
                                        {patient.risk}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{patient.adherence}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const availableWidgets = [
    { id: 'adherence', name: 'Adherence Trend', defaultW: 6, defaultH: 8, minW: 4, minH: 6, component: AdherenceTrendWidget },
    { id: 'escalations', name: 'Escalations by Reason', defaultW: 6, defaultH: 8, minW: 4, minH: 6, component: EscalationsByReasonWidget },
    { id: 'risk', name: 'High-Risk Patients', defaultW: 12, defaultH: 8, minW: 6, minH: 6, component: PatientRiskTableWidget },
];


const CommandCenter: React.FC = () => {
    const { theme, role, privacyMode } = useApp();
    const isDark = theme === 'dark';
    const chartColor = "var(--color-primary-500)";
    
    const [isAddingWidget, setIsAddingWidget] = useState(false);
    const [dashboardItems, setDashboardItems] = useState<ReactGridLayout.Layout[]>([]);

    const addWidget = (widgetId: string) => {
        const widgetDef = availableWidgets.find(w => w.id === widgetId);
        if (!widgetDef) return;

        const newItem: ReactGridLayout.Layout = {
            i: `${widgetId}-${Date.now()}`,
            x: (dashboardItems.length * widgetDef.defaultW) % 12,
            y: Infinity, // This tells react-grid-layout to stack it at the bottom
            w: widgetDef.defaultW,
            h: widgetDef.defaultH,
            minW: widgetDef.minW,
            minH: widgetDef.minH,
        };
        setDashboardItems([...dashboardItems, newItem]);
        setIsAddingWidget(false);
    };

    const removeWidget = (itemId: string) => {
        setDashboardItems(dashboardItems.filter(item => item.i !== itemId));
    };

    const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
        setDashboardItems(layout);
    };

    const renderWidget = (item: ReactGridLayout.Layout) => {
        const widgetId = item.i.split('-')[0];
        const widgetDef = availableWidgets.find(w => w.id === widgetId);
        if (!widgetDef) return null;

        const WidgetComponent = widgetDef.component;

        return (
            <div key={item.i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-2 border-b dark:border-gray-700 flex justify-between items-center cursor-move bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 ml-2">{widgetDef.name}</h3>
                    <button onClick={() => removeWidget(item.i)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <X size={16} className="text-gray-600 dark:text-gray-300"/>
                    </button>
                </div>
                <div className="flex-grow relative">
                    <WidgetComponent isDark={isDark} chartColor={chartColor} privacyMode={privacyMode} />
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard label="Active Patients" value="1,248" icon={Heartbeat} change="+12" changeType="increase" />
                <KPICard label="Avg Adherence" value="82%" icon={ChartLineUp} change="-1.2%" changeType="decrease" />
                <KPICard label="Escalations/100" value="4.7" icon={WarningCircle} change="+0.5" changeType="increase" />
                <KPICard label="30d Readmit %" value="7.9%" icon={FirstAidKit} change="-0.8%" changeType="decrease" />
            </div>

            {role === Role.CLIN_OPS && (
                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setIsAddingWidget(!isAddingWidget)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-colors shadow"
                    >
                        <Plus size={16} weight="bold" />
                        Add Widget
                    </button>
                    {isAddingWidget && (
                         <div 
                             className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                         >
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {availableWidgets.map(w => (
                                    <a
                                        key={w.id}
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); addWidget(w.id); }}
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        role="menuitem"
                                    >
                                        {w.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <GridLayout
                className="layout"
                layout={dashboardItems}
                onLayoutChange={onLayoutChange}
                cols={12}
                rowHeight={30}
                isBounded={true}
                draggableHandle=".cursor-move"
            >
                {dashboardItems.map(item => renderWidget(item))}
            </GridLayout>
        </div>
    );
};

export default CommandCenter;