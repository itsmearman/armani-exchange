// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface PricesState {
//   bitcoin: number;
//   ethereum: number;
// }

// const initialState: PricesState = {
//   bitcoin: 0,
//   ethereum: 0,
// };

// const pricesSlice = createSlice({
//   name: "prices",
//   initialState,
//   reducers: {
//     updatePrices(state, action: PayloadAction<Partial<PricesState>>) {
//       Object.assign(state, action.payload);
//     },
//   },
// });

// export const { updatePrices } = pricesSlice.actions;
// export default pricesSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PricesState {
  bitcoin: number;
  ethereum: number;
}

const initialState: PricesState = {
  bitcoin: 0,
  ethereum: 0,
};

const pricesSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {
    updatePrices(state, action: PayloadAction<Partial<PricesState>>) {
      return { ...state, ...action.payload };
    },
    setPricesState(state, action: PayloadAction<PricesState>) {
      return action.payload; // Replace the entire state with the payload
    },
  },
});

export const { updatePrices, setPricesState } = pricesSlice.actions;

export default pricesSlice.reducer;
