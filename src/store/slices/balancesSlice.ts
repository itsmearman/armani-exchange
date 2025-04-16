import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

interface BalancesState {
  cashBalance: number;
  cryptoBalance: { bitcoin: number; ethereum: number; cardano: number };
}

const initialState: BalancesState = {
  cashBalance: 0,
  cryptoBalance: { bitcoin: 0, ethereum: 0 , cardano: 0},
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
      action: PayloadAction<{ asset: "bitcoin" | "ethereum" | "cardano"; amount: number }>
    ) {
      state.cryptoBalance[action.payload.asset] = action.payload.amount;
    },
    setBalancesState(state, action: PayloadAction<BalancesState>) {
      return action.payload;
    },
  },
});

export const { updateCashBalance, updateCryptoBalance, setBalancesState } =
  balancesSlice.actions;

export default balancesSlice.reducer;