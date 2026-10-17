"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { getCryptoByName } from "@/src/config/cryptocurrencies";

interface Order {
  id: number | string;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
}

interface LivePrices {
  [key: string]: string | number;
}

interface OrderListProps {
  orders: Order[];
  livePrices: LivePrices;
}

const OrderList = ({ orders }: OrderListProps) => {
  const t = useTranslations();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <h2 className="text-sm font-semibold">{t("orderHistory")}</h2>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
          {orders.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 dark:bg-gray-900/80">
              <th className="px-4 py-3 text-start font-medium">{t("pair")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("type")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("price")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("amount")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("total")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  {t("noOrder")}
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const meta = getCryptoByName(order.asset);
                const total = order.amount * order.price;
                return (
                  <tr
                    key={order.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/60"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {meta?.symbol || order.asset}
                      </span>
                      <span className="text-gray-400">/USDT</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                          order.type === "buy"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}
                      >
                        {order.type === "buy" ? t("buy") : t("sell")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end tabular-nums">
                      ${order.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-end tabular-nums">
                      {order.amount.toFixed(6)}
                    </td>
                    <td className="px-4 py-3 text-end tabular-nums">
                      ${total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <span className="text-xs text-emerald-500">
                        {t("filled")}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
