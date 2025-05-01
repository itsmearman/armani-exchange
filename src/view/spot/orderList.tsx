import React from "react";
import { useTranslations } from "next-intl";
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

const tableHead = ["currency", "price", "amount", "type"];

const OrderList = ({ orders }: OrderListProps) => {
  const t = useTranslations();

  return (
    <div className="shadow-md dark:shadow-white/50 rounded-lg p-6 w-full max-w-lg space-y-4 pb-[5rem] md:pb-6">
      <h2 className="text-lg font-bold  mb-4">{t("orderList")}</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 ">
          <thead>
            <tr>
              {tableHead.map((data, index) => (
                <th
                  key={index}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 "
                >
                  {t(`${data}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-4 text-center"
                >
                  {t("noOrder")}
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                return (
                  <tr key={order.id} >
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 ">
                      {t(`${order.asset}`)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 ">
                      {order.price}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 ">
                      {order.amount.toFixed(6)}
                    </td>
                    {/* <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 ">
                      {t(`${order.createdAt}`)}
                    </td> */}
                    <td
                      className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${
                        order.type === "buy" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {order.type === "buy" ? t("buy") : t("sell")}
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