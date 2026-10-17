"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  getCryptoByName,
  SUPPORTED_CRYPTOCURRENCIES,
} from "@/src/config/cryptocurrencies";

interface LivePricesProps {
  prices: { [key: string]: string | number };
  selectedAsset: string;
  onSelect: (asset: string) => void;
}

function formatPrice(value: string | number | undefined) {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num) || num <= 0) return "—";
  if (num >= 1000) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (num >= 1) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

function LivePrices({ prices, selectedAsset, onSelect }: LivePricesProps) {
  const t = useTranslations();

  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <h2 className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400">
          {t("markets")}
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2 border-b border-gray-100 px-4 py-2 text-[11px] uppercase tracking-wider text-gray-400 dark:border-gray-800">
        <span>{t("pair")}</span>
        <span className="text-end">{t("price")}</span>
        <span className="text-end">{t("select")}</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {SUPPORTED_CRYPTOCURRENCIES.map((crypto) => {
          const active = selectedAsset === crypto.name;
          const price = prices[crypto.name];
          return (
            <button
              key={crypto.name}
              type="button"
              onClick={() => onSelect(crypto.name)}
              className={`grid w-full grid-cols-3 items-center gap-2 px-4 py-3 text-start transition-colors ${
                active
                  ? "bg-blue-50 dark:bg-blue-500/10"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {crypto.symbol}
                  <span className="text-gray-400">/USDT</span>
                </span>
                <span className="block truncate text-xs text-gray-400">
                  {t(crypto.name)}
                </span>
              </span>
              <span
                className={`text-end text-sm tabular-nums ${
                  active
                    ? "text-blue-600 dark:text-green-400"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {formatPrice(price)}
              </span>
              <span className="text-end">
                <span
                  className={`inline-flex rounded-md px-2 py-1 text-[11px] font-medium ${
                    active
                      ? "bg-blue-600 text-white dark:bg-green-500 dark:text-gray-950"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {active ? t("trading") : t("trade")}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {!getCryptoByName(selectedAsset) && (
        <p className="px-4 py-3 text-xs text-red-500">{t("unknownCrypto")}</p>
      )}
    </div>
  );
}

export default LivePrices;
