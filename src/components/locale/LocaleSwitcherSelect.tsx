"use client";

import { useEffect, useRef, useState } from "react";
import { Locale } from "@/src/i18n/config";
import { setUserLocale } from "./locale";
import { ArrowDown2 } from "iconsax-react";
import Flag from "react-world-flags";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string; code: string }>;
  label: string;
  className: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
  className,
}: Props) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function handleSelect(value: string) {
    const locale = value as Locale;
    setIsPending(true);
    setUserLocale(locale)
      .then(() => {
        setSelectedValue(value);
        setIsOpen(false);
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  const selected = items.find((item) => item.value === selectedValue);

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 ${
          isPending ? "pointer-events-none opacity-60" : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Flag code={selected?.code} width={22} />
        <span className="hidden text-xs font-medium lg:inline">
          {selected?.label || "Select"}
        </span>
        <ArrowDown2
          size={14}
          className={`stroke-current transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute start-0 top-full z-50 mt-2 min-w-[9.5rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <ul>
            {items.map((item) => (
              <li key={item.value}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm transition hover:bg-blue-50 dark:hover:bg-gray-800 ${
                    item.value === selectedValue
                      ? "bg-blue-50 font-semibold text-blue-600 dark:bg-green-500/10 dark:text-green-400"
                      : ""
                  }`}
                  onClick={() => handleSelect(item.value)}
                >
                  <Flag code={item.code} width={24} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
