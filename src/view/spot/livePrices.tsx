import React from "react";
import { useTranslations } from "next-intl";
// import TradeViewChart from "@dreygur/react-crypto-chart";

interface LivePricesProps {
  prices: { [key: string]: string | number };
}

function LivePrices({ prices }: LivePricesProps) {
  const t = useTranslations();
  const cryptoKeys = Object.keys(prices); // Extract the keys from the prices object

  return (
    <div className="shadow-md dark:shadow-white/50 rounded-lg p-6 items-center text-center w-full max-w-lg">
      <h2 className="text-lg font-bold ">{t("livePrice")}</h2>
      {/* <TradeViewChart pair="BTCBUSD" /> */}
      {cryptoKeys.map((key) => (
        <p className="text-sm" key={key}>
          {t(key)}:
          <strong className="font-light text-lg ">
            {prices[key] ? ` ${prices[key]} ` : t("fetching")}
          </strong>
        </p>
      ))}
    </div>
  );
}

export default LivePrices;


// import React from "react";
// import TradingViewWidget from "react-tradingview-widget";

// function TestWidget() {
//   return <TradingViewWidget symbol="BTCUSDT" />;
// }

// export default TestWidget;

