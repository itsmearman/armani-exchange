'use client'
import React, { useEffect, useState } from "react";
import LivePrices from "./livePrices";
import Balances from "./balances";
import TradeForm from "./tradeForm";
import OrderList from "./orderList";

function CryptoTradingApp() {
  const [prices, setPrices] = useState({ bitcoin: 0, ethereum: 0 });
  const [cashBalance, setCashBalance] = useState(100000);
  const [cryptoBalance, setCryptoBalance] = useState({
    bitcoin: 0,
    ethereum: 0,
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices((prevPrices) => ({ ...prevPrices, ...data }));
    };
  }, []);

  const handleTrade = (type, asset, amount) => {
    const price = parseFloat(prices[asset]);
    const cost = price * amount;

    if (type === "buy" && cost <= cashBalance) {
      setCashBalance((prev) => prev - cost);
      setCryptoBalance((prev) => ({ ...prev, [asset]: prev[asset] + amount }));
    } else if (type === "sell" && cryptoBalance[asset] >= amount) {
      setCashBalance((prev) => prev + cost);
      setCryptoBalance((prev) => ({ ...prev, [asset]: prev[asset] - amount }));
    } else {
      alert("موجودی کافی نیست!");
      return;
    }

    setOrders((prev) => [
      { id: Date.now(), type, asset, amount, price },
      ...prev,
    ]);
  };
  return (
    // <div className="pt-8 flex flex-col items-center text-center space-y-6 font-IranSans md:pt-24">
    //   {/* صفحه اصلی */}
    //   <h1 className="text-2xl font-bold text-gray-800">
    //     سیستم خرید و فروش ارز دیجیتال
    //   </h1>
    //   {/* نمایش موجودی‌ها */}
    //   <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
    //     <p className="text-sm text-gray-600">
    //       $  {cashBalance.toFixed(2)} <strong className="font-semibold text-gray-800"> : موجودی نقدی</strong>
    //     </p>
    //     <p className="text-sm text-gray-600">
    //       BTC  {cryptoBalance.bitcoin.toFixed(6)} <strong className="font-semibold text-gray-800"> : موجودی بیت‌کوین</strong>
    //     </p>
    //     <p className="text-sm text-gray-600">
    //       ETH  {cryptoBalance.ethereum.toFixed(4)} <strong className="font-semibold text-gray-800"> : موجودی اتریوم</strong>
    //     </p>
    //   </div>

    //   {/* قیمت‌های زنده */}
    //   <div className="bg-white shadow rounded-lg p-6 items-center text-center w-full max-w-md text-left">
    //     <h2 className="text-lg font-bold text-gray-800">قیمت زنده</h2>
    //     <p className="text-sm text-gray-600">
    //       <strong className="font-semibold text-gray-800">بیت‌کوین :
    //         {prices.bitcoin ? ` ${prices.bitcoin} ` : "در حال دریافت..."}
    //       </strong>
    //     </p>
    //     <p className="text-sm text-gray-600">
    //       <strong className="font-semibold text-gray-800">اتریوم :
    //         {prices.ethereum ? ` ${prices.ethereum} ` : "در حال دریافت..."}
    //       </strong>
    //     </p>
    //   </div>

    //   {/* فرم خرید و فروش */}
    //   <div className="bg-white shadow rounded-lg p-6 w-full max-w-md space-y-4">
    //     <div>
    //       <label className="block text-sm font-medium text-gray-700">نوع معامله:</label>
    //       <select
    //         value={tradeType}
    //         onChange={(e) => setTradeType(e.target.value)}
    //         className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
    //       >
    //         <option value="buy">خرید</option>
    //         <option value="sell">فروش</option>
    //       </select>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700">ارز دیجیتال:</label>
    //       <select
    //         value={selectedAsset}
    //         onChange={(e) => setSelectedAsset(e.target.value)}
    //         className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
    //       >
    //         <option value="bitcoin">Bitcoin (BTC)</option>
    //         <option value="ethereum">Ethereum (ETH)</option>
    //       </select>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700">مقدار:</label>
    //       <input
    //         type="number"
    //         value={tradeAmount}
    //         onChange={(e) => setTradeAmount(e.target.value)}
    //         placeholder="مقدار (واحد ارز)"
    //         className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
    //       />
    //     </div>

    //     <button
    //       onClick={handleTrade}
    //       className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
    //     >
    //       انجام معامله
    //     </button>
    // {/* لیست سفارشات */}
    // < div className="bg-white shadow rounded-lg p-6 mx-auto pb-24" >
    //   <h2 className="text-lg font-bold text-gray-800 mb-4">لیست سفارشات</h2>

    //   <div className="overflow-x-auto">
    //     <table className="table-auto w-full border-collapse border border-gray-300">
    //       <thead className="bg-gray-100">
    //         <tr>
    //           <th className="border border-gray-300 px-4 py-2 text-gray-700">قیمت</th>
    //           <th className="border border-gray-300 px-4 py-2 text-gray-700">مقدار</th>
    //           <th className="border border-gray-300 px-4 py-2 text-gray-700">نوع</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {orders.length === 0 ? (
    //           <tr>
    //             <td
    //               colSpan={3}
    //               className="border border-gray-300 px-4 py-4 text-center text-gray-600"
    //             >
    //               سفارشی وجود ندارد
    //             </td>
    //           </tr>
    //         ) : (
    //           orders.map((order) => (
    //             <tr key={order.id} className="hover:bg-gray-50">
    //               <td className="border border-gray-300 px-4 py-2 text-gray-800">
    //                 {order.price}
    //               </td>
    //               <td className="border border-gray-300 px-4 py-2 text-gray-800">
    //                 {order.amount}
    //               </td>
    //               <td className="border border-gray-300 px-4 py-2 text-gray-800">
    //                 {order.type == "buy" ? "خرید" : "فروش"}
    //               </td>
    //             </tr>
    //           ))
    //         )}
    //       </tbody>
    //     </table>
    //   </div>
    // </div >
    //   </div>
    // </div>
    <>
      <div className="flex pt-12 flex-col items-center space-y-6 md:pt-24">
        <h1 className="text-2xl font-bold">سیستم خرید و فروش ارز دیجیتال</h1>
        <Balances cashBalance={cashBalance} cryptoBalance={cryptoBalance} />
        <LivePrices prices={prices} />
        <TradeForm prices={prices} onTrade={handleTrade} />
        <OrderList orders={orders} />
      </div>
    </>
  );
}

export default CryptoTradingApp;