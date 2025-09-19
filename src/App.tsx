import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommandCenter from './views/CommandCenter';
import CohortsAndSegments from './views/CohortsAndSegments';
import DevicesAndReliability from './views/DevicesAndReliability';
import Outcomes from './views/Outcomes';
import Home from './views/Home';
import Glossary from './views/Glossary';
import { View } from './types';

const AppContent: React.FC = () => {
    const { view, theme, tenant } = useApp();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderView = () => {
        switch (view) {
            case View.HOME:
                return <Home />;
            case View.COMMAND_CENTER:
                return <CommandCenter />;
            case View.COHORTS_SEGMENTS:
                return <CohortsAndSegments />;
            case View.GLOSSARY:
                return <Glossary />;
            case View.DEVICES_RELIABILITY:
                return <DevicesAndReliability />;
            case View.OUTCOMES:
                return <Outcomes />;
            default:
                return <Home />;
        }
    };

    const primaryColorStyle = useMemo(() => {
        return {
            '--color-primary-500': tenant.theme.primaryColor,
            // You can add more shades here if needed, or derive them.
        };
    }, [tenant.theme.primaryColor]);

    return (
        <div style={primaryColorStyle as React.CSSProperties} className={`${theme} font-sans`}>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header setSidebarOpen={setSidebarOpen} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                        <div className="container mx-auto px-6 py-8">
                            {renderView()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
