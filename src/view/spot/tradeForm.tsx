"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/src/components/modal";
import {
  getCryptoByName,
  SUPPORTED_CRYPTOCURRENCIES,
} from "@/src/config/cryptocurrencies";

interface TradeFormProps {
  prices: { [key: string]: string | number };
  onTrade: (type: "buy" | "sell", asset: string, amount: number) => void;
  cryptoBalance: {
    [key: string]: number;
  };
  cashBalance: number;
  selectedAsset: string;
  onSelectAsset: (asset: string) => void;
}

const PERCENTS = [25, 50, 75, 100] as const;

export default function TradeForm({
  prices,
  onTrade,
  cryptoBalance,
  cashBalance,
  selectedAsset,
  onSelectAsset,
}: TradeFormProps) {
  const t = useTranslations();
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeAmount, setTradeAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const crypto = getCryptoByName(selectedAsset);
  const currentPrice = useMemo(() => {
    const raw = prices[selectedAsset];
    const num = typeof raw === "number" ? raw : parseFloat(String(raw));
    return Number.isFinite(num) ? num : 0;
  }, [prices, selectedAsset]);

  const estimated = useMemo(() => {
    if (tradeAmount) {
      const usd = parseFloat(tradeAmount);
      if (!Number.isFinite(usd) || currentPrice <= 0) return null;
      return {
        qty: usd / currentPrice,
        total: usd,
      };
    }
    if (cryptoAmount) {
      const qty = parseFloat(cryptoAmount);
      if (!Number.isFinite(qty) || currentPrice <= 0) return null;
      return {
        qty,
        total: qty * currentPrice,
      };
    }
    return null;
  }, [tradeAmount, cryptoAmount, currentPrice]);

  const handlePercent = (percent: number) => {
    if (tradeType === "buy") {
      const usd = (cashBalance * percent) / 100;
      setTradeAmount(usd.toFixed(2));
      setCryptoAmount("");
      return;
    }
    const qty = ((cryptoBalance[selectedAsset] || 0) * percent) / 100;
    setCryptoAmount(qty.toFixed(6));
    setTradeAmount("");
  };

  const handleSubmit = () => {
    const totalAmount = parseFloat(parseFloat(tradeAmount || "0").toFixed(2));
    const cryptoQty = parseFloat(parseFloat(cryptoAmount || "0").toFixed(6));

    if ((!totalAmount && !cryptoQty) || currentPrice <= 0) {
      setModalMessage(t("enterCustomPrice"));
      setIsModalOpen(true);
      return;
    }

    if (totalAmount && cryptoQty) {
      setModalMessage(t("justOneFieldComplete"));
      setIsModalOpen(true);
      return;
    }

    let calculatedAmount = totalAmount ? totalAmount / currentPrice : cryptoQty;

    if (calculatedAmount <= 0) {
      setModalMessage(t("Invalidate"));
      setIsModalOpen(true);
      return;
    }

    if (tradeType === "sell") {
      const availableBalance = cryptoBalance[selectedAsset] || 0;
      if (availableBalance < calculatedAmount - 0.000001) {
        setModalMessage(t("notEnough"));
        setIsModalOpen(true);
        return;
      }
      if (availableBalance - calculatedAmount < 0.000001) {
        calculatedAmount = availableBalance;
      }
    }

    onTrade(tradeType, selectedAsset, calculatedAmount);
    setTradeAmount("");
    setCryptoAmount("");
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />

      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setTradeType("buy")}
            className={`py-3 text-sm font-semibold transition-colors ${
              tradeType === "buy"
                ? "bg-emerald-500 text-white"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            {t("buy")}
          </button>
          <button
            type="button"
            onClick={() => setTradeType("sell")}
            className={`py-3 text-sm font-semibold transition-colors ${
              tradeType === "sell"
                ? "bg-rose-500 text-white"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            {t("sell")}
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <label className="mb-1.5 block text-xs text-gray-400">
              {t("cryptoCurrency")}
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => onSelectAsset(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            >
              {SUPPORTED_CRYPTOCURRENCIES.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.symbol}/USDT — {t(item.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{t("lastPrice")}</span>
              <span className="tabular-nums text-sm font-semibold text-gray-900 dark:text-white">
                {currentPrice > 0
                  ? `$${currentPrice.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })}`
                  : t("fetching")}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
              <span>{t("available")}</span>
              <span className="tabular-nums">
                {tradeType === "buy"
                  ? `${cashBalance.toFixed(2)} USDT`
                  : `${(cryptoBalance[selectedAsset] || 0).toFixed(6)} ${
                      crypto?.symbol || ""
                    }`}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center justify-between text-xs text-gray-400">
              <span>{t("tradePrice")}</span>
              {tradeType === "buy" && (
                <button
                  type="button"
                  onClick={() => {
                    setTradeAmount(cashBalance.toFixed(2));
                    setCryptoAmount("");
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Max
                </button>
              )}
            </label>
            <div className="relative">
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => {
                  setTradeAmount(e.target.value);
                  setCryptoAmount("");
                }}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pe-14 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                step="0.01"
                min="0"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                USDT
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center justify-between text-xs text-gray-400">
              <span>{t("tradeValue")}</span>
              {tradeType === "sell" && (
                <button
                  type="button"
                  onClick={() => {
                    setCryptoAmount(
                      (cryptoBalance[selectedAsset] || 0).toFixed(6)
                    );
                    setTradeAmount("");
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Max
                </button>
              )}
            </label>
            <div className="relative">
              <input
                type="number"
                value={cryptoAmount}
                onChange={(e) => {
                  setCryptoAmount(e.target.value);
                  setTradeAmount("");
                }}
                placeholder="0.000000"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pe-14 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                step="0.000001"
                min="0"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {crypto?.symbol || "—"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PERCENTS.map((percent) => (
              <button
                key={percent}
                type="button"
                onClick={() => handlePercent(percent)}
                className="rounded-md border border-gray-200 py-1.5 text-xs text-gray-500 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:hover:border-green-500 dark:hover:text-green-400"
              >
                {percent}%
              </button>
            ))}
          </div>

          {estimated && (
            <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500 dark:border-gray-700">
              <div className="flex justify-between">
                <span>{t("tradeValueCalculate")}</span>
                <span className="tabular-nums font-medium text-gray-800 dark:text-gray-100">
                  {estimated.qty.toFixed(6)} {crypto?.symbol}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>{t("tradePriceCalculate")}</span>
                <span className="tabular-nums font-medium text-gray-800 dark:text-gray-100">
                  {estimated.total.toFixed(2)} USDT
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className={`mt-auto w-full rounded-lg py-3 text-sm font-semibold text-white transition ${
              tradeType === "buy"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-rose-500 hover:bg-rose-600"
            }`}
          >
            {tradeType === "buy" ? t("buy") : t("sell")}{" "}
            {crypto?.symbol || ""}
          </button>
        </div>
      </div>
    </>
  );
}
