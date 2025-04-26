import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Order {
  id: number;
  type: "buy" | "sell";
  asset: string; // Allow dynamic cryptocurrencies
  amount: number;
  price: number;
}

type OrdersState = Order[];

const initialState: OrdersState = [];

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.unshift(action.payload); // Add new order to the beginning of the array
    },
    setOrdersState(state, action: PayloadAction<OrdersState>) {
      return action.payload; // Replace the entire state with the payload
    },
  },
});

export const { addOrder, setOrdersState } = ordersSlice.actions;

export default ordersSlice.reducer;
