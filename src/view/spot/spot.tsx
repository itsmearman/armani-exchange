"use client";

import LoadPage from "@/src/components/Loading";
import {
  useEffect,
  useState,
  useDispatch,
  useSelector,
  updatePrices,
  setPricesState,
  updateCashBalance,
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
  useBalanceSync,
  dynamic,
  useRouter,
} from "./imports";
import {
  getCryptoByName,
  getCryptoNames,
  SUPPORTED_CRYPTOCURRENCIES,
} from "@/src/config/cryptocurrencies";
import { useAuth } from "@/src/contexts/AuthContext";
import { ordersRequest, tradeRequest } from "@/src/lib/api";
import { setCryptoBalance } from "@/src/store/slices/balancesSlice";

const Modal = dynamic(() => import("@/src/components/modal"), { ssr: false });
const TradingViewChart = dynamic(
  () => import("@/src/components/tradingviewChart"),
  { ssr: false }
);

function formatTickerPrice(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 6,
  });
}

function Spot() {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { user, loading: authLoading, refresh } = useAuth();
  const prices = useSelector((state: RootState) => state.prices);
  const { cashBalance, cryptoBalance } = useSelector(
    (state: RootState) => state.balances
  );
  const orders = useSelector((state: RootState) => state.orders);
  const { isOpen, message } = useSelector((state: RootState) => state.modal);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const selectedCrypto = getCryptoByName(selectedAsset);
  const selectedPrice = Number(prices[selectedAsset]) || 0;

  useBalanceSync();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

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
    localStorage.setItem("prices", JSON.stringify(prices));
  }, [cashBalance, cryptoBalance, orders, prices]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();

        const priceUpdates: { [key: string]: number } = {};
        SUPPORTED_CRYPTOCURRENCIES.forEach((crypto) => {
          if (data[crypto.id] && data[crypto.id].usd) {
            priceUpdates[crypto.name] = data[crypto.id].usd;
          }
        });

        dispatch(updatePrices(priceUpdates));
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
    const crypto = SUPPORTED_CRYPTOCURRENCIES.find((c) => c.name === asset);
    if (!crypto) {
      dispatch(openModal(t("unknownCrypto")));
      return;
    }

    const price = prices[asset] || 0;
    if (price <= 0) {
      dispatch(openModal(t("priceNotAvailable")));
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

    try {
      setSubmitting(true);
      const result = await tradeRequest({ type, asset, amount, price });

      dispatch(updateCashBalance(result.user.cashBalance));
      getCryptoNames().forEach((cryptoName) => {
        dispatch(
          setCryptoBalance({
            asset: cryptoName,
            amount: result.user.cryptoBalances?.[cryptoName] || 0,
          })
        );
      });
      dispatch(addOrder(result.order));
      await refresh();
      dispatch(openModal(t("tradeSuccess")));
    } catch (error) {
      const code = error instanceof Error ? error.message : "orderFailed";
      if (code === "notEnoughCash") {
        dispatch(openModal(t("notEnoughCash")));
      } else if (code === "notEnoughCrypto") {
        dispatch(openModal(t("notEnoughCrypto")));
      } else {
        dispatch(openModal(t("orderFailed")));
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoadingOrders(true);
        setOrdersError(null);
        const data = await ordersRequest();
        dispatch(setOrdersState(data.orders));
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrdersError(t("fetchOrdersError"));
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [dispatch, t, user]);

  if (authLoading || !user) return <LoadPage />;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => dispatch(closeModal())}
        message={message}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 pb-28 pt-[6.5rem] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 md:pb-10 md:pt-24">
        <div className="mx-auto w-full max-w-[1400px] space-y-4 px-3 sm:px-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
            <div className="flex gap-4 overflow-x-auto px-4 py-3">
              {SUPPORTED_CRYPTOCURRENCIES.map((crypto) => {
                const price = Number(prices[crypto.name]) || 0;
                const active = selectedAsset === crypto.name;
                return (
                  <button
                    key={crypto.name}
                    type="button"
                    onClick={() => setSelectedAsset(crypto.name)}
                    className={`shrink-0 rounded-lg px-3 py-2 text-start transition ${
                      active
                        ? "bg-blue-50 dark:bg-blue-500/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    <p className="text-[11px] text-gray-400">
                      {crypto.symbol}/USDT
                    </p>
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        active
                          ? "text-blue-600 dark:text-green-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      ${formatTickerPrice(price)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold sm:text-2xl">
                  {selectedCrypto?.symbol || "—"}
                  <span className="text-gray-400">/USDT</span>
                </h1>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                  Spot
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                {selectedCrypto ? t(selectedCrypto.name) : t("tradeSystem")}
              </p>
            </div>
            <div className="text-end">
              <p className="text-xs text-gray-400">{t("lastPrice")}</p>
              <p className="text-2xl font-semibold tabular-nums text-emerald-500">
                ${formatTickerPrice(selectedPrice)}
              </p>
            </div>
          </div>

          <Balances
            cashBalance={cashBalance}
            cryptoBalance={cryptoBalance}
            prices={prices}
          />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <LivePrices
                prices={prices}
                selectedAsset={selectedAsset}
                onSelect={setSelectedAsset}
              />
            </div>

            <div className="space-y-4 xl:col-span-6">
              <TradingViewChart
                symbol={
                  selectedCrypto?.tradingViewSymbol || "BINANCE:BTCUSDT"
                }
              />
            </div>

            <div className={`xl:col-span-3 ${submitting ? "opacity-70" : ""}`}>
              <TradeForm
                prices={prices}
                onTrade={handleTrade}
                cryptoBalance={cryptoBalance}
                cashBalance={cashBalance}
                selectedAsset={selectedAsset}
                onSelectAsset={setSelectedAsset}
              />
            </div>
          </div>

          {loadingOrders ? (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-950">
              {t("loadingOrders")}
            </div>
          ) : ordersError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40">
              {ordersError}
            </div>
          ) : (
            <OrderList orders={orders} livePrices={prices} />
          )}
        </div>
      </div>
    </>
  );
}

export default Spot;
