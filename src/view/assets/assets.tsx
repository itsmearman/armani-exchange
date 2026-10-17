"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import LoadPage from "@/src/components/Loading";
import { useAuth } from "@/src/contexts/AuthContext";
import { useBalanceSync } from "@/src/hooks/useBalanceSync";
import { SUPPORTED_CRYPTOCURRENCIES } from "@/src/config/cryptocurrencies";
import { RootState } from "@/src/store/store";
import { updatePrices } from "@/src/store/slices/pricesSlice";

type AssetRow = {
  key: string;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  value: number;
  allocation: number;
};

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatAmount(value: number) {
  if (value >= 1) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  });
}

export default function Assets() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useAuth();
  const { cashBalance, cryptoBalance } = useSelector(
    (state: RootState) => state.balances
  );
  const prices = useSelector((state: RootState) => state.prices);
  const [showZero, setShowZero] = useState(false);

  useBalanceSync();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();
        const priceUpdates: Record<string, number> = {};
        SUPPORTED_CRYPTOCURRENCIES.forEach((crypto) => {
          if (data[crypto.id]?.usd) {
            priceUpdates[crypto.name] = data[crypto.id].usd;
          }
        });
        dispatch(updatePrices(priceUpdates));
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const rows = useMemo(() => {
    const cryptoRows: AssetRow[] = SUPPORTED_CRYPTOCURRENCIES.map((crypto) => {
      const amount = cryptoBalance[crypto.name] || 0;
      const price = Number(prices[crypto.name]) || 0;
      const value = amount * price;
      return {
        key: crypto.name,
        symbol: crypto.symbol,
        name: t(crypto.name),
        amount,
        price,
        value,
        allocation: 0,
      };
    });

    const usdtRow: AssetRow = {
      key: "usdt",
      symbol: "USDT",
      name: t("cash"),
      amount: cashBalance,
      price: 1,
      value: cashBalance,
      allocation: 0,
    };

    const all = [usdtRow, ...cryptoRows];
    const total = all.reduce((sum, row) => sum + row.value, 0);

    return all.map((row) => ({
      ...row,
      allocation: total > 0 ? (row.value / total) * 100 : 0,
    }));
  }, [cashBalance, cryptoBalance, prices, t]);

  const visibleRows = showZero
    ? rows
    : rows.filter((row) => row.amount > 0 || row.key === "usdt");

  const portfolioValue = rows.reduce((sum, row) => sum + row.value, 0);
  const cryptoValue = portfolioValue - cashBalance;
  const heldCount = rows.filter(
    (row) => row.key !== "usdt" && row.amount > 0
  ).length;

  if (authLoading || !user) return <LoadPage />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 pb-28 pt-[6.5rem] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 md:pb-10 md:pt-24">
      <div className="mx-auto w-full max-w-[1100px] space-y-4 px-3 sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("myAssets")}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {t("myAssetsDescription")}
            </p>
          </div>
          <Link
            href="/spot"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-green-500 dark:text-gray-950 dark:hover:bg-green-400"
          >
            {t("goToTrade")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:col-span-1">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              {t("portfolio")}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">
              ${formatMoney(portfolioValue)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              {t("availableCash")}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-500">
              ${formatMoney(cashBalance)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              {t("cryptoAssets")}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              ${formatMoney(cryptoValue)}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {heldCount} {t("assetsHeld")}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <h2 className="text-sm font-semibold">{t("assetList")}</h2>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={showZero}
                onChange={(e) => setShowZero(e.target.checked)}
                className="rounded border-gray-300"
              />
              {t("showZeroBalances")}
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 dark:bg-gray-900/80">
                  <th className="px-4 py-3 text-start font-medium">
                    {t("asset")}
                  </th>
                  <th className="px-4 py-3 text-end font-medium">
                    {t("amount")}
                  </th>
                  <th className="px-4 py-3 text-end font-medium">
                    {t("price")}
                  </th>
                  <th className="px-4 py-3 text-end font-medium">
                    {t("total")}
                  </th>
                  <th className="px-4 py-3 text-end font-medium">
                    {t("allocation")}
                  </th>
                  <th className="px-4 py-3 text-end font-medium">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-gray-400"
                    >
                      {t("noAssets")}
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row) => (
                    <tr
                      key={row.key}
                      className="border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/60"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-500/10 dark:text-green-400">
                            {row.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <p className="font-semibold">{row.symbol}</p>
                            <p className="text-xs text-gray-400">{row.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-end tabular-nums">
                        {formatAmount(row.amount)}
                      </td>
                      <td className="px-4 py-3 text-end tabular-nums">
                        ${formatMoney(row.price)}
                      </td>
                      <td className="px-4 py-3 text-end font-medium tabular-nums">
                        ${formatMoney(row.value)}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="ms-auto flex w-28 flex-col items-end gap-1">
                          <span className="tabular-nums text-xs text-gray-500">
                            {row.allocation.toFixed(1)}%
                          </span>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className="h-full rounded-full bg-blue-500 dark:bg-green-500"
                              style={{
                                width: `${Math.min(row.allocation, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-end">
                        {row.key === "usdt" ? (
                          <Link
                            href="/spot"
                            className="text-xs font-medium text-blue-600 hover:underline dark:text-green-400"
                          >
                            {t("buy")}
                          </Link>
                        ) : (
                          <Link
                            href="/spot"
                            className="text-xs font-medium text-blue-600 hover:underline dark:text-green-400"
                          >
                            {t("trade")}
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
