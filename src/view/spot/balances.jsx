import React from "react";
import { useTranslations } from "next-intl";
function Balances({ cashBalance, cryptoBalance }) {
  const t = useTranslations();
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md justify-items-center">
      <p className="text-sm text-gray-800">
      <strong className="font-light text-lg text-black">$ {cashBalance.toFixed(2)}{" "}</strong>
        : {t("balance")}
      </p>
      <p className="text-sm text-gray-800">
      <strong className="font-light text-lg text-black">BTC {cryptoBalance.bitcoin.toFixed(6)}{" "}</strong>
        : {t("bitcoinBalance")}
      </p>
      <p className="text-sm text-gray-800">
      <strong className="font-light text-lg text-black">ETH {cryptoBalance.ethereum.toFixed(4)}{" "}</strong>
        : {t("ethereumBalance")}
      </p>
    </div>
  );
}

export default Balances;
