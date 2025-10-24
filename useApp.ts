import { useContext } from 'react';
import { AppContext } from './AppContests';
import type { AppContextType } from './AppContests';

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
