// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/useApp';
import { Theme, Role } from '../types';
import { 
    CaretDown, 
    CalendarBlank, 
    FloppyDisk, 
    Moon, 
    Sun, 
    Phone,
    CheckCircle,
    X
} from '@phosphor-icons/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Dropdown options
const regionOptions = ['Global', 'North America', 'EMEA', 'APAC'];
const conditionOptions = ['All Conditions', 'CHF', 'HTN', 'T2D'];
const roleOptions = [Role.CLIN_OPS, Role.EXEC, Role.OEM];

// A generic dropdown component to handle filters and saved views
const Dropdown: React.FC<{
    label: string;
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}> = ({ label, options, selected, onSelect, isOpen, setIsOpen }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center bg-stone-100 dark:bg-gray-900 rounded-md px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
                <CaretDown size={16} className={`ml-2 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-48 bg-stone-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                    {options.length > 0 ? options.map((option) => (
                        <a
                            key={option}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onSelect(option);
                                setIsOpen(false);
                            }}
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-stone-100 dark:hover:bg-gray-700"
                        >
                            {option}
                            {selected === option && <CheckCircle size={16} className="text-primary-500" />}
                        </a>
                    )) : (
                         <span className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No saved views</span>
                    )}
                </div>
            )}
        </div>
    );
};

// Save View Modal Component
const SaveViewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;
    
    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
            setName('');
            onClose();
        }
    }

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-stone-50 dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Save Current View</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-200 dark:hover:bg-gray-700">
                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Enter a name for your current view configuration.</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 'My Weekly CHF Dashboard'"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-stone-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-stone-100 dark:bg-gray-700 hover:bg-stone-200 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-300" disabled={!name.trim()}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}


const Navbar: React.FC = () => {
    const { view, theme, setTheme, role, setRole, savedViews, saveCurrentView, setView } = useApp();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [startDate, setStartDate] = useState(new Date());
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
    };
    
    const handleSaveViewSelect = (viewName: string) => {
        const selectedSavedView = savedViews.find(sv => sv.name === viewName);
        if (selectedSavedView) {
            setView(selectedSavedView.view);
        }
    }

    return (
        <header className="h-16 bg-stone-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{view}</h2>
            </div>
            <div className="flex items-center gap-2">
                {/* Filters */}
                <Dropdown label="Global" options={regionOptions} selected="Global" onSelect={() => {}} isOpen={openDropdown === 'region'} setIsOpen={(val) => setOpenDropdown(val ? 'region' : null)} />
                
                <div className="relative">
                    <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => date && setStartDate(date)}
                        customInput={
                            <button className="flex items-center bg-stone-100 dark:bg-gray-900 rounded-md px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
                                <span className="text-sm text-gray-700 dark:text-gray-200">{startDate.toLocaleDateString()}</span>
                                <CalendarBlank size={16} className="ml-2 text-gray-500" />
                            </button>
                        }
                    />
                </div>
                
                <Dropdown label="All Conditions" options={conditionOptions} selected="All Conditions" onSelect={() => {}} isOpen={openDropdown === 'condition'} setIsOpen={(val) => setOpenDropdown(val ? 'condition' : null)} />
                <Dropdown label={role} options={roleOptions} selected={role} onSelect={(r) => setRole(r as Role)} isOpen={openDropdown === 'role'} setIsOpen={(val) => setOpenDropdown(val ? 'role' : null)} />
                <Dropdown label="My Views" options={savedViews.map(v => v.name)} selected={''} onSelect={handleSaveViewSelect} isOpen={openDropdown === 'savedViews'} setIsOpen={(val) => setOpenDropdown(val ? 'savedViews' : null)} />

                {/* Action Icons */}
                <button onClick={() => setIsSaveModalOpen(true)} className="p-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="Save View">
                    <FloppyDisk size={20} />
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                 <button className="p-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="Contact Support">
                    <Phone size={20} />
                </button>
            </div>
            
            <SaveViewModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={saveCurrentView} />
        </header>
    );
};

export default Navbar;
