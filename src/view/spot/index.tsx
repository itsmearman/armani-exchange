// //     if (type === "buy" && cost <= cashBalance) {
// //       dispatch(updateCashBalance(cashBalance - cost));
// //       dispatch(updateCryptoBalance({ asset, amount }));
// //     } else if (type === "sell" && cryptoBalance[asset] >= amount) {
// //       dispatch(updateCashBalance(cashBalance + cost));
// //       dispatch(updateCryptoBalance({ asset, amount: -amount }));

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePrices, setPricesState } from "@/src/store/slices/pricesSlice";
import {
  updateCashBalance,
  updateCryptoBalance,
  setBalancesState,
} from "@/src/store/slices/balancesSlice";
import { addOrder, setOrdersState } from "@/src/store/slices/ordersSlice";
import { openModal, closeModal } from "@/src/store/slices/modalSlice";
import { RootState } from "@/src/store/store";
import LivePrices from "./livePrices";
import Balances from "./balances";
import TradeForm from "./tradeForm";
import OrderList from "./orderList";
import Modal from "@/src/components/modal";
import { useTranslations } from "next-intl";

function Spot() {
  const t = useTranslations();
  const dispatch = useDispatch();

  const { bitcoin, ethereum, cardano } = useSelector(
    (state: RootState) => state.prices
  );
  const { cashBalance, cryptoBalance } = useSelector(
    (state: RootState) => state.balances
  );
  const orders = useSelector((state: RootState) => state.orders);
  const { isOpen, message } = useSelector((state: RootState) => state.modal);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedBalances = localStorage.getItem("balances");
    const storedOrders = localStorage.getItem("orders");
    const storedPrices = localStorage.getItem("prices");

    if (storedBalances) {
      dispatch(setBalancesState(JSON.parse(storedBalances)));
    }
    if (storedOrders) {
      dispatch(setOrdersState(JSON.parse(storedOrders)));
    }
    if (storedPrices) {
      dispatch(setPricesState(JSON.parse(storedPrices)));
    }
  }, [dispatch]);

  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
    localStorage.setItem(
      "balances",
      JSON.stringify({ cashBalance, cryptoBalance })
    );
  }, [cashBalance, cryptoBalance]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("prices", JSON.stringify({ bitcoin, ethereum, cardano }));
  }, [bitcoin, ethereum, cardano]);

  // const crypto = ["BTC-USD", "ETH-USD", "ADA-USD"]; // Coinbase uses uppercase pairs

  useEffect(() => {
    // const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");
    const ws = new WebSocket(
      "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano"
    );
    // const subscribeMessage = {
    //   type: "subscribe",
    //   channels: [{ name: "ticker", product_ids: crypto }],
    // };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // if (data.type === "ticker") {
      //   const { product_id: symbol, price } = data;
      //   console.log(`Price Update for ${symbol}:`, price);
        dispatch(
          updatePrices(
            data
            // {
            // [symbol.toLowerCase().replace("-usd", "")]: parseFloat(price),
          // }
        )
        );
      // }
    };
    ws.onopen = ()=>{
      // ws.send(JSON.stringify(subscribeMessage));
      console.log("WebSocket opened");
      
    }

    ws.onclose = () => {
      console.warn("WebSocket closed. Reconnecting...");
    };

    return () => {
      ws.close();
    };
  }, [dispatch, crypto]);

  const handleTrade = (
    type: "buy" | "sell",
    asset: "bitcoin" | "ethereum" | "cardano",
    amount: number
  ) => {
    const price =
      asset === "bitcoin" ? bitcoin : asset === "ethereum" ? ethereum : cardano;
    const cost = price * amount;

    if (type === "buy" && cost <= cashBalance) {
      dispatch(updateCashBalance(cashBalance - cost));
      dispatch(updateCryptoBalance({ asset, amount }));
    } else if (type === "sell" && cryptoBalance[asset] >= amount) {
      dispatch(updateCashBalance(cashBalance + cost));
      dispatch(updateCryptoBalance({ asset, amount: -amount }));
    } else {
      dispatch(openModal(t("notEnough")));
      return;
    }

    dispatch(addOrder({ id: Date.now(), type, asset, amount, price }));
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => dispatch(closeModal())}
        message={message}
      />
      <div className="flex pt-[7rem] flex-col items-center space-y-6 md:pt-24">
        <h1 className="text-2xl font-bold">{t("tradeSystem")}</h1>
        <Balances cashBalance={cashBalance} cryptoBalance={cryptoBalance} />
        <LivePrices prices={{ bitcoin, ethereum, cardano }} />
        <TradeForm
          prices={{ bitcoin, ethereum, cardano }}
          onTrade={handleTrade}
          cryptoBalance={cryptoBalance}
          cashBalance={cashBalance}
        />
        <OrderList orders={orders} livePrices={{ bitcoin, ethereum ,cardano }} />
      </div>
    </>
  );
}

