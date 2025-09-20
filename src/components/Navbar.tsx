// src/components/Navbar.tsx
import React from 'react';
import { useApp } from '../contexts/AppContests';
import { Theme } from '../types';
import { CaretDown, CalendarBlank, FloppyDisk, Moon, Sun, Phone } from '@phosphor-icons/react';

const Navbar: React.FC = () => {
    const { view, theme, setTheme } = useApp();

    const toggleTheme = () => {
        setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{view}</h2>
            </div>
            <div className="flex items-center gap-2">
                <button className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-md px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Global</span>
                    <CaretDown size={16} className="ml-2 text-gray-500" />
                </button>
                <button className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-md px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-400">mm/dd/yyyy</span>
                    <CalendarBlank size={16} className="ml-2 text-gray-500" />
                </button>
                 <button className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-md px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">All Conditions</span>
                    <CaretDown size={16} className="ml-2 text-gray-500" />
                </button>
                 <button className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-md px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Clinical Ops</span>
                    <CaretDown size={16} className="ml-2 text-gray-500" />
                </button>
                 <button className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-md px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">VitalFlux Default</span>
                    <CaretDown size={16} className="ml-2 text-gray-500" />
                </button>

                <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="Save View">
                    <FloppyDisk size={20} />
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="Toggle Theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                 <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="Contact">
                    <Phone size={20} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;