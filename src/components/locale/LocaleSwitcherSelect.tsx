'use client';

import { useState } from 'react';
import { Locale } from '@/src/i18n/config';
import { setUserLocale } from './locale';
import { ArrowDown2 } from 'iconsax-react';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
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
    <div className="relative inline-block">
      {/* Dropdown Trigger */}
      <button
        aria-label={label}
        className={`flex items-center justify-between rounded-sm p-2 border transition-colors hover:bg-slate-200 ${
          isPending ? 'pointer-events-none opacity-60' : ''
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{items.find((item) => item.value === selectedValue)?.label || 'Select'}</span>
        <ArrowDown2 size={18} color='black' className={`${isOpen? "rotate-180" : ""}`}/>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 w-full min-w-[8rem] bg-white shadow-md rounded-sm border">
          <ul className="py-1">
            {items.map((item) => (
              <li
                key={item.value}
                className={`px-3 py-2 cursor-pointer hover:bg-slate-100 ${
                  item.value === selectedValue ? 'font-bold text-blue-600' : 'text-gray-900'
                }`}
                onClick={() => handleSelect(item.value)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
