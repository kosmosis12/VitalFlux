import React from 'react';
import { deviceReliabilityData } from '../constants/data';

const DevicesAndReliability: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Device Model & Firmware Matrix</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Device Model</th>
                            <th scope="col" className="px-6 py-3">Firmware Version</th>
                            <th scope="col" className="px-6 py-3">Utilization (%)</th>
                            <th scope="col" className="px-6 py-3">Issue Rate (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceReliabilityData.map((device, index) => (
                            <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {device.model}
                                </td>
                                <td className="px-6 py-4">{device.firmware}</td>
                                <td className="px-6 py-4">{device.utilization}</td>
                                <td className="px-6 py-4">{device.issues}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DevicesAndReliability;