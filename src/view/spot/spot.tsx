"use client";
import {
  React,
  useEffect,
  useDispatch,
  useSelector,
  // updatePrices,
  // setPricesState,
  updateCashBalance,
  updateCryptoBalance,
  // setBalancesState,
  addOrder,
  // setOrdersState,
  openModal,
  closeModal,
  LivePrices,
  Balances,
  TradeForm,
  OrderList,
  Modal,
  useTranslations,
} from "./imports";
// import { RootState } from "@/src/store/store";
// import { useRouter } from "next/navigation";
// import { supabase } from '@/lib/supabaseClient'

// function Spot() {
//   const t = useTranslations();
//   const dispatch = useDispatch();

//   const { bitcoin, ethereum, cardano } = useSelector(
//     (state: RootState) => state.prices
//   );
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
//     localStorage.setItem(
//       "prices",
//       JSON.stringify({ bitcoin, ethereum, cardano })
//     );
//   }, [bitcoin, ethereum, cardano]);

  // useEffect(() => {
  //   const ws = new WebSocket(
  //     "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano"
  //   );

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     dispatch(updatePrices(data));
  //   };
  //   ws.onopen = () => {
  //     console.log("WebSocket opened");
  //   };

  //   ws.onclose = () => {
  //     console.warn("WebSocket closed. Reconnecting...");
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, [dispatch]);

//   const handleTrade = (type: "buy" | "sell", asset: string, amount: number) => {
//     let price: number;

//     // بررسی مقدار asset و انتخاب قیمت مناسب
//     if (asset === "bitcoin") {
//       price = bitcoin;
//     } else if (asset === "ethereum") {
//       price = ethereum;
//     } else if (asset === "cardano") {
//       price = cardano;
//     } else {
//       // اگر ارز دیجیتال شناخته شده نباشد
//       dispatch(openModal(t("unknownCrypto")));
//       return;
//     }

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


//     const router = useRouter()
  
//     useEffect(() => {
//       const checkAuth = async () => {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession()
  
//         if (!session) {
//           router.replace('/') // یا هر صفحه‌ای برای ورود
//         }
//       }
  
//       checkAuth()
//     }, [router])

//   return (
//     <>
//       <Modal
//         isOpen={isOpen}
//         onClose={() => dispatch(closeModal())}
//         message={message}
//       />
//       <div className="flex pt-[7rem] flex-col items-center space-y-6 md:pt-24">
//         <h1 className="text-xl sm:text-2xl font-bold text-center">{t("tradeSystem")}</h1>
//         <Balances cashBalance={cashBalance} cryptoBalance={cryptoBalance} />
//         <LivePrices prices={{ bitcoin, ethereum, cardano }} />
//         <TradeForm
//           prices={{ bitcoin, ethereum, cardano }}
//           onTrade={handleTrade}
//           cryptoBalance={cryptoBalance}
//           cashBalance={cashBalance}
//         />
//         <OrderList
//           orders={orders}
//           livePrices={{ bitcoin, ethereum, cardano }}
//         />
//       </div>
//     </>
//   );
// }

// export default Spot;

// import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient'

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
  const handleTrade = (type: "buy" | "sell", asset: string, amount: number) => {
    const validAssets = ["bitcoin", "ethereum", "cardano"] as const;
    type CryptoAsset = typeof validAssets[number]; // "bitcoin" | "ethereum" | "cardano"
  
    if (!validAssets.includes(asset as CryptoAsset)) {
      return dispatch(openModal(t("unknownCrypto")));
    }
  
    // Now TypeScript knows asset is CryptoAsset
    const cryptoAsset = asset as CryptoAsset;
    const price = { bitcoin, ethereum, cardano }[cryptoAsset];
  
    const cost = price * amount;
    if (type === "buy" && cost <= cashBalance) {
      dispatch(updateCashBalance(cashBalance - cost));
      dispatch(updateCryptoBalance({ asset: cryptoAsset, amount }));
    } else if (type === "sell" &&  cryptoBalance[cryptoAsset] >= amount) {
      dispatch(updateCashBalance(cashBalance + cost));
      dispatch(updateCryptoBalance({ asset: cryptoAsset, amount: -amount }));
    } else {
      dispatch(openModal(t("notEnough")));
      return;
    }

    dispatch(addOrder({ id: Date.now(), type, asset, amount, price }));
  };


    const router = useRouter()
  
    useEffect(() => {
      const checkAuth = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
  
        if (!session) {
          router.replace('/') // یا هر صفحه‌ای برای ورود
        }
      }
  
      checkAuth()
    }, [router])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => dispatch(closeModal())}
        message={message}
      />
      <div className="flex pt-[7rem] flex-col items-center space-y-6 md:pt-24">
        <h1 className="text-xl sm:text-2xl font-bold text-center">{t("tradeSystem")}</h1>
        <Balances cashBalance={cashBalance} cryptoBalance={cryptoBalance} />
        <LivePrices prices={{ bitcoin, ethereum, cardano }} />
        <TradeForm
          prices={{ bitcoin, ethereum, cardano }}
          onTrade={handleTrade}
          cryptoBalance={cryptoBalance}
          cashBalance={cashBalance}
        />
        <OrderList
          orders={orders}
          livePrices={{ bitcoin, ethereum, cardano }}
        />
      </div>
    </>
  );
}

export default Spot;
