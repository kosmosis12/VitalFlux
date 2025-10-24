import React, { useMemo } from 'react';
import { SisenseContextProvider } from '@sisense/sdk-ui';
import AppProvider from './contexts/AppContests';
import { useApp } from './contexts/useApp';
import Home from './views/Home';
import CommandCenter from './views/CommandCenter';
import CohortsAndSegments from './views/CohortsAndSegments';
import DevicesAndReliability from './views/DevicesAndReliability';
import Outcomes from './views/Outcomes';
import Glossary from './views/Glossary';
import { View } from './types';
import Layout from './components/Layout';
import * as DM from './VitalFlux';
import { applyDataSourceOverride } from './config/datasource';

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
  applyDataSourceOverride();
  const sisenseUrl = import.meta.env.VITE_SISENSE_URL as string | undefined;
  const sisenseToken = import.meta.env.VITE_SISENSE_TOKEN as string | null | undefined;

  return (
    <AppProvider>
      <SisenseContextProvider
        url={sisenseUrl || ''}
        token={sisenseToken ?? null}
        defaultDataSource={DM.DataSource}
        onError={(err) => {
          console.error('[SisenseContextProvider error]', err);
          return undefined;
        }}
      >
        <AppContent />
      </SisenseContextProvider>
    </AppProvider>
  );
};

export default App;
