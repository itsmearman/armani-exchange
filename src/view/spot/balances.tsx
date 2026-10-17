"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  getCryptoByName,
  SUPPORTED_CRYPTOCURRENCIES,
} from "@/src/config/cryptocurrencies";

interface BalancesProps {
  cashBalance: number;
  cryptoBalance: {
    [key: string]: number;
  };
  prices: { [key: string]: string | number };
}

function Balances({ cashBalance, cryptoBalance, prices }: BalancesProps) {
  const t = useTranslations();

  const holdings = SUPPORTED_CRYPTOCURRENCIES.filter(
    (crypto) => (cryptoBalance[crypto.name] || 0) > 0
  );

  const portfolioValue =
    cashBalance +
    holdings.reduce((sum, crypto) => {
      const amount = cryptoBalance[crypto.name] || 0;
      const price = Number(prices[crypto.name]) || 0;
      return sum + amount * price;
    }, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">
            {t("portfolio")}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            ${portfolioValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-end dark:bg-emerald-500/10">
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            {t("availableCash")}
          </p>
          <p className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
            ${cashBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        <div className="min-w-[140px] shrink-0 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-400">USDT</p>
          <p className="mt-1 text-sm font-semibold tabular-nums">
            {cashBalance.toFixed(2)}
          </p>
          <p className="text-[11px] text-gray-400">{t("cash")}</p>
        </div>

        {(holdings.length > 0
          ? holdings
          : SUPPORTED_CRYPTOCURRENCIES.slice(0, 4)
        ).map((crypto) => {
          const amount = cryptoBalance[crypto.name] || 0;
          const price = Number(prices[crypto.name]) || 0;
          const meta = getCryptoByName(crypto.name);
          return (
            <div
              key={crypto.name}
              className="min-w-[140px] shrink-0 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-xs text-gray-400">{meta?.symbol}</p>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {amount.toFixed(amount >= 1 ? 4 : 6)}
              </p>
              <p className="text-[11px] text-gray-400">
                ≈ ${(amount * price).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Balances;
