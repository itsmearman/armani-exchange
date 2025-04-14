// hooks/useLivePrices.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePrices } from "@/src/store/slices/pricesSlice";

export default function useLivePrices() {
  const dispatch = useDispatch();

  useEffect(() => {
    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(updatePrices(data));
    };

    return () => {
      ws.close();
    };
  }, [dispatch]);
}
