// src/views/CommandCenter.tsx
import React, { useState } from 'react';
import { Plus, X, ChatCircleDots } from '@phosphor-icons/react';
import type { WidgetConfig } from '../services/geminiService';

// Import widget components
import AdherenceRateOverTime from '../components/widgets/AdherenceRateOverTime';
import ActivePatientsByProgram from '../components/widgets/ActivePatientsbyProgram';
import PatientRiskLevelDistribution from '../components/widgets/PatientRiskLevelDistribution';
import ReadmissionsbyCondition from '../components/widgets/ReadmissionsbyCondition';
import AverageCostAvoidancePerProgram from '../components/widgets/AverageCostAvoidanceperProgram';
import GeminiChat from '../components/GeminiChat';
import DynamicAiWidget from '../components/widgets/DynamicAiWidget';
import WidgetWrapper from '../components/WidgetWrapper';
import EscalationsByReasonMonthly from '../components/widgets/EscalationsByReasonMonthly';
import HighRiskPatientsByAgeBand from '../components/widgets/HighRiskPatientsByAgeBand';
import DeviceModelDistribution from '../components/widgets/DeviceModelDistribution';
import ReadmissionRateOverTime from '../components/widgets/ReadmissionRateOverTime';
import ProgramImpactProxyByRegion from '../components/widgets/ProgramImpactProxyByRegion';
import ActivePatientsTrend from '../components/widgets/ActivePatientsTrend';

// Define a type for our widget instances
interface WidgetInstance {
  id: number;
  title: string;
  component: React.ReactElement<any>;  // must be an element for WidgetWrapper children
  isAi: boolean;
  config?: WidgetConfig;          // Store AI config here
}

// Pre-defined widgets from the catalog
const widgetCatalog = {
  adherenceRate: { title: 'Adherence Rate Over Time', component: <AdherenceRateOverTime />, isAi: false },
  activePatients: { title: 'Active Patients by Program', component: <ActivePatientsByProgram />, isAi: false },
  riskDistribution: { title: 'Patient Risk Level Distribution', component: <PatientRiskLevelDistribution />, isAi: false },
  readmissions: { title: '30-Day Readmissions by Condition', component: <ReadmissionsbyCondition />, isAi: false },
  costAvoidance: { title: 'Average Cost Avoidance', component: <AverageCostAvoidancePerProgram />, isAi: false },
  escalationsByReasonMonthly: { title: 'Escalations by Reason (Monthly)', component: <EscalationsByReasonMonthly />, isAi: false },
  highRiskByAgeBand: { title: 'High-Risk Patients by Age Band', component: <HighRiskPatientsByAgeBand />, isAi: false },
  deviceModelDistribution: { title: 'Device Model Distribution', component: <DeviceModelDistribution />, isAi: false },
  readmissionRateOverTime: { title: 'Readmission Rate Over Time', component: <ReadmissionRateOverTime />, isAi: false },
  programImpactProxyByRegion: { title: 'Program Impact Proxy by Region', component: <ProgramImpactProxyByRegion />, isAi: false },
  activePatientsTrend: { title: 'Active Patients Trend', component: <ActivePatientsTrend />, isAi: false },
} as const;

type WidgetKey = keyof typeof widgetCatalog;

const WidgetModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (widgetKey: WidgetKey) => void;
  existingWidgets: WidgetInstance[];
}> = ({ isOpen, onClose, onSelect, existingWidgets }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-stone-50 dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Widget Catalog</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(widgetCatalog).map(([key, { title }]) => {
            const isAdded = existingWidgets.some((w) => w.title === title && !w.isAi);
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key as WidgetKey)}
                disabled={isAdded}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  isAdded
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'hover:bg-primary-100 dark:hover:bg-primary-900'
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CommandCenter: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const addWidget = (widgetData: Omit<WidgetInstance, 'id'>) => {
    if (widgets.length < 4) {
      const newWidget: WidgetInstance = { ...widgetData, id: Date.now() };
      setWidgets((prev) => [...prev, newWidget]);
    }
  };

  const handleAddFromCatalog = (widgetKey: WidgetKey) => {
    addWidget(widgetCatalog[widgetKey]);
    setIsModalOpen(false);
  };

  const handleAiNewWidget = (config: WidgetConfig) => {
    if (widgets.length >= 4) return;

    // Guard: ensure minimal structure from AI so the DynamicAiWidget always mounts
    const chartType = (config as any)?.chartType ?? 'bar';
    const dataOptions =
      (config as any)?.dataOptions ?? { measures: [], dimensions: [], filters: [] };
    const title =
      typeof (config as any)?.title === 'string' && (config as any).title
        ? (config as any).title
        : 'AI-Generated Widget';

    const newWidget: Omit<WidgetInstance, 'id'> = {
      title,
      isAi: true,
      config,
      component: <DynamicAiWidget chartType={chartType as any} dataOptions={dataOptions} />,
    };

    addWidget(newWidget);
  };

  const handleRemoveWidget = (idToRemove: number) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== idToRemove));
  };

  const handleAiError = (message: string) => {
    console.warn('AI Error:', message);
    alert(`AI Error: ${message}`);
  };

  return (
    <div className="relative h-full">
      <div className="space-y-6">
        {widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Command Center is Empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
              Start by adding a widget from the catalog or asking the AI assistant.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Widget from Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {widgets.map((widget) => (
              <WidgetWrapper
                key={widget.id}
                title={widget.title}
                onRemove={() => handleRemoveWidget(widget.id)}
              >
                {widget.component}
              </WidgetWrapper>
            ))}

            {widgets.length < 4 && (
              <div
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center h-96 cursor-pointer hover:bg-stone-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Plus size={32} className="mx-auto" />
                  <p className="mt-2 font-semibold">Add Widget</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen && (
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="bg-primary-500 text-white font-semibold py-3 px-5 rounded-lg shadow-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <ChatCircleDots size={24} />
            VitalFlux AI Assistant
          </button>
        )}
      </div>

      {isChatOpen && <GeminiChat onNewWidget={handleAiNewWidget} onError={handleAiError} />}

      <WidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddFromCatalog}
        existingWidgets={widgets}
      />
    </div>
  );
};

export default CommandCenter;

