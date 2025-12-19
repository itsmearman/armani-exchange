import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "@/lib/supabaseClient";
import { updateCashBalance, setCryptoBalance } from "@/src/store/slices/balancesSlice";
import { getCryptoNames } from "@/src/config/cryptocurrencies";

export function useBalanceSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        dispatch(updateCashBalance(0));
        // ریست کردن تمام ارزها
        getCryptoNames().forEach((cryptoName) => {
          dispatch(setCryptoBalance({ asset: cryptoName, amount: 0 }));
        });
        return;
      }

      // ساخت select query به صورت داینامیک
      const balanceFields = getCryptoNames()
        .map((name) => `${name}_balance`)
        .join(",");
      const selectQuery = `cash_balance,${balanceFields}`;

      const { data, error } = await supabase
        .from("profiles")
        .select(selectQuery)
        .eq("id", session.user.id)
        .single();

      if (data && !error) {
        dispatch(updateCashBalance(data.cash_balance || 0));
        
        // به‌روزرسانی موجودی تمام ارزها به صورت داینامیک
        getCryptoNames().forEach((cryptoName) => {
          const balanceKey = `${cryptoName}_balance` as keyof typeof data;
          const balance = (data[balanceKey] as number) || 0;
          // تنظیم مقدار دقیق
          dispatch(setCryptoBalance({ 
            asset: cryptoName, 
            amount: balance
          }));
        });
      }
    };

    getUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_OUT") {
          dispatch(updateCashBalance(0));
          // ریست کردن تمام ارزها
          getCryptoNames().forEach((cryptoName) => {
            dispatch(setCryptoBalance({ asset: cryptoName, amount: 0 }));
          });
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
