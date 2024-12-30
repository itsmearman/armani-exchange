import { configureStore } from "@reduxjs/toolkit";
import pricesReducer from "./slices/pricesSlice";
import balancesReducer from "./slices/balancesSlice";
import ordersReducer from "./slices/ordersSlice";
import modalReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    prices: pricesReducer,
    balances: balancesReducer,
    orders: ordersReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
