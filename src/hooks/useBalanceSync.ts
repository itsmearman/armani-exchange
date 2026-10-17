import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCryptoBalance,
  updateCashBalance,
} from "@/src/store/slices/balancesSlice";
import { getCryptoNames } from "@/src/config/cryptocurrencies";
import { useAuth } from "@/src/contexts/AuthContext";
import { profileRequest } from "@/src/lib/api";

export function useBalanceSync() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    const resetBalances = () => {
      dispatch(updateCashBalance(0));
      getCryptoNames().forEach((cryptoName) => {
        dispatch(setCryptoBalance({ asset: cryptoName, amount: 0 }));
      });
    };

    const syncBalances = async () => {
      if (!user) {
        resetBalances();
        return;
      }

      try {
        const profile = await profileRequest();
        dispatch(updateCashBalance(profile.cashBalance || 0));
        getCryptoNames().forEach((cryptoName) => {
          dispatch(
            setCryptoBalance({
              asset: cryptoName,
              amount: profile.cryptoBalances?.[cryptoName] || 0,
            })
          );
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    syncBalances();
  }, [dispatch, user]);
}
