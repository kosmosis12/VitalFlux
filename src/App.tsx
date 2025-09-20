// src/App.tsx
import React, { useMemo } from 'react';
import { SisenseContextProvider } from '@sisense/sdk-ui';
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
  // This provider passes Sisense connection details down to all chart widgets.
  // Make sure to replace the placeholder url and token with your credentials.
  return (
    <SisenseContextProvider
      url="https://aesandbox.sisensepoc.com"
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjg2YmUwYmQxYzYzMTJiZmJhMWI0M2I3IiwiYXBpU2VjcmV0IjoiMjQ1NDAwZGUtYjA1My0zOWJkLTUzY2EtODg2MzhmOGZiYzNkIiwiYWxsb3dlZFRlbmFudHMiOlsiNjg2YmRhMjVlYzBmNzYwMDFjZTQxZTI1Il0sInRlbmFudElkIjoiNjg2YmRhMjVlYzBmNzYwMDFjZTQxZTI1IiwiZXhwIjoxNzU4OTgxNTYzfQ.Wg5YII5pYUZNXN8lHC0mkXb3vy-aXRYJNhHWssfjJ-U"
    >
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SisenseContextProvider>
  );
};

export default App;

