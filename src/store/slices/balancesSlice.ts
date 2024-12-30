import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BalancesState {
  cashBalance: number;
  cryptoBalance: {
    bitcoin: number;
    ethereum: number;
  };
}

const initialState: BalancesState = {
  cashBalance: 150000,
  cryptoBalance: { bitcoin: 0, ethereum: 0 },
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
      action: PayloadAction<{ asset: "bitcoin" | "ethereum"; amount: number }>
    ) {
      state.cryptoBalance[action.payload.asset] += action.payload.amount;
    },
  },
});

export const { updateCashBalance, updateCryptoBalance } = balancesSlice.actions;
export default balancesSlice.reducer;
