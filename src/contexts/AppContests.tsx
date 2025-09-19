// AppContests.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// ⬅️ Value imports for enums/constants used at runtime
import { View, Role, Theme } from '../types';

// ⬅️ Type-only imports for pure types
import type { Tenant, SavedView } from '../types';

// Placeholder TENANTS; replace with your real data when ready
const TENANTS: Tenant[] = [
  { name: 'Default Tenant', logo: '', theme: { primaryColor: '#3b82f6' } },
];

interface AppContextType {
  view: View;
  setView: (view: View) => void;
  role: Role;
  setRole: (role: Role) => void;
  privacyMode: boolean;
  setPrivacyMode: (enabled: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  tenant: Tenant;
  setTenant: (tenant: Tenant) => void;
  savedViews: SavedView[];
  saveCurrentView: (name: string) => void;
  deleteView: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<View>(View.HOME);
  const [role, setRole] = useState<Role>(Role.CLIN_OPS);
  const [privacyMode, setPrivacyMode] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [tenant, setTenant] = useState<Tenant>(TENANTS[0]);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);

  // toggle dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === Theme.DARK) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // load saved views once
  useEffect(() => {
    try {
      const storedViews = localStorage.getItem('vitalflux_saved_views');
      if (storedViews) {
        const parsed = JSON.parse(storedViews) as SavedView[];
        setSavedViews(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load saved views from localStorage', error);
    }
  }, []);

  const saveCurrentView = (name: string) => {
    const newView: SavedView = {
      id: new Date().toISOString(),
      name,
      view,
    };
    const updatedViews = [...savedViews, newView];
    setSavedViews(updatedViews);
    localStorage.setItem('vitalflux_saved_views', JSON.stringify(updatedViews));
  };

  const deleteView = (id: string) => {
    const updatedViews = savedViews.filter((v) => v.id !== id);
    setSavedViews(updatedViews);
    localStorage.setItem('vitalflux_saved_views', JSON.stringify(updatedViews));
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        role,
        setRole,
        privacyMode,
        setPrivacyMode,
        theme,
        setTheme,
        tenant,
        setTenant,
        savedViews,
        saveCurrentView,
        deleteView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export default AppProvider;

