// src/components/ChartCard.tsx
import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col">
      <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">{title}</h3>
      <div className="flex-grow h-96">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;