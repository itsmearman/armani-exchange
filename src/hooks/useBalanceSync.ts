import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "@/lib/supabaseClient";
import { updateCashBalance, updateCryptoBalance } from "@/src/store/slices/balancesSlice";

export function useBalanceSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        dispatch(updateCashBalance(0));
        dispatch(updateCryptoBalance({ asset: "cardano", amount: 0}));
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("cash_balance,cardano_balance,ethereum_balance,bitcoin_balance")
        .eq("id", session.user.id)
        .single();

      if (data && !error) {
        dispatch(updateCashBalance(data.cash_balance?data.cash_balance: 0));
        dispatch(updateCryptoBalance({ asset: "bitcoin", amount: data.bitcoin_balance?data.bitcoin_balance: 0}));
        dispatch(updateCryptoBalance({ asset: "ethereum", amount: data.ethereum_balance?data.ethereum_balance: 0}));
        dispatch(updateCryptoBalance({ asset: "cardano", amount: data.cardano_balance?data.cardano_balance: 0}));
      }
    };

    getUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_OUT") {
          dispatch(updateCashBalance(0));
          dispatch(updateCryptoBalance({ asset: "cardano", amount: 0}));
        } else if (event === "SIGNED_IN") {
          await getUserProfile();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);
}
