import React, { useState, useRef, useEffect } from 'react';
import { PaintBrush, X } from '@phosphor-icons/react';
import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';

// Type to ensure that the child component can accept an optional color prop
type WithOptionalColor<P = {}> = P & { color?: string };

interface WidgetWrapperProps {
  title: string;
  /** The actual widget component; should optionally accept a `color` prop */
  children: React.ReactElement<WithOptionalColor>;
  onRemove: () => void;
  initialColor?: string;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  title,
  children,
  onRemove,
  initialColor = '#3b82f6',
}) => {
  const [color, setColor] = useState<string>(initialColor);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close color picker when clicking outside of it (SSR-safe)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (pickerRef.current && target && !pickerRef.current.contains(target)) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (colorResult: ColorResult) => {
    setColor(colorResult.hex);
  };

  // Clone the child widget and inject the `color` prop
  const widgetWithColor = React.cloneElement(children, { color });

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">{title}</h3>

        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => setIsPickerOpen((v) => !v)}
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

          {/* Color Picker Popover */}
          {isPickerOpen && (
            <div
              ref={pickerRef}
              className="absolute top-full right-0 mt-2 z-50"
              role="dialog"
              aria-label="Color Picker"
            >
              <SketchPicker color={color} onChangeComplete={handleColorChange} />
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow h-full">{widgetWithColor}</div>
    </div>
  );
};

export default WidgetWrapper;
