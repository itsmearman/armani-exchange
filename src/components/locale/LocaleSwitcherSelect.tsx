'use client';

import { useState } from 'react';
import { Locale } from '@/src/i18n/config';
import { setUserLocale } from './locale';
import { ArrowDown2 } from 'iconsax-react';
import Flag from 'react-world-flags'

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string; code: string }>;
  label: string;
  className:string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
  className
}: Props) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  function handleSelect(value: string) {
    const locale = value as Locale;
    setIsPending(true);
    setUserLocale(locale)
      .then(() => {
        setSelectedValue(value);
        setIsOpen(false); // Close the dropdown after selection
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Dropdown Trigger */}
      <button
        aria-label={label}
        className={`flex items-center justify-between rounded-md p-2 border border-gray-300 dark:border-gray-700 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 ${isPending ? 'pointer-events-none opacity-60' : ''
          }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className='flex gap-2'><Flag code={items.find((item) => item.value === selectedValue)?.code }  width={40}/><span className="hidden md:inline">{items.find((item) => item.value === selectedValue)?.label || 'Select'}</span></span>
        <ArrowDown2 size={18} className={`hidden md:inline ${isOpen ? "rotate-180" : ""} stroke-black dark:stroke-white`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bg-white dark:bg-gray-900 mt-2 w-full shadow-md rounded-md border border-gray-300 dark:border-gray-700">
          <ul className="py-1">
            {items.map((item) => (
              <li
                key={item.value}
                className={`flex px-3 py-2 cursor-pointer hover:bg-blue-100 gap-2 ${item.value === selectedValue ? 'font-bold text-green-600 bg-blue-100' : ''
                  }`}
                onClick={() => handleSelect(item.value)}
              >
                <Flag code={item.code} width={35}/>
                <span className="hidden md:inline">
                {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