export default Spot;
// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updatePrices, setPricesState } from "@/src/store/slices/pricesSlice";
// import {
//   updateCashBalance,
//   updateCryptoBalance,
//   setBalancesState,
// } from "@/src/store/slices/balancesSlice";
// import { addOrder, setOrdersState } from "@/src/store/slices/ordersSlice";
// import { openModal, closeModal } from "@/src/store/slices/modalSlice";
// import { RootState } from "@/src/store/store";
// import LivePrices from "./livePrices";
// import Balances from "./balances";
// import TradeForm from "./tradeForm";
// import OrderList from "./orderList";
// import Modal from "@/src/components/modal";
// import { useTranslations } from "next-intl";

// function Spot() {
//   const t = useTranslations();
//   const dispatch = useDispatch();

//   // State for dynamic crypto list
//   const [cryptoList, setCryptoList] = useState<string[]>([
//     "bitcoin",
//     "ethereum",
//     "cardano",
//   ]);

//   const prices = useSelector((state: RootState) => state.prices);
//   const { cashBalance, cryptoBalance } = useSelector(
//     (state: RootState) => state.balances
//   );
//   const orders = useSelector((state: RootState) => state.orders);
//   const { isOpen, message } = useSelector((state: RootState) => state.modal);

//   // Load data from localStorage on component mount
//   useEffect(() => {
//     const storedBalances = localStorage.getItem("balances");
//     const storedOrders = localStorage.getItem("orders");
//     const storedPrices = localStorage.getItem("prices");

//     if (storedBalances) {
//       dispatch(setBalancesState(JSON.parse(storedBalances)));
//     }
//     if (storedOrders) {
//       dispatch(setOrdersState(JSON.parse(storedOrders)));
//     }
//     if (storedPrices) {
//       dispatch(setPricesState(JSON.parse(storedPrices)));
//     }
//   }, [dispatch]);

//   // Save data to localStorage whenever relevant state changes
//   useEffect(() => {
//     localStorage.setItem(
//       "balances",
//       JSON.stringify({ cashBalance, cryptoBalance })
//     );
//   }, [cashBalance, cryptoBalance]);

//   useEffect(() => {
//     localStorage.setItem("orders", JSON.stringify(orders));
//   }, [orders]);

//   useEffect(() => {
//     localStorage.setItem("prices", JSON.stringify(prices));
//   }, [prices]);

//   // WebSocket for live price updates
//   useEffect(() => {
//     const assetsQuery = cryptoList.join(",");
//     const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${assetsQuery}`);

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       dispatch(updatePrices(data));
//     };

//     ws.onopen = () => {
//       console.log("WebSocket opened for assets:", assetsQuery);
//     };

//     ws.onclose = () => {
//       console.warn("WebSocket closed. Reconnecting...");
//     };

//     return () => {
//       ws.close();
//     };
//   }, [dispatch, cryptoList]);

//   const handleTrade = (
//     type: "buy" | "sell",
//     asset: string,
//     amount: number
//   ) => {
//     const price = prices[asset];
//     const cost = price * amount;

//     if (type === "buy" && cost <= cashBalance) {
//       dispatch(updateCashBalance(cashBalance - cost));
//       dispatch(updateCryptoBalance({ asset, amount }));
//     } else if (type === "sell" && cryptoBalance[asset] >= amount) {
//       dispatch(updateCashBalance(cashBalance + cost));
//       dispatch(updateCryptoBalance({ asset, amount: -amount }));
//     } else {
//       dispatch(openModal(t("notEnough")));
//       return;
//     }

//     dispatch(addOrder({ id: Date.now(), type, asset, amount, price }));
//   };

//   return (
//     <>
//       <Modal
//         isOpen={isOpen}
//         onClose={() => dispatch(closeModal())}
//         message={message}
//       />
//       <div className="flex pt-[7rem] flex-col items-center space-y-6 md:pt-24">
//         <h1 className="text-2xl font-bold">{t("tradeSystem")}</h1>
//         <Balances cashBalance={cashBalance} cryptoBalance={cryptoBalance} />
//         <LivePrices prices={prices} />
//         <TradeForm
//           prices={prices}
//           onTrade={handleTrade}
//           cryptoBalance={cryptoBalance}
//           cashBalance={cashBalance}
//         />
//         <OrderList orders={orders} livePrices={prices} />
//       </div>
//     </>
//   );
// }

// export default Spot;
