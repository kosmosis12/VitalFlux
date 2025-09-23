import React, { useState } from 'react';
import { Plus, X } from '@phosphor-icons/react';

// Import all widgets
import AdherenceRateOverTime from '../components/widgets/AdherenceRateOverTime';
import ActivePatientsByProgram from '../components/widgets/ActivePatientsbyProgram';
import PatientRiskLevelDistribution from '../components/widgets/PatientRiskLevelDistribution';
import ReadmissionsbyCondition from '../components/widgets/ReadmissionsbyCondition';
import AverageCostAvoidancePerProgram from '../components/widgets/AverageCostAvoidanceperProgram';

// Import AI components
import GeminiChat from '../components/GeminiChat';
import DynamicAiWidget from '../components/widgets/DynamicAiWidget';

const widgetCatalog = {
  adherenceRate: { title: 'Adherence Rate Over Time', component: <AdherenceRateOverTime /> },
  activePatients: { title: 'Active Patients by Program', component: <ActivePatientsByProgram /> },
  riskDistribution: { title: 'Patient Risk Level Distribution', component: <PatientRiskLevelDistribution /> },
  readmissions: { title: '30-Day Readmissions by Condition', component: <ReadmissionsbyCondition /> },
  costAvoidance: { title: 'Average Cost Avoidance', component: <AverageCostAvoidancePerProgram /> },
};
type WidgetKey = keyof typeof widgetCatalog;

// This is the corrected, self-contained WidgetModal component
const WidgetModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (widgetKey: WidgetKey) => void;
  existingWidgets: any[];
}> = ({ isOpen, onClose, onSelect, existingWidgets }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Widget Catalog</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(widgetCatalog).map(([key, { title }]) => {
            const isAdded = existingWidgets.some(w => w.title === title);
            return (
              <button
                key={key}
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
  const [catalogWidgets, setCatalogWidgets] = useState<any[]>([]); // For user-selected widgets
  const [aiWidgets, setAiWidgets] = useState<any[]>([]); // For AI-generated widgets
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddWidget = (widgetKey: WidgetKey) => {
    if ((catalogWidgets.length + aiWidgets.length) < 4) {
      setCatalogWidgets(prev => [...prev, widgetCatalog[widgetKey]]);
    }
    setIsModalOpen(false);
  };
  
  const handleRemoveCatalogWidget = (indexToRemove: number) => {
    setCatalogWidgets(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleRemoveAiWidget = (indexToRemove: number) => {
    setAiWidgets(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAiNewWidget = (config: any) => {
    if ((catalogWidgets.length + aiWidgets.length) < 4) {
      setAiWidgets(prev => [...prev, config]);
    }
  };
  
  const handleAiError = (message: string) => {
      // You can add a toast notification here if you like
      console.warn("AI Error:", message);
  };

  const totalWidgets = catalogWidgets.length + aiWidgets.length;

  return (
    <div className="space-y-6">
      {totalWidgets === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Command Center is Empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Start by adding a widget from the catalog or asking the AI assistant.</p>
          <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
              <Plus size={18} />
              Add Widget from Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Render Catalog Widgets */}
          {catalogWidgets.map((widget, index) => (
            <div key={`catalog-${index}`} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">{widget.title}</h3>
                <button onClick={() => handleRemoveCatalogWidget(index)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Remove Widget">
                   <X size={16} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="flex-grow h-full">{widget.component}</div>
            </div>
          ))}

          {/* Render AI Widgets */}
          {aiWidgets.map((config, index) => (
             <div key={`ai-${index}`} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">{config.title ?? 'AI Chart'}</h3>
                 <button onClick={() => handleRemoveAiWidget(index)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Remove Widget">
                   <X size={16} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <DynamicAiWidget chartType={config.chartType} dataOptions={config.dataOptions} />
            </div>
          ))}

          {/* Render "Add Widget" placeholder if there's space */}
          {totalWidgets < 4 && (
            <div onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center h-96 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <Plus size={32} className="mx-auto" />
                    <p className="mt-2 font-semibold">Add Widget</p>
                </div>
            </div>
          )}
        </div>
      )}

      {/* The AI Chat component is now always rendered */}
      <GeminiChat onNewWidget={handleAiNewWidget} onError={handleAiError} />

      {/* The modal is still available */}
      <WidgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleAddWidget} existingWidgets={[...catalogWidgets, ...aiWidgets]} />
    </div>
  );
};

export default CommandCenter;