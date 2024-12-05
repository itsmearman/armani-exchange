'use client'
import React, { useEffect, useState } from "react";
import LivePrices from "./livePrices";
import Balances from "./balances";
import TradeForm from "./tradeForm";
import OrderList from "./orderList";
import { useTranslations } from "next-intl";
interface Prices { [key: string]: string | number }

interface CryptoBalance {
  bitcoin: number;
  ethereum: number; 
}

interface Order {
  id: number;
  type: "buy" | "sell";
  asset: "bitcoin" | "ethereum";
  amount: number;
  price: number;
}
function CryptoTradingApp() {
  const t = useTranslations();
  const [prices, setPrices] = useState<Prices>({ bitcoin: 0, ethereum: 0 });
  const [cashBalance, setCashBalance] = useState<number>(150000);
  const [cryptoBalance, setCryptoBalance] = useState<CryptoBalance>({
    bitcoin: 0,
    ethereum: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices((prevPrices) => ({ ...prevPrices, ...data }));
    };
  }, []);

  const handleTrade = (type: "buy" | "sell", asset: "bitcoin" | "ethereum", amount: number) => {
    const price = parseFloat(prices[asset].toString());
    const cost = price * amount;
    const cashBalanceNum = Number(cashBalance.toFixed(2));

     if (type === "buy" && cost <= cashBalanceNum) {
    setCashBalance((prev) => Number(prev.toFixed(6)) - cost);
    setCryptoBalance((prev) => ({ ...prev, [asset]: prev[asset] + amount }));
  } else if (type === "sell" && cryptoBalance[asset] >= amount) {
    setCashBalance((prev) => Number(prev.toFixed(6)) + cost);
    setCryptoBalance((prev) => ({ ...prev, [asset]: prev[asset] - amount }));
  } else {
    alert(t("notEnough"));
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
        <h1 className="text-2xl font-bold">{t("tradeSystem")}</h1>
        <Balances cashBalance={Number(cashBalance)} cryptoBalance={cryptoBalance} />
        <LivePrices prices={prices} />
        <TradeForm prices={prices} onTrade={handleTrade} cryptoBalance={cryptoBalance} cashBalance={Number(cashBalance)} />
        <OrderList orders={orders} livePrices={prices}/>
      </div>
    </>
  );
}

export default CryptoTradingApp;
