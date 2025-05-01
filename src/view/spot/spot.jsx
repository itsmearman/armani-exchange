"use client";
import {
  React,
  useEffect,
  useState,
  useDispatch,
  useSelector,
  updatePrices,
  setPricesState,
  updateCashBalance,
  updateCryptoBalance,
  setBalancesState,
  addOrder,
  setOrdersState,
  openModal,
  closeModal,
  useTranslations,
  // RootState,
  supabase,
  useBalanceSync,
  dynamic,
} from "./imports";
import { useUser } from "@supabase/auth-helpers-react";

// type CryptoAsset = "bitcoin" | "ethereum" | "cardano";

const Modal = dynamic(() => import("@/src/components/modal"), { ssr: false });
const LivePrices = dynamic(() => import("@/src/view/spot/livePrices"), {
  ssr: false,
  loading: () => <div className="text-center">در حال دریافت قیمت‌ها...</div>,
});
const Balances = dynamic(() => import("@/src/view/spot/balances"), {
  ssr: false,
  loading: () => <div className="text-center">در حال دریافت موجودی‌ها...</div>,
});
const TradeForm = dynamic(() => import("@/src/view/spot/tradeForm"), {
  ssr: false,
  loading: () => (
    <div className="text-center">در حال بارگذاری فرم معامله...</div>
  ),
});
const OrderList = dynamic(() => import("@/src/view/spot/orderList"), {
  ssr: false,
  loading: () => <div className="text-center">در حال بارگذاری سفارش‌ها...</div>,
});

function Spot() {
  const t = useTranslations();
  const dispatch = useDispatch();
  const user = useUser();

  const { bitcoin, ethereum, cardano } = useSelector(
    (state) => state.prices //: RootState
  );
  const { cashBalance, cryptoBalance } = useSelector(
    (state) => state.balances //: RootState
  );
  const orders = useSelector((state) => state.orders); //: RootState
  const { isOpen, message } = useSelector((state) => state.modal); //: RootState

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useBalanceSync();

  useEffect(() => {
    const storedBalances = localStorage.getItem("balances");
    const storedOrders = localStorage.getItem("orders");
    const storedPrices = localStorage.getItem("prices");

    if (storedBalances) dispatch(setBalancesState(JSON.parse(storedBalances)));
    if (storedOrders) dispatch(setOrdersState(JSON.parse(storedOrders)));
    if (storedPrices) dispatch(setPricesState(JSON.parse(storedPrices)));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem(
      "balances",
      JSON.stringify({ cashBalance, cryptoBalance })
    );
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem(
      "prices",
      JSON.stringify({ bitcoin, ethereum, cardano })
    );
  }, [cashBalance, cryptoBalance, orders, bitcoin, ethereum, cardano]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();

        dispatch(
          updatePrices({
            bitcoin: data.bitcoin.usd,
            ethereum: data.ethereum.usd,
            cardano: data.cardano.usd,
          })
        );
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const { data, error } = await supabase
          .from("orders")
          .select("id, type, asset, amount, price")
          .eq("user_id", user.id)
          .order("id", { ascending: false });

        if (error) {
          console.error("Fetch error:", error);
          setOrdersError(t("fetchOrdersError"));
        } else {
          dispatch(setOrdersState(data || []));
        }
      } catch (err) {
        console.error("Unexpected fetch error:", err);
        setOrdersError(t("unknownError"));
      } finally {
        setLoadingOrders(false);
      }
    };

    const timer = setTimeout(fetchOrders, 100);
    return () => clearTimeout(timer);
  }, [dispatch, user?.id, t]);

  const handleTrade = async (
    // type: "buy" | "sell",
    // asset: CryptoAsset,
    // amount: number
  ) => {
    const prices= { bitcoin, ethereum, cardano };//: Record<CryptoAsset, number> 
    const price = prices[asset];
    const cost = price * amount;

    if (type === "buy" && cost > cashBalance)
      return dispatch(openModal(t("notEnoughCash")));

    if (
      !cryptoBalance[asset] ||
      (type === "sell" && cryptoBalance[asset] < amount)
    )
      return dispatch(openModal(t("notEnoughCrypto")));

    const updatedCash =
      type === "buy" ? cashBalance - cost : cashBalance + cost;
    const updatedCrypto = {
      ...cryptoBalance,
      [asset]:
        type === "buy"
          ? (cryptoBalance[asset] || 0) + amount
          : (cryptoBalance[asset] || 0) - amount,
    };

    const { error: orderError } = await supabase.from("orders").insert([
      {
        user_id: user?.id,
        type,
        asset,
        amount,
        price,
      },
    ]);

    if (orderError) {
      console.error("Order error:", orderError);
      return dispatch(openModal(t("orderFailed")));
    }

    const { error: balanceError } = await supabase
      .from("profiles")
      .update({
        cash_balance: updatedCash,
        bitcoin_balance: updatedCrypto.bitcoin,
        ethereum_balance: updatedCrypto.ethereum,
        cardano_balance: updatedCrypto.cardano,
      })
      .eq("id", user?.id);

    if (balanceError) {
      console.error("Balance update error:", balanceError);
      return dispatch(openModal(t("balanceUpdateFailed")));
    }

    dispatch(updateCashBalance(updatedCash));
    dispatch(
      updateCryptoBalance({
        asset,
        amount: type === "buy" ? amount : -amount,
      })
    );
    dispatch(
      addOrder({
        id: Date.now(),
        type,
        asset,
        amount,
        price,
      })
    );
    dispatch(openModal(t("tradeSuccess")));
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => dispatch(closeModal())}
        message={message}
      />
      <div className="flex pt-[7rem] flex-col items-center space-y-6 md:pt-24">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          {t("tradeSystem")}
        </h1>
        <Balances cashBalance={cashBalance} cryptoBalance={cryptoBalance} />
        <LivePrices prices={{ bitcoin, ethereum, cardano }} />
        <TradeForm
          prices={{ bitcoin, ethereum, cardano }}
          onTrade={handleTrade}
          cryptoBalance={cryptoBalance}
          cashBalance={cashBalance}
        />
        {loadingOrders ? (
          <div className="mt-4 text-center">{t("loadingOrders")}</div>
        ) : ordersError ? (
          <div className="mt-4 text-red-500 text-center">{ordersError}</div>
        ) : (
          <OrderList
            orders={orders}
            livePrices={{ bitcoin, ethereum, cardano }}
          />
        )}
      </div>
    </>
  );
}

export default Spot;
