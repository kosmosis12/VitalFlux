// src/App.tsx
import React, { useMemo } from 'react';
import AppProvider, { useApp } from './contexts/AppContests';
import Home from './views/Home';
import CommandCenter from './views/CommandCenter';
import CohortsAndSegments from './views/CohortsAndSegments';
import DevicesAndReliability from './views/DevicesAndReliability';
import Outcomes from './views/Outcomes';
import Glossary from './views/Glossary';
import { View } from './types';

const AppContent: React.FC = () => {
  const { view, tenant } = useApp();

  const renderView = () => {
    switch (view) {
      case View.HOME:
        return <Home />;
      case View.COMMAND_CENTER:
        return <CommandCenter />;
      case View.COHORTS_SEGMENTS:
        return <CohortsAndSegments />;
      case View.DEVICES_RELIABILITY:
        return <DevicesAndReliability />;
      case View.OUTCOMES:
        return <Outcomes />;
      case View.GLOSSARY:
        return <Glossary />;
      default:
        return <Home />;
    }
  };

  // Expose a CSS custom property for your primary color (TypeScript-safe)
  const primaryColorStyle = useMemo(() => {
    return {
      ['--color-primary-500' as any]: tenant.theme.primaryColor,
    } as React.CSSProperties;
  }, [tenant.theme.primaryColor]);

  return (
    // Dark mode class is toggled on <html> in AppProvider; no need to inject theme string here.
    <div style={primaryColorStyle} className="font-sans">
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="container mx-auto px-6 py-8">{renderView()}</div>
      </main>
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

