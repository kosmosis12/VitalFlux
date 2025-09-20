// src/components/Sidebar.tsx
import React from 'react';
import { useApp } from '../contexts/AppContests';
import { View } from '../types';
import { House, Gauge, Users, Book, Question, SignOut } from '@phosphor-icons/react';

const navItems = [
  { view: View.HOME, label: 'Home', icon: House },
  { view: View.COMMAND_CENTER, label: 'Command Center', icon: Gauge },
  { view: View.COHORTS_SEGMENTS, label: 'Cohorts & Segments', icon: Users },
  { view: View.GLOSSARY, label: 'Glossary', icon: Book },
];

const Sidebar: React.FC = () => {
  const { view, setView } = useApp();

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-start px-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">VitalFlux</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.view}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setView(item.view);
            }}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
              ${
                view === item.view
                  ? 'bg-primary-500 text-white shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <item.icon size={20} className="mr-3" weight={view === item.view ? 'fill' : 'regular'} />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <a
          href="#"
          className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Question size={20} className="mr-3" />
          Help
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <SignOut size={20} className="mr-3" />
          Logout
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;