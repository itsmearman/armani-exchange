import React from "react";
import { useTranslations } from "next-intl";
interface LivePricesProps {
  prices: { [key: string]: string | number }
}
function LivePrices({ prices }:LivePricesProps) {
  const t = useTranslations();
  return (
    <div className="bg-white shadow rounded-lg p-6 items-center text-center w-full max-w-lg">
      <h2 className="text-lg font-bold text-black">{t("livePrice")}</h2>
      <p className="text-sm text-gray-900">
          {t("bitcoin")}   : 
          <strong className="font-light text-lg text-black">{prices.bitcoin ? ` ${prices.bitcoin} ` : t("fetching")}
        </strong>
      </p>
      <p className="text-sm text-gray-900">
          {t("ethereum")}  : 
          <strong className="font-light text-lg text-black">{prices.ethereum ? ` ${prices.ethereum} ` : t("fetching")}
        </strong>
      </p>
    </div>
  );
}

export default LivePrices;
