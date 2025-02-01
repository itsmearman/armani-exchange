// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface BalancesState {
//   cashBalance: number;
//   cryptoBalance: { bitcoin: number; ethereum: number; cardano: number };
// }

// const initialState: BalancesState = {
//   cashBalance: 150000,
//   cryptoBalance: { bitcoin: 0, ethereum: 0 , cardano: 0 },
// };

// const balancesSlice = createSlice({
//   name: "balances",
//   initialState,
//   reducers: {
//     updateCashBalance(state, action: PayloadAction<number>) {
//       state.cashBalance = action.payload;
//     },
//     updateCryptoBalance(
//       state,
//       action: PayloadAction<{ asset: "bitcoin" | "ethereum" | "cardano"; amount: number }>
//     ) {
//       state.cryptoBalance[action.payload.asset] += action.payload.amount;
//     },
//     setBalancesState(state, action: PayloadAction<BalancesState>) {
//       return action.payload;
//     },
//   },
// });

// export const { updateCashBalance, updateCryptoBalance, setBalancesState } =
//   balancesSlice.actions;

// export default balancesSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CryptoBalance {
  [key: string]: number; // Use a key-value pair for dynamic cryptocurrencies
}

interface BalancesState {
  cashBalance: number;
  cryptoBalance: CryptoBalance;
}

const initialState: BalancesState = {
  cashBalance: 150000,
  cryptoBalance: {}, // Start with an empty object for dynamic assets
};

const balancesSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {
    updateCashBalance(state, action: PayloadAction<number>) {
      state.cashBalance = action.payload;
    },
    updateCryptoBalance(
      state,
      action: PayloadAction<{ asset: string; amount: number }>
    ) {
      const { asset, amount } = action.payload;
      if (!state.cryptoBalance[asset]) {
        state.cryptoBalance[asset] = 0; // Initialize asset balance if not present
      }
      state.cryptoBalance[asset] += amount;
    },
    setBalancesState(state, action: PayloadAction<BalancesState>) {
      return action.payload;
    },
  },
});

export const { updateCashBalance, updateCryptoBalance, setBalancesState } =
  balancesSlice.actions;

export default balancesSlice.reducer;
