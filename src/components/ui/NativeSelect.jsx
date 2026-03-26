/**
 * NativeSelect — Mobile-first select replacement.
 * On mobile: renders a bottom-sheet picker (native-feel).
 * On desktop: renders a styled native <select>.
 */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

function BottomSheet({ open, onClose, title, options, value, onChange }) {
  // Prevent background scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="relative bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Options */}
        <ul
          role="listbox"
          className="overflow-y-auto flex-1 py-2"
        >
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  'flex items-center justify-between px-5 py-4 cursor-pointer transition-colors text-base',
                  'min-h-[56px]',
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100'
                )}
                onClick={() => { onChange(opt.value); onClose(); }}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body
  );
}

/**
 * @param {object} props
 * @param {string} props.value
 * @param {function} props.onChange - called with the new value string
 * @param {Array<{value: string, label: string}>} props.options
 * @param {string} [props.placeholder]
 * @param {string} [props.title] - Bottom sheet title
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {boolean} [props.disabled]
 */
export default function NativeSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  title = 'Select an option',
  className,
  id,
  disabled = false,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label ?? placeholder;

  // On desktop, use a real native <select> for accessibility/keyboard nav
  // On mobile (touch devices / narrow screens), use bottom sheet
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (!isTouchDevice) {
    // Desktop: styled native select
    return (
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 min-h-[44px] border border-slate-300 dark:border-slate-600 rounded-lg',
          'bg-white dark:bg-slate-700 text-slate-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'text-sm',
          className
        )}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  // Mobile: trigger button + bottom sheet
  return (
    <>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setSheetOpen(true)}
        aria-haspopup="listbox"
        aria-expanded={sheetOpen}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 min-h-[44px]',
          'border border-slate-300 dark:border-slate-600 rounded-lg',
          'bg-white dark:bg-slate-700 text-slate-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'text-sm text-left',
          className
        )}
      >
        <span className={value ? '' : 'text-slate-400 dark:text-slate-500'}>
          {selectedLabel}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </button>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={title}
        options={options}
        value={value}
        onChange={onChange}
      />
    </>
  );
}