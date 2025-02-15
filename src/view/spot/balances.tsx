import React from "react";
import { useTranslations } from "next-intl";
interface BalancesProps {
  cashBalance: number;
  cryptoBalance: {
    [key: string]: number;
  };
}

function Balances({ cashBalance, cryptoBalance }: BalancesProps) {
  const cryptoKeys = Object.keys(cryptoBalance);

  const t = useTranslations();
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-lg items-center text-center">
      <p className="text-sm text-gray-800">
        {t("balance")} :
        <strong className="font-light text-lg text-black">
          $ {cashBalance.toFixed(2)}{" "}
        </strong>
      </p>
      {/* {cryptoKeys.map((key) => (
        <p className="text-sm text-gray-800" key={key}>
          {t(key)}:
          <strong className="font-light text-lg text-black">
          {key ? ` ${cryptoBalance[key].toFixed(6)} ` : t("fetching")}{t(`${key}symbol`)} 
          </strong>
        </p>
      ))} */}
      <p className="text-sm text-gray-800">
          {t("bitcoinBalance")} : 
        <strong className="font-light text-lg text-black">BTC {cryptoBalance.bitcoin.toFixed(6)}{" "}</strong>
        </p>
        <p className="text-sm text-gray-800">
          {t("ethereumBalance")} : 
        <strong className="font-light text-lg text-black">ETH {cryptoBalance.ethereum.toFixed(4)}{" "}</strong>
        </p>
    </div>
  );
}

export default Balances;
