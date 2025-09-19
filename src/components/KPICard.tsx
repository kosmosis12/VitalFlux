// src/components/KPICard.tsx
import React from 'react';

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ElementType
  change: string;
  changeType: 'increase' | 'decrease';
}

const KPICard: React.FC<KPICardProps> = ({ label, value, icon: Icon, change, changeType }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-start justify-between border border-gray-200 dark:border-gray-700">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
        <div className={`flex items-center text-xs mt-2 ${changeColor}`}>
          <span>{change}</span>
        </div>
      </div>
      <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
        <Icon size={24} className="text-primary-500" />
      </div>
    </div>
  );
};

export default KPICard;