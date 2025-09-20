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
import Layout from './components/Layout';

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
    // Dark mode class is toggled on <html> in AppProvider.
    <div style={primaryColorStyle} className="font-sans">
      <Layout>
        {renderView()}
      </Layout>
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

