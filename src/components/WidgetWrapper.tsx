import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PaintBrush, X } from '@phosphor-icons/react';
import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';

// This new type defines the props that the wrapper will pass down to its children.
// - colorMapping: An object where keys are category names (e.g., "RPM", "High Risk") and values are color strings.
// - onCategoriesAvailable: A callback function for the child chart to inform the wrapper of its categories.
type WithColorConfiguration<P = {}> = P & {
  colorMapping?: Record<string, string>;
  onCategoriesAvailable?: (categories: string[]) => void;
};

interface WidgetWrapperProps {
  title: string;
  /** The child widget, which should be able to handle the color configuration props. */
  children: React.ReactElement<WithColorConfiguration<any>>;
  onRemove: () => void;
  initialColor?: string;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  title,
  children,
  onRemove,
  initialColor = '#3b82f6',
}) => {
  // Holds the color for each individual category (e.g., {'RPM': '#ff0000', 'CCM': '#00ff00'}).
  const [colorMapping, setColorMapping] = useState<Record<string, string>>({});
  // Holds the list of categories populated by the child chart (e.g., ['RPM', 'CCM']).
  const [categories, setCategories] = useState<string[]>([]);
  // Tracks which category is currently selected in the color picker UI.
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Callback for the child chart to register its categories with the wrapper.
  const handleCategoriesAvailable = useCallback((availableCategories: string[]) => {
    setCategories(availableCategories);
    if (availableCategories.length > 0 && !activeCategory) {
      setActiveCategory(availableCategories[0]);
    }
  }, [activeCategory]);

  // Initialize the color mapping when categories are first loaded from the child.
  useEffect(() => {
    if (categories.length > 0) {
      const initialMapping: Record<string, string> = {};
      categories.forEach(cat => {
        // Use existing color if available, otherwise fallback to the initial color.
        initialMapping[cat] = colorMapping[cat] || initialColor;
      });
      setColorMapping(initialMapping);
      if (!activeCategory) {
        setActiveCategory(categories[0]);
      }
    }
  }, [categories, initialColor]);

  // Effect to close the color picker when clicking outside of it.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update the color for the currently active category.
  const handleColorChange = (colorResult: ColorResult) => {
    if (activeCategory) {
      setColorMapping(prev => ({
        ...prev,
        [activeCategory]: colorResult.hex,
      }));
    }
  };

  // Clone the child component to inject the color mapping and the category callback.
  const widgetWithProps = React.cloneElement(children, {
    colorMapping: colorMapping,
    onCategoriesAvailable: handleCategoriesAvailable,
  });

  const activeColor = activeCategory ? colorMapping[activeCategory] || initialColor : initialColor;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">{title}</h3>
        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => setIsPickerOpen(v => !v)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Change Color"
            aria-haspopup="dialog"
            aria-expanded={isPickerOpen}
          >
            <PaintBrush size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Remove Widget"
          >
            <X size={16} className="text-gray-500 dark:text-gray-400" />
          </button>

          {isPickerOpen && (
            <div
              ref={pickerRef}
              className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700"
              role="dialog"
              aria-label="Color Picker"
            >
              <div className="flex">
                {/* UI for selecting which item to color */}
                <div className="w-40 border-r dark:border-gray-700 p-2 max-h-64 overflow-y-auto">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 pb-2">Items</h4>
                  <div className="space-y-1">
                    {categories.length > 0 ? categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left text-sm px-2 py-1 rounded flex items-center gap-2 ${activeCategory === category ? 'bg-primary-100 dark:bg-primary-900 font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border dark:border-gray-600"
                          style={{ backgroundColor: colorMapping[category] || initialColor }}
                        />
                        <span className="truncate" title={category}>{category}</span>
                      </button>
                    )) : (
                      <div className="px-2 py-1 text-xs text-gray-400">No items to color.</div>
                    )}
                  </div>
                </div>
                {/* The color picker itself */}
                <div>
                  <SketchPicker
                    color={activeColor}
                    onChangeComplete={handleColorChange}
                    disableAlpha={true}
                    presetColors={[]}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow h-full">{widgetWithProps}</div>
    </div>
  );
};

export default WidgetWrapper;
