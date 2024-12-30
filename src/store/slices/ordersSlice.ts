import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Order {
  id: number;
  type: "buy" | "sell";
  asset: "bitcoin" | "ethereum";
  amount: number;
  price: number;
}

const initialState: Order[] = [];

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.unshift(action.payload);
    },
  },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
