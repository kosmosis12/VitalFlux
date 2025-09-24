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
  const { view, primaryColor } = useApp(); // Get primaryColor from the context

  const renderView = () => {
    switch (view) {
      case View.HOME: return <Home />;
      case View.COMMAND_CENTER: return <CommandCenter />;
      case View.COHORTS_SEGMENTS: return <CohortsAndSegments />;
      case View.DEVICES_RELIABILITY: return <DevicesAndReliability />;
      case View.OUTCOMES: return <Outcomes />;
      case View.GLOSSARY: return <Glossary />;
      default: return <Home />;
    }
  };

  // The style will now update whenever primaryColor changes in the context
  const primaryColorStyle = useMemo(() => {
    return {
      ['--color-primary-500' as any]: primaryColor,
    } as React.CSSProperties;
  }, [primaryColor]);

  return (
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
      <SisenseContextProvider
        url="https://aesandbox.sisensepoc.com"
        token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjg2YmUwYmQxYzYzMTJiZmJhMWI0M2I3IiwiYXBpU2VjcmV0IjoiMjQ1NDAwZGUtYjA1My0zOWJkLTUzY2EtODg2MzhmOGZiYzNkIiwiYWxsb3dlZFRlbmFudHMiOlsiNjg2YmRhMjVlYzBmNzYwMDFjZTQxZTI1IldsfQ.l1VSRS8uoWXa40mEYjR2_aN8IgqrMjDDTmtF2YGzCOk"
      >
        <AppContent />
      </SisenseContextProvider>
    </AppProvider>
  );
};

export default App;

