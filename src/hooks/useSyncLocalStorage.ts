import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPricesState } from "../store/slices/pricesSlice";
import { setOrdersState } from "../store/slices/ordersSlice";
import { setBalancesState } from "../store/slices/balancesSlice";
import { RootState } from "@/src/store/store";

export default function useSyncLocalStorage() {
    const dispatch = useDispatch();
    const { cashBalance, cryptoBalance } = useSelector((state: RootState) => state.balances);
    const { bitcoin, ethereum, cardano } = useSelector((state: RootState) => state.prices);
    const orders = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        const storedBalances = localStorage.getItem("balances");
        const storedOrders = localStorage.getItem("orders");
        const storedPrices = localStorage.getItem("prices");

        if (storedBalances) dispatch(setBalancesState(JSON.parse(storedBalances)));
        if (storedOrders) dispatch(setOrdersState(JSON.parse(storedOrders)));
        if (storedPrices) dispatch(setPricesState(JSON.parse(storedPrices)));
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem("balances", JSON.stringify({ cashBalance, cryptoBalance }));
    }, [cashBalance, cryptoBalance]);

    useEffect(() => {
        localStorage.setItem("orders", JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem("prices", JSON.stringify({ bitcoin, ethereum, cardano }));
    }, [bitcoin, ethereum, cardano]);
}
