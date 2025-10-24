import React, { useState, useRef, useEffect } from 'react';
import { PaintBrush, X } from '@phosphor-icons/react';
import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';

interface WidgetWrapperProps {
  title: string;
  // Child may or may not support a `color` prop
  children: React.ReactElement<{ color?: string }>;
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (pickerRef.current && t && !pickerRef.current.contains(t)) setIsPickerOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleColorChange = (cr: ColorResult) => setColor(cr.hex);

  // Safely clone: only add `color` prop; components that ignore it won't break.
  const widgetWithColor = React.isValidElement(children)
    ? React.cloneElement<{ color?: string }>(children, { color })
    : children;

  return (
    <div className="bg-stone-50 dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
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
            <div ref={pickerRef} className="absolute top-full right-0 mt-2 z-50" role="dialog" aria-label="Color Picker">
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
