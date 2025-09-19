// src/constants/data.ts
import { ChartLineUp, FirstAidKit, UserList, Pulse } from '@phosphor-icons/react';
import { View } from '../types';

export const scenarios = [
    { icon: ChartLineUp, title: 'Command Center', description: 'Monitor real-time operational KPIs.', targetView: View.COMMAND_CENTER },
    { icon: UserList, title: 'Cohorts & Segments', description: 'Compare performance across patient populations.', targetView: View.COHORTS_SEGMENTS },
    { icon: FirstAidKit, title: 'Outcomes (Exec Lens)', description: 'Analyze high-level outcomes and cost avoidance.', targetView: View.OUTCOMES },
    // Replaced the invalid 'Activity' icon with 'Pulse'
    { icon: Pulse, title: 'Devices & Reliability', description: 'Track device utilization and issue rates.', targetView: View.DEVICES_RELIABILITY },
];

const generateSparkData = () => Array.from({ length: 20 }, (_, i) => ({ name: `D${i}`, v: Math.floor(Math.random() * 50) }));

export const insightData = [
    { label: 'HTN Cohort Adherence', value: '89%', delta: '+4%', deltaType: 'increase' as const, sparkData: generateSparkData(), color: 'green', fill: 'var(--color-primary-500)' },
    { label: 'CHF Readmission Rate', value: '10.2%', delta: '+1.1%', deltaType: 'increase' as const, sparkData: generateSparkData(), color: 'red', fill: '#EF4444' },
    { label: 'Device Sync Failures', value: '1.2%', delta: '-0.3%', deltaType: 'decrease' as const, sparkData: generateSparkData(), color: 'red', fill: '#F59E0B' },
];

export const deviceReliabilityData = [
    { model: 'CardioFlux-100', firmware: '2.1.3', utilization: 98.5, issues: 0.8 },
    { model: 'OxyLink-2', firmware: '1.5.0', utilization: 97.2, issues: 1.3 },
];