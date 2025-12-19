import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCryptoNames } from "@/src/config/cryptocurrencies";

interface BalancesState {
  cashBalance: number;
  cryptoBalance: { [key: string]: number };
}

// ایجاد initial state داینامیک بر اساس لیست ارزها
const initialCryptoBalance: { [key: string]: number } = {};
getCryptoNames().forEach((name) => {
  initialCryptoBalance[name] = 0;
});

const initialState: BalancesState = {
  cashBalance: 0,
  cryptoBalance: initialCryptoBalance,
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
      if (!state.cryptoBalance[action.payload.asset]) {
        state.cryptoBalance[action.payload.asset] = 0;
      }
      state.cryptoBalance[action.payload.asset] += action.payload.amount;
      // اطمینان از اینکه مقدار منفی نشود
      if (state.cryptoBalance[action.payload.asset] < 0) {
        state.cryptoBalance[action.payload.asset] = 0;
      }
    },
    setCryptoBalance(
      state,
      action: PayloadAction<{ asset: string; amount: number }>
    ) {
      state.cryptoBalance[action.payload.asset] = action.payload.amount;
    },
    setBalancesState(state, action: PayloadAction<BalancesState>) {
      return action.payload;
    },
  },
});

export const { updateCashBalance, updateCryptoBalance, setCryptoBalance, setBalancesState } =
  balancesSlice.actions;

export default balancesSlice.reducer;