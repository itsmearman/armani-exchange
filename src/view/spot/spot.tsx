"use client";
import LoadPage from "@/src/components/Loading";
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
  LivePrices,
  Balances,
  TradeForm,
  OrderList,
  useTranslations,
  RootState,
  supabase,
  useBalanceSync,
  dynamic,
  useRouter,
} from "./imports";

const Modal = dynamic(() => import("@/src/components/modal"), { ssr: false });

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

  const handleTrade = async (
    type: "buy" | "sell",
    asset: string,
    amount: number
  ) => {
    let price: number;

    if (asset === "bitcoin") price = bitcoin;
    else if (asset === "ethereum") price = ethereum;
    else if (asset === "cardano") price = cardano;
    else {
      dispatch(openModal(t("unknownCrypto")));
      return;
    }

    const cost = price * amount;

    if (type === "buy" && cost > cashBalance) {
      dispatch(openModal(t("notEnoughCash")));
      return;
    }

    if (
      type === "sell" &&
      (!cryptoBalance[asset] || cryptoBalance[asset] < amount)
    ) {
      dispatch(openModal(t("notEnoughCrypto")));
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("خطا در دریافت سشن:", sessionError);
      return;
    }
    const userId = session.user.id;

    const updatedCash =
      type === "buy" ? cashBalance - cost : cashBalance + cost;
    const updatedCrypto = {
      ...cryptoBalance,
      [asset]:
        type === "buy"
          ? (cryptoBalance[asset] || 0) + amount
          : (cryptoBalance[asset] || 0) - amount,
    };

    const { error: insertError } = await supabase.from("orders").insert([
      {
        user_id: userId,
        type,
        asset,
        amount,
        price,
      },
    ]);

    if (insertError) {
      console.error("خطا در ذخیره سفارش:", insertError);
      dispatch(openModal(t("orderFailed")));
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        cash_balance: updatedCash,
        bitcoin_balance: updatedCrypto.bitcoin,
        ethereum_balance: updatedCrypto.ethereum,
        cardano_balance: updatedCrypto.cardano,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("خطا در ذخیره موجودی جدید:", updateError);
      dispatch(openModal(t("balanceUpdateFailed")));
      return;
    }

    dispatch(updateCashBalance(updatedCash));
    dispatch(
      updateCryptoBalance({ asset, amount: type === "buy" ? amount : -amount })
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setOrdersError(null);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.error("خطا در دریافت سشن:", sessionError);
          setOrdersError(t("authError"));
          setLoadingOrders(false);
          return;
        }

        const userId = session.user.id;

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("id, type, asset, amount, price")
          .eq("user_id", userId)
          .order("id", { ascending: false });

        if (ordersError) {
          console.error("خطا در دریافت سفارشات:", ordersError);
          setOrdersError(t("fetchOrdersError"));
        } else if (ordersData) {
          dispatch(setOrdersState(ordersData));
        }
      } catch (err) {
        console.error("خطای ناشناخته در دریافت سفارشات:", err);
        setOrdersError(t("unknownError"));
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [dispatch, t]);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      } else {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  if (isLoading) return <LoadPage />;

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
