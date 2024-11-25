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
    <>
      <div className="flex pt-12 flex-col items-center space-y-6 md:pt-24">
        <h1 className="text-2xl font-bold">سیستم خرید و فروش ارز دیجیتال</h1>
        <Balances cashBalance={cashBalance} cryptoBalance={cryptoBalance} />
        <LivePrices prices={prices} />
        <TradeForm prices={prices} onTrade={handleTrade} />
        <OrderList orders={orders} livePrices={prices}/>
      </div>
    </>
  );
}

export default CryptoTradingApp;
