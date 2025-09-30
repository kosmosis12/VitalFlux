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
      case View.HOME: return <Home />;
      case View.COMMAND_CENTER: return <CommandCenter />;
      case View.COHORTS_SEGMENTS: return <CohortsAndSegments />;
      case View.DEVICES_RELIABILITY: return <DevicesAndReliability />;
      case View.OUTCOMES: return <Outcomes />;
      case View.GLOSSARY: return <Glossary />;
      default: return <Home />;
    }
  };

  const primaryColorStyle = useMemo(() => {
    return {
      ['--color-primary-500' as any]: tenant.theme.primaryColor,
    } as React.CSSProperties;
  }, [tenant.theme.primaryColor]);

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
        token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjg2YmUwYmQxYzYzMTJiZmJhMWI0M2I3IiwiYXBpU2VjcmV0IjoiMjQ1NDAwZGUtYjA1My0zOWJkLTUzY2EtODg2MzhmOGZiYzNkIiwiYWxsb3dlZFRlbmFudHMiOlsiNjg2YmRhMjVlYzBmNzYwMDFjZTQxZTI1Il0sInRlbmFudElkIjoiNjg2YmRhMjVlYzBmNzYwMDFjZTQxZTI1IiwiZXhwIjoxNzU5ODU1NDA3fQ.UqYNHzKo4QUXQORDb0A6PaeiiSYUYdQ29kcZyS__kr8"
      >
        <AppContent />
      </SisenseContextProvider>
    </AppProvider>
  );
};

export default App;

