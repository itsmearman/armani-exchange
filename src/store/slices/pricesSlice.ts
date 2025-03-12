import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// تغییر ساختار داده به یک شیء داینامیک
interface PricesState {
  [key: string]: number;
}

const initialState: PricesState = {
  bitcoin: 0, 
  ethereum: 0,
  cardano: 0,
};

const pricesSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {
    updatePrices(state, action: PayloadAction<Partial<PricesState>>) {
      Object.assign(state, action.payload);
    },
    setPricesState(state, action: PayloadAction<PricesState>) {
      return action.payload;
    },
    // افزودن reducer جدید برای اضافه کردن ارز جدید
    addNewCrypto(state, action: PayloadAction<string>) {
      if (!state[action.payload]) {
        state[action.payload] = 0;
      }
    }
  },
});

export const { updatePrices, setPricesState, addNewCrypto } = pricesSlice.actions;
export default pricesSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface PricesState {
//   bitcoin: number;
//   ethereum: number;
//   ada: number;
// }

// const initialState: PricesState = {
//   bitcoin: 0,
//   ethereum: 0,
//   ada: 0,
// };

// const pricesSlice = createSlice({
//   name: "prices",
//   initialState,
//   reducers: {
//     updatePrices(state, action: PayloadAction<Partial<PricesState>>) {
//       return { ...state, ...action.payload };
//     },
//     setPricesState(state, action: PayloadAction<PricesState>) {
//       return action.payload; // Replace the entire state with the payload
//     },
//   },
// });

// export const { updatePrices, setPricesState } = pricesSlice.actions;

// export default pricesSlice.reducer;
