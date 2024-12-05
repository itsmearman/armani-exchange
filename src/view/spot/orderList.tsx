import React from "react";
import { useTranslations } from "next-intl";
const OrderList = ({ orders, livePrices }:any) => {
  const t = useTranslations()
  const calculateProfitLossPercentage = (order:any) => {
    const currentPrice = parseFloat(livePrices[order.asset] || 0);
    if (!currentPrice || !order.price) return null;
    const profitLoss = ((currentPrice - order.price) / order.price) * 100;
    return profitLoss;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mx-auto pb-24">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{t("orderList")}</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-gray-700">ارز</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700">قیمت</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700">مقدار</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700">نوع</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700">سود/زیان</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-300 px-4 py-4 text-center text-gray-600"
                >
                  سفارشی وجود ندارد
                </td>
              </tr>
            ) : (
              orders.map((order:any) => {
                const profitLoss:any = calculateProfitLossPercentage(order);
                const profitLossClass =
                  profitLoss > 0
                    ? "text-green-600 font-bold"
                    : profitLoss < 0
                    ? "text-red-600 font-bold"
                    : "text-gray-600";
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">
                      {order.asset === "bitcoin" ? "بیت‌کوین" : "اتریوم"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{order.price}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{order.amount.toFixed(6)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">
                      {order.type === "buy" ? "خرید" : "فروش"}
                    </td>
                    <td className={`border border-gray-300 px-4 py-2 ${profitLossClass}`}>
                      {profitLoss !== null ? `${profitLoss.toFixed(2)}%` : "در حال دریافت..."}
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
